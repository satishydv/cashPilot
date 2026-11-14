import crypto from "crypto";
import Vendor from "../models/Vendor.js";
import Transaction from "../models/Transaction.js";
import Payment from "../models/Payment.js";
import { calculateFinancials } from "../utils/financial.js";
import providerFactory from "../providers/providerFactory.js";
import { logAudit } from "./audit.service.js";

/**
 * Initiate customer transaction and create payment gateway order
 */
export const createTransaction = async ({
  vendorId,
  customerName,
  customerPhone,
  customerEmail,
  amount,
  returnUrl,
}) => {
  // 1. Fetch Vendor
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    throw new Error("Vendor not found");
  }

  if (vendor.status !== "ACTIVE") {
    throw new Error("Vendor account is currently inactive");
  }

  // 2. Strict backend calculation using Vendor's current commission rate
  const financials = calculateFinancials(amount, vendor.commissionRate);

  // 3. Unique transaction reference
  const transactionReference = `TXN_${Date.now()}_${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

  // 4. Create Transaction record
  const transaction = await Transaction.create({
    vendorId: vendor._id,
    transactionReference,
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    customerEmail: customerEmail.trim().toLowerCase(),
    amount: financials.amount,
    commissionRate: financials.commissionRate,
    commissionAmount: financials.commissionAmount,
    netPayoutAmount: financials.netPayoutAmount,
    paymentStatus: "CREATED",
  });

  // 5. Initiate Order with Payment Provider
  const paymentProvider = providerFactory.getPaymentProvider();
  const orderResult = await paymentProvider.createOrder({
    orderId: transaction.transactionReference,
    amount: financials.amount,
    customerPhone: transaction.customerPhone,
    customerName: transaction.customerName,
    customerEmail: transaction.customerEmail,
    returnUrl,
  });

  // 6. Create initial Payment record
  const payment = await Payment.create({
    transactionId: transaction._id,
    provider: paymentProvider.name,
    providerPaymentId: orderResult.providerPaymentId,
    amount: financials.amount,
    status: "PENDING",
    rawResponse: orderResult.rawResponse,
  });

  // 7. Update transaction status
  transaction.paymentStatus = "PENDING";
  await transaction.save();

  await logAudit({
    action: "TRANSACTION_CREATED",
    entityType: "Transaction",
    entityId: transaction._id,
    metadata: {
      transactionReference,
      amount: financials.amount,
      commissionAmount: financials.commissionAmount,
      netPayoutAmount: financials.netPayoutAmount,
      provider: paymentProvider.name,
    },
  });

  return {
    transaction,
    payment,
    order: orderResult,
  };
};

export const getTransactionById = async (id) => {
  return await Transaction.findById(id).populate("vendorId", "businessName email phone commissionRate");
};

export const getTransactionByReference = async (reference) => {
  return await Transaction.findOne({ transactionReference: reference }).populate("vendorId", "businessName email phone");
};
