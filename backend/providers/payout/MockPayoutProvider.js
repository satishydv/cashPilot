import crypto from "crypto";
import { PayoutProvider } from "./PayoutProvider.js";

export class MockPayoutProvider extends PayoutProvider {
  constructor() {
    super();
    this.name = "MOCK";
  }

  async initiatePayout({ transactionId, vendorId, amount, beneficiaryDetails, payoutMode = "IMPS" }) {
    const mockPayoutId = `mock_pout_${crypto.randomBytes(6).toString("hex")}`;

    return {
      success: true,
      provider: this.name,
      providerPayoutId: mockPayoutId,
      status: "SUCCESS",
      amount,
      payoutMode,
      beneficiaryDetails,
      rawResponse: {
        mock: true,
        transactionId,
        vendorId,
        providerPayoutId: mockPayoutId,
        transferredAt: new Date().toISOString(),
      },
    };
  }

  async getPayoutStatus(providerPayoutId) {
    return {
      success: true,
      provider: this.name,
      providerPayoutId,
      status: "SUCCESS",
    };
  }
}

export default MockPayoutProvider;
