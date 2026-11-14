import Payout from "../models/Payout.js";
import BankAccount from "../models/BankAccount.js";
import providerFactory from "../providers/providerFactory.js";
import { logAudit } from "./audit.service.js";

/**
 * Execute a pending payout
 */
export const executePayout = async (payoutId) => {
  const payout = await Payout.findById(payoutId).populate("vendorId");
  if (!payout) {
    throw new Error("Payout record not found");
  }

  if (payout.status === "SUCCESS") {
    return { message: "Payout already completed", payout };
  }

  // 1. Verify vendor has active bank account
  const bankAccount = await BankAccount.findOne({ vendorId: payout.vendorId._id });
  if (!bankAccount) {
    payout.status = "FAILED";
    payout.failureReason = "Vendor bank account not found";
    await payout.save();
    return { success: false, message: payout.failureReason, payout };
  }

  // 2. Mark PROCESSING
  payout.status = "PROCESSING";
  await payout.save();

  try {
    const payoutProvider = providerFactory.getPayoutProvider();
    const result = await payoutProvider.initiatePayout({
      transferId: `PAYOUT_${payout._id}`,
      amount: payout.amount,
      payoutMode: payout.payoutMode,
      beneficiaryDetails: {
        accountHolderName: bankAccount.accountHolderName,
        accountNumber: bankAccount.accountNumber,
        ifsc: bankAccount.ifsc,
        bankName: bankAccount.bankName,
      },
    });

    if (result.success) {
      payout.status = "SUCCESS";
      payout.providerPayoutId = result.providerPayoutId;
      payout.failureReason = null;
    } else {
      payout.status = "FAILED";
      payout.failureReason = result.failureReason || "Payout transfer failed";
    }

    await payout.save();

    await logAudit({
      action: payout.status === "SUCCESS" ? "PAYOUT_SUCCESS" : "PAYOUT_FAILED",
      entityType: "Payout",
      entityId: payout._id,
      metadata: {
        amount: payout.amount,
        provider: payoutProvider.name,
        providerPayoutId: payout.providerPayoutId,
        status: payout.status,
      },
    });

    return { success: payout.status === "SUCCESS", payout };
  } catch (err) {
    payout.status = "FAILED";
    payout.failureReason = err.message;
    await payout.save();
    throw err;
  }
};
