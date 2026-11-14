import crypto from "crypto";
import { PaymentProvider } from "./PaymentProvider.js";

export class CashfreePaymentProvider extends PaymentProvider {
  constructor() {
    super();
    this.name = "CASHFREE";
    this.appId = process.env.CASHFREE_APP_ID || "";
    this.secretKey = process.env.CASHFREE_SECRET_KEY || "";
    this.baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg";
  }

  async createOrder({ orderId, amount, customerPhone, customerName, customerEmail, returnUrl }) {
    if (!this.appId || !this.secretKey) {
      throw new Error("Cashfree credentials (CASHFREE_APP_ID, CASHFREE_SECRET_KEY) are not configured");
    }

    const payload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: `cust_${customerPhone}`,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: returnUrl || `${process.env.SERVER_URL || "http://localhost:5000"}/api/webhooks/cashfree-return?order_id={order_id}`,
      },
    };

    const response = await fetch(`${this.baseUrl}/orders`, {
      method: "POST",
      headers: {
        "x-client-id": this.appId,
        "x-client-secret": this.secretKey,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create Cashfree order");
    }

    return {
      success: true,
      provider: this.name,
      orderId,
      providerPaymentId: data.cf_order_id,
      paymentSessionId: data.payment_session_id,
      paymentUrl: data.payments ? data.payments.url : null,
      amount,
      rawResponse: data,
    };
  }

  async verifyPayment({ signature, rawBody, timestamp }) {
    if (!this.secretKey) {
      return { isValid: false, message: "Cashfree secret key not set" };
    }

    // Verify Cashfree Webhook Signature using HMAC SHA256
    const expectedSignature = crypto
      .createHmac("sha256", this.secretKey)
      .update(timestamp + rawBody)
      .digest("base64");

    const isValid = signature === expectedSignature;
    return {
      isValid,
      provider: this.name,
    };
  }
}

export default CashfreePaymentProvider;
