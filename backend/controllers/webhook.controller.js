import { handleWebhook } from "../services/webhook.service.js";
import providerFactory from "../providers/providerFactory.js";

/**
 * @desc    Handle Cashfree payment and payout webhooks
 * @route   POST /api/webhooks/cashfree
 * @access  Public (Gateway)
 */
export const handleCashfreeWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];
    const eventId = req.headers["x-webhook-event-id"] || req.body?.event_id || req.body?.data?.order?.order_id;
    const eventType = req.body?.type || "PAYMENT_NOTIFICATION";

    // Signature verification (if enabled)
    if (signature && process.env.CASHFREE_SECRET_KEY) {
      const paymentProvider = providerFactory.getPaymentProvider("cashfree");
      const isVerified = await paymentProvider.verifyPayment({
        signature,
        rawBody: JSON.stringify(req.body),
        timestamp,
      });

      if (!isVerified.isValid) {
        return res.status(400).json({ success: false, message: "Invalid webhook signature" });
      }
    }

    const result = await handleWebhook({
      provider: "CASHFREE",
      eventId,
      eventType,
      payload: req.body,
      signature,
    });

    return res.status(200).json({
      success: true,
      message: "Cashfree webhook processed",
      data: result,
    });
  } catch (error) {
    console.error("Cashfree webhook processing error:", error);
    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
      error: error.message,
    });
  }
};

/**
 * @desc    Simulate Mock Webhook (for development and frontend testing)
 * @route   POST /api/webhooks/mock
 * @access  Public
 */
export const simulateMockWebhook = async (req, res) => {
  try {
    const { providerPaymentId, status = "SUCCESS", eventId } = req.body;

    if (!providerPaymentId) {
      return res.status(400).json({
        success: false,
        message: "providerPaymentId is required to simulate webhook",
      });
    }

    const generatedEventId = eventId || `mock_event_${providerPaymentId}_${Date.now()}`;

    const result = await handleWebhook({
      provider: "MOCK",
      eventId: generatedEventId,
      eventType: "PAYMENT_RESULT",
      payload: {
        providerPaymentId,
        status,
        simulatedAt: new Date().toISOString(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Mock webhook simulated",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Simulation failed",
      error: error.message,
    });
  }
};
