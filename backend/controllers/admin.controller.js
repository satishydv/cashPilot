import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import BankAccount from "../models/BankAccount.js";
import Transaction from "../models/Transaction.js";
import Payout from "../models/Payout.js";
import AuditLog from "../models/AuditLog.js";
import { logAudit } from "../services/audit.service.js";
import { executePayout } from "../services/payout.service.js";

/**
 * @desc    Register a new Vendor and create their User account
 * @route   POST /api/admin/vendors
 * @access  Admin
 */
export const registerVendor = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      businessName,
      email,
      phone,
      commissionRate,
      password,
      contactName,
    } = req.body;

    // 1. Basic validation
    if (!businessName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "businessName, email, phone, and password are required fields",
      });
    }

    if (commissionRate === undefined || commissionRate === null || isNaN(commissionRate)) {
      return res.status(400).json({
        success: false,
        message: "Valid commissionRate is required",
      });
    }

    if (commissionRate < 0 || commissionRate > 100) {
      return res.status(400).json({
        success: false,
        message: "commissionRate must be between 0 and 100",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Check duplicate email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    const existingVendor = await Vendor.findOne({ email: normalizedEmail });
    if (existingVendor) {
      return res.status(409).json({
        success: false,
        message: "A vendor with this email already exists",
      });
    }

    // 3. Hash vendor's password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    let createdVendor;
    let createdUser;

    // 4. Create Vendor and User with transaction
    session.startTransaction();

    const [vendor] = await Vendor.create(
      [
        {
          businessName: businessName.trim(),
          email: normalizedEmail,
          phone: phone.trim(),
          commissionRate: Number(commissionRate),
          status: "ACTIVE",
        },
      ],
      { session }
    );

    const [user] = await User.create(
      [
        {
          name: contactName ? contactName.trim() : businessName.trim(),
          email: normalizedEmail,
          passwordHash,
          role: "VENDOR",
          vendorId: vendor._id,
          isActive: true,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    createdVendor = vendor;
    createdUser = user;

    await logAudit({
      userId: req.user?._id || null,
      action: "VENDOR_REGISTERED",
      entityType: "Vendor",
      entityId: createdVendor._id,
      metadata: {
        businessName: createdVendor.businessName,
        commissionRate: createdVendor.commissionRate,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Vendor and user account registered successfully",
      data: {
        vendor: {
          id: createdVendor._id,
          businessName: createdVendor.businessName,
          email: createdVendor.email,
          phone: createdVendor.phone,
          commissionRate: createdVendor.commissionRate,
          status: createdVendor.status,
          createdAt: createdVendor.createdAt,
        },
        user: {
          id: createdUser._id,
          name: createdUser.name,
          email: createdUser.email,
          role: createdUser.role,
          isActive: createdUser.isActive,
          createdAt: createdUser.createdAt,
        },
      },
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    console.error("Error registering vendor:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register vendor",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

/**
 * @desc    Get all vendors
 * @route   GET /api/admin/vendors
 * @access  Admin
 */
export const listVendors = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status) {
      query.status = status.toUpperCase();
    }

    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const vendors = await Vendor.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendors",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single vendor by ID with bank details
 * @route   GET /api/admin/vendors/:id
 * @access  Admin
 */
export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    const bankAccount = await BankAccount.findOne({ vendorId: vendor._id });

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
      message: "Failed to fetch vendor",
      error: error.message,
    });
  }
};

/**
 * @desc    Update dynamic commission rate for a vendor
 * @route   PATCH /api/admin/vendors/:id/commission
 * @access  Admin
 */
export const updateCommissionRate = async (req, res) => {
  try {
    const { commissionRate } = req.body;

    if (commissionRate === undefined || isNaN(commissionRate) || commissionRate < 0 || commissionRate > 100) {
      return res.status(400).json({
        success: false,
        message: "A valid commissionRate between 0 and 100 is required",
      });
    }

    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    const previousRate = vendor.commissionRate;
    vendor.commissionRate = Number(commissionRate);
    await vendor.save();

    await logAudit({
      userId: req.user?._id || null,
      action: "COMMISSION_RATE_UPDATED",
      entityType: "Vendor",
      entityId: vendor._id,
      metadata: {
        previousRate,
        newRate: vendor.commissionRate,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Commission rate updated successfully",
      data: vendor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update commission rate",
      error: error.message,
    });
  }
};

/**
 * @desc    Toggle Vendor Status (ACTIVE / INACTIVE)
 * @route   PATCH /api/admin/vendors/:id/status
 * @access  Admin
 */
export const toggleVendorStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either ACTIVE or INACTIVE",
      });
    }

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Vendor marked as ${status}`,
      data: vendor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update vendor status",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all transactions across the platform
 * @route   GET /api/admin/transactions
 * @access  Admin
 */
export const getAllTransactions = async (req, res) => {
  try {
    const { vendorId, paymentStatus } = req.query;
    const query = {};

    if (vendorId) query.vendorId = vendorId;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const transactions = await Transaction.find(query)
      .populate("vendorId", "businessName email phone")
      .sort({ createdAt: -1 });

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
 * @desc    Get all payouts across the platform
 * @route   GET /api/admin/payouts
 * @access  Admin
 */
export const getAllPayouts = async (req, res) => {
  try {
    const { status, vendorId } = req.query;
    const query = {};

    if (status) query.status = status;
    if (vendorId) query.vendorId = vendorId;

    const payouts = await Payout.find(query)
      .populate("vendorId", "businessName email")
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
 * @desc    Trigger a pending payout
 * @route   POST /api/admin/payouts/:id/execute
 * @access  Admin
 */
export const triggerPayout = async (req, res) => {
  try {
    const result = await executePayout(req.params.id);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to execute payout",
      error: error.message,
    });
  }
};

/**
 * @desc    Get Admin platform dashboard statistics
 * @route   GET /api/admin/dashboard-stats
 * @access  Admin
 */
export const getDashboardStats = async (req, res) => {
  try {
    const totalVendors = await Vendor.countDocuments();
    const activeVendors = await Vendor.countDocuments({ status: "ACTIVE" });

    const transactionAgg = await Transaction.aggregate([
      { $match: { paymentStatus: "SUCCESS" } },
      {
        $group: {
          _id: null,
          totalVolume: { $sum: "$amount" },
          totalCommission: { $sum: "$commissionAmount" },
          totalNetPayout: { $sum: "$netPayoutAmount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const payoutAgg = await Payout.aggregate([
      { $match: { status: "SUCCESS" } },
      {
        $group: {
          _id: null,
          totalDisbursed: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = transactionAgg[0] || {
      totalVolume: 0,
      totalCommission: 0,
      totalNetPayout: 0,
      count: 0,
    };

    const payoutStats = payoutAgg[0] || {
      totalDisbursed: 0,
      count: 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        totalVendors,
        activeVendors,
        totalTransactions: stats.count,
        totalVolume: stats.totalVolume,
        totalCommissionEarned: stats.totalCommission,
        totalNetPayoutDue: stats.totalNetPayout,
        totalPayoutsDisbursed: payoutStats.totalDisbursed,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics",
      error: error.message,
    });
  }
};

/**
 * @desc    Get system audit logs
 * @route   GET /api/admin/audit-logs
 * @access  Admin
 */
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
      error: error.message,
    });
  }
};
