import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: [true, "Transaction ID is required"],
      index: true,
    },
    provider: {
      type: String,
      required: [true, "Provider is required"],
      default: "MOCK",
    },
    providerPaymentId: {
      type: String,
      required: [true, "Provider payment ID is required"],
      index: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      index: true,
      default: "PENDING",
    },
    rawResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
export { Payment };
