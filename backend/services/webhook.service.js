import WebhookEvent from "../models/WebhookEvent.js";
import { processPaymentSuccess, processPaymentFailure } from "./payment.service.js";

/**
 * Process incoming gateway webhooks with idempotency protection
 */
export const handleWebhook = async ({
  provider,
  eventId,
  eventType,
  payload,
  signature = null,
}) => {
  // 1. Check if eventId has already been recorded
  if (eventId) {
    const existing = await WebhookEvent.findOne({ eventId });
    if (existing) {
      return {
        isDuplicate: true,
        message: "Webhook event already processed",
        eventId,
      };
    }
  }

  // 2. Record initial WebhookEvent
  const webhookRecord = await WebhookEvent.create({
    provider,
    eventId: eventId || null,
    eventType,
    payload,
    signature,
    processingStatus: "PENDING",
  });

  try {
    // 3. Process based on eventType / provider
    let result = null;

    if (provider === "CASHFREE") {
      const data = payload?.data || payload;
      const paymentStatus = data?.payment?.payment_status || data?.order?.order_status;
      const providerPaymentId = data?.payment?.cf_payment_id || data?.order?.cf_order_id;

      if (paymentStatus === "SUCCESS") {
        result = await processPaymentSuccess({
          providerPaymentId,
          provider: "CASHFREE",
          rawResponse: payload,
        });
      } else if (paymentStatus === "FAILED" || paymentStatus === "USER_DROPPED") {
        result = await processPaymentFailure({
          providerPaymentId,
          failureReason: data?.payment?.payment_message || "Cashfree payment failed",
        });
      }
    } else {
      // MOCK or Generic simulation
      const { providerPaymentId, status } = payload;
      if (status === "SUCCESS") {
        result = await processPaymentSuccess({
          providerPaymentId,
          provider: provider || "MOCK",
          rawResponse: payload,
        });
      } else {
        result = await processPaymentFailure({
          providerPaymentId,
          failureReason: payload.failureReason || "Payment failed",
        });
      }
    }

    webhookRecord.processingStatus = "PROCESSED";
    await webhookRecord.save();

    return {
      isDuplicate: false,
      success: true,
      webhookRecord,
      result,
    };
  } catch (error) {
    webhookRecord.processingStatus = "FAILED";
    await webhookRecord.save();
    throw error;
  }
};
