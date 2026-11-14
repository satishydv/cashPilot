import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Vendor ID is required"],
      index: true,
    },
    transactionReference: {
      type: String,
      required: [true, "Transaction reference is required"],
      unique: true,
      index: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, "Customer phone is required"],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, "Customer email is required"],
      trim: true,
      lowercase: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be at least 1"],
    },
    commissionRate: {
      type: Number,
      required: [true, "Commission rate is required"],
      min: [0, "Commission rate cannot be negative"],
      max: [100, "Commission rate cannot exceed 100"],
    },
    commissionAmount: {
      type: Number,
      required: [true, "Commission amount is required"],
      min: [0, "Commission amount cannot be negative"],
    },
    netPayoutAmount: {
      type: Number,
      required: [true, "Net payout amount is required"],
      min: [0, "Net payout amount cannot be negative"],
    },
    paymentStatus: {
      type: String,
      enum: ["CREATED", "PENDING", "SUCCESS", "FAILED"],
      default: "CREATED",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({ createdAt: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
export { Transaction };
