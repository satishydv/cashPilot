import { PayoutProvider } from "./PayoutProvider.js";

export class CashfreePayoutProvider extends PayoutProvider {
  constructor() {
    super();
    this.name = "CASHFREE";
    this.clientId = process.env.CASHFREE_APP_ID || "";
    this.clientSecret = process.env.CASHFREE_SECRET_KEY || "";
    this.baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://payout-api.cashfree.com/payout/v1"
        : "https://payout-gamma.cashfree.com/payout/v1";
  }

  async getAuthToken() {
    const response = await fetch(`${this.baseUrl}/authorize`, {
      method: "POST",
      headers: {
        "X-Client-Id": this.clientId,
        "X-Client-Secret": this.clientSecret,
      },
    });
    const data = await response.json();
    if (data.status !== "SUCCESS") {
      throw new Error(data.message || "Cashfree Payout authentication failed");
    }
    return data.data.token;
  }

  async initiatePayout({ transferId, amount, beneficiaryDetails, payoutMode = "IMPS" }) {
    if (!this.clientId || !this.clientSecret) {
      throw new Error("Cashfree payout credentials are not configured");
    }

    const token = await this.getAuthToken();

    const payload = {
      beneId: beneficiaryDetails.beneId,
      amount: amount.toString(),
      transferId,
      transferMode: payoutMode,
      remarks: "Vendor Payout Transfer",
    };

    const response = await fetch(`${this.baseUrl}/requestTransfer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return {
      success: data.status === "SUCCESS",
      provider: this.name,
      providerPayoutId: data.data?.referenceId || transferId,
      status: data.status === "SUCCESS" ? "PENDING" : "FAILED",
      failureReason: data.status !== "SUCCESS" ? data.message : null,
      rawResponse: data,
    };
  }

  async getPayoutStatus(transferId) {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/getTransferStatus?transferId=${transferId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  }
}

export default CashfreePayoutProvider;
