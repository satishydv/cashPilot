import mongoose from "mongoose";
import Payment from "../models/Payment.js";
import Transaction from "../models/Transaction.js";
import Payout from "../models/Payout.js";
import BankAccount from "../models/BankAccount.js";
import { logAudit } from "./audit.service.js";

/**
 * Handle successful payment event with atomic database updates
 */
export const processPaymentSuccess = async ({
  providerPaymentId,
  provider = "MOCK",
  rawResponse = {},
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Find Payment record
    const payment = await Payment.findOne({ providerPaymentId }).session(session);
    if (!payment) {
      throw new Error(`Payment record with providerPaymentId ${providerPaymentId} not found`);
    }

    // 2. Idempotency check: if already SUCCESS, return early
    if (payment.status === "SUCCESS") {
      await session.abortTransaction();
      session.endSession();
      return { alreadyProcessed: true, payment };
    }

    // 3. Find associated Transaction
    const transaction = await Transaction.findById(payment.transactionId).session(session);
    if (!transaction) {
      throw new Error(`Transaction with ID ${payment.transactionId} not found`);
    }

    // 4. Update Payment record
    payment.status = "SUCCESS";
    payment.rawResponse = rawResponse;
    await payment.save({ session });

    // 5. Update Transaction status
    transaction.paymentStatus = "SUCCESS";
    await transaction.save({ session });

    // 6. Check if vendor has a bank account configured
    const bankAccount = await BankAccount.findOne({ vendorId: transaction.vendorId }).session(session);

    // 7. Create Payout record atomically
    const [payout] = await Payout.create(
      [
        {
          transactionId: transaction._id,
          vendorId: transaction.vendorId,
          provider,
          amount: transaction.netPayoutAmount,
          payoutMode: "IMPS",
          status: bankAccount ? "PENDING" : "NOT_INITIATED",
          failureReason: bankAccount ? null : "Vendor bank account not configured",
        },
      ],
      { session }
    );

    await session.commitTransaction();

    await logAudit({
      action: "PAYMENT_SUCCESS",
      entityType: "Payment",
      entityId: payment._id,
      metadata: {
        transactionId: transaction._id,
        payoutId: payout._id,
        amount: transaction.amount,
        commissionAmount: transaction.commissionAmount,
        netPayoutAmount: transaction.netPayoutAmount,
      },
    });

    return {
      alreadyProcessed: false,
      payment,
      transaction,
      payout,
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Handle failed payment event
 */
export const processPaymentFailure = async ({ providerPaymentId, failureReason = "Payment failed" }) => {
  const payment = await Payment.findOne({ providerPaymentId });
  if (!payment) return null;

  payment.status = "FAILED";
  await payment.save();

  await Transaction.findByIdAndUpdate(payment.transactionId, { paymentStatus: "FAILED" });

  await logAudit({
    action: "PAYMENT_FAILED",
    entityType: "Payment",
    entityId: payment._id,
    metadata: { failureReason },
  });

  return payment;
};
