import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: [true, "Transaction ID is required"],
      index: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Vendor ID is required"],
      index: true,
    },
    provider: {
      type: String,
      required: [true, "Provider is required"],
      default: "MOCK",
    },
    providerPayoutId: {
      type: String,
      default: null,
      index: true,
      trim: true,
    },
    beneficiaryId: {
      type: String,
      default: null,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Payout amount is required"],
      min: [0, "Payout amount cannot be negative"],
    },
    payoutMode: {
      type: String,
      enum: ["IMPS", "NEFT"],
      default: "IMPS",
    },
    status: {
      type: String,
      enum: [
        "NOT_INITIATED",
        "PENDING",
        "PROCESSING",
        "SUCCESS",
        "FAILED",
      ],
      default: "NOT_INITIATED",
      index: true,
    },
    failureReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

payoutSchema.index({ createdAt: -1 });

const Payout = mongoose.model("Payout", payoutSchema);

export default Payout;
export { Payout };
