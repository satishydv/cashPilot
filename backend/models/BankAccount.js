import mongoose from "mongoose";

const bankAccountSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Vendor ID is required"],
      unique: true,
      index: true,
    },
    accountHolderName: {
      type: String,
      required: [true, "Account holder name is required"],
      trim: true,
    },
    accountNumber: {
      type: String,
      required: [true, "Account number is required"],
      trim: true,
    },
    ifsc: {
      type: String,
      required: [true, "IFSC code is required"],
      trim: true,
      uppercase: true,
    },
    bankName: {
      type: String,
      required: [true, "Bank name is required"],
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const BankAccount = mongoose.model("BankAccount", bankAccountSchema);

export default BankAccount;
export { BankAccount };
