import mongoose from "mongoose";

const webhookEventSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: [true, "Provider is required"],
    },
    eventId: {
      type: String,
      index: true,
      sparse: true,
      unique: true,
    },
    eventType: {
      type: String,
      required: [true, "Event type is required"],
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Payload is required"],
    },
    signature: {
      type: String,
      default: null,
    },
    processingStatus: {
      type: String,
      enum: ["PENDING", "PROCESSED", "FAILED"],
      default: "PENDING",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const WebhookEvent = mongoose.model("WebhookEvent", webhookEventSchema);

export default WebhookEvent;
export { WebhookEvent };
