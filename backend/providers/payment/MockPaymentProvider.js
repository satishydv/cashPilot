import crypto from "crypto";
import { PaymentProvider } from "./PaymentProvider.js";

export class MockPaymentProvider extends PaymentProvider {
  constructor() {
    super();
    this.name = "MOCK";
  }

  async createOrder({ orderId, amount, customerPhone, customerName, customerEmail }) {
    const mockPaymentId = `mock_pay_${crypto.randomBytes(6).toString("hex")}`;
    const mockSessionId = `mock_session_${crypto.randomBytes(8).toString("hex")}`;

    return {
      success: true,
      provider: this.name,
      orderId,
      providerPaymentId: mockPaymentId,
      paymentSessionId: mockSessionId,
      paymentUrl: `http://localhost:5000/api/webhooks/mock-checkout?session_id=${mockSessionId}&order_id=${orderId}`,
      amount,
      rawResponse: {
        mock: true,
        orderId,
        mockPaymentId,
        createdAt: new Date().toISOString(),
      },
    };
  }

  async verifyPayment({ providerPaymentId, status }) {
    return {
      isValid: true,
      provider: this.name,
      providerPaymentId,
      status: status || "SUCCESS",
    };
  }
}

export default MockPaymentProvider;
