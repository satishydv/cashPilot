import BankAccount from "../models/BankAccount.js";
import Vendor from "../models/Vendor.js";
import Transaction from "../models/Transaction.js";
import Payout from "../models/Payout.js";
import { logAudit } from "../services/audit.service.js";
import { createTransaction } from "../services/transaction.service.js";

/**
 * @desc    Get logged in vendor profile
 * @route   GET /api/vendor/profile
 * @access  Vendor
 */
export const getVendorProfile = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    if (!vendorId) {
      return res.status(400).json({ success: false, message: "User is not linked to a vendor" });
    }

    const vendor = await Vendor.findById(vendorId);
    const bankAccount = await BankAccount.findOne({ vendorId });

    return res.status(200).json({
      success: true,
      data: {
        vendor,
        bankAccount: bankAccount || null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor profile",
      error: error.message,
    });
  }
};

/**
 * @desc    Add or update vendor's bank account details
 * @route   POST /api/vendor/bank-account
 * @access  Vendor
 */
export const addOrUpdateBankAccount = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    if (!vendorId) {
      return res.status(400).json({ success: false, message: "User is not linked to a vendor" });
    }

    const { accountHolderName, accountNumber, ifsc, bankName } = req.body;

    if (!accountHolderName || !accountNumber || !ifsc || !bankName) {
      return res.status(400).json({
        success: false,
        message: "accountHolderName, accountNumber, ifsc, and bankName are required",
      });
    }

    const bankAccount = await BankAccount.findOneAndUpdate(
      { vendorId },
      {
        accountHolderName: accountHolderName.trim(),
        accountNumber: accountNumber.trim(),
        ifsc: ifsc.trim().toUpperCase(),
        bankName: bankName.trim(),
        verified: true,
      },
      { new: true, upsert: true }
    );

    // If there were any payouts stuck in NOT_INITIATED due to missing bank account, update to PENDING
    await Payout.updateMany(
      { vendorId, status: "NOT_INITIATED" },
      { status: "PENDING", failureReason: null }
    );

    await logAudit({
      userId: req.user._id,
      action: "BANK_ACCOUNT_UPDATED",
      entityType: "BankAccount",
      entityId: bankAccount._id,
      metadata: { vendorId },
    });

    return res.status(200).json({
      success: true,
      message: "Bank account saved successfully",
      data: bankAccount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to save bank account",
      error: error.message,
    });
  }
};

/**
 * @desc    Get vendor's bank account details
 * @route   GET /api/vendor/bank-account
 * @access  Vendor
 */
export const getBankAccount = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    const bankAccount = await BankAccount.findOne({ vendorId });

    return res.status(200).json({
      success: true,
      data: bankAccount || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bank account",
      error: error.message,
    });
  }
};

/**
 * @desc    Get vendor's transactions
 * @route   GET /api/vendor/transactions
 * @access  Vendor
 */
export const getVendorTransactions = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    const { paymentStatus } = req.query;

    const query = { vendorId };
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};

/**
 * @desc    Get vendor's payouts
 * @route   GET /api/vendor/payouts
 * @access  Vendor
 */
export const getVendorPayouts = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    const { status } = req.query;

    const query = { vendorId };
    if (status) query.status = status;

    const payouts = await Payout.find(query)
      .populate("transactionId", "transactionReference amount customerName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payouts.length,
      data: payouts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payouts",
      error: error.message,
    });
  }
};

/**
 * @desc    Get vendor dashboard metrics
 * @route   GET /api/vendor/dashboard-stats
 * @access  Vendor
 */
export const getVendorDashboardStats = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;

    const transactionAgg = await Transaction.aggregate([
      { $match: { vendorId, paymentStatus: "SUCCESS" } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$amount" },
          totalCommissionDeducted: { $sum: "$commissionAmount" },
          totalNetEarnings: { $sum: "$netPayoutAmount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const payoutAgg = await Payout.aggregate([
      { $match: { vendorId } },
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = transactionAgg[0] || {
      totalSales: 0,
      totalCommissionDeducted: 0,
      totalNetEarnings: 0,
      count: 0,
    };

    let settledPayouts = 0;
    let pendingPayouts = 0;

    payoutAgg.forEach((item) => {
      if (item._id === "SUCCESS") {
        settledPayouts += item.totalAmount;
      } else if (item._id === "PENDING" || item._id === "NOT_INITIATED" || item._id === "PROCESSING") {
        pendingPayouts += item.totalAmount;
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        totalOrders: stats.count,
        totalSales: stats.totalSales,
        totalCommissionDeducted: stats.totalCommissionDeducted,
        totalNetEarnings: stats.totalNetEarnings,
        settledPayouts,
        pendingPayouts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor dashboard statistics",
      error: error.message,
    });
  }
};

/**
 * @desc    Initiate a deposit / payment collection for the logged-in vendor
 * @route   POST /api/vendor/deposit
 * @access  Vendor
 */
export const createVendorDeposit = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    if (!vendorId) {
      return res.status(400).json({ success: false, message: "User is not linked to a vendor" });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor record not found" });
    }

    const {
      amount,
      customerName,
      customerPhone,
      customerEmail,
      note,
      depositType = "CUSTOMER_PAYMENT",
      returnUrl,
    } = req.body;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid deposit amount greater than 0 is required",
      });
    }

    // Default to vendor's business information if not specified (e.g. for self-deposit/working capital top-up)
    const depositorName = customerName?.trim() || vendor.businessName;
    const depositorPhone = customerPhone?.trim() || vendor.phone;
    const depositorEmail = customerEmail?.trim().toLowerCase() || vendor.email;

    const result = await createTransaction({
      vendorId: vendor._id,
      customerName: depositorName,
      customerPhone: depositorPhone,
      customerEmail: depositorEmail,
      amount: Number(amount),
      returnUrl,
    });

    await logAudit({
      userId: req.user._id,
      action: "VENDOR_DEPOSIT_INITIATED",
      entityType: "Transaction",
      entityId: result.transaction._id,
      metadata: {
        vendorId: vendor._id,
        amount: Number(amount),
        depositType,
        note: note || "",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Deposit initiated successfully",
      data: {
        ...result,
        depositType,
        note,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to initiate deposit",
    });
  }
};
