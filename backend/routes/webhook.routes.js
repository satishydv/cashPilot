import express from "express";
import {
  handleCashfreeWebhook,
  simulateMockWebhook,
} from "../controllers/webhook.controller.js";

const router = express.Router();

router.post("/cashfree", handleCashfreeWebhook);
router.post("/mock", simulateMockWebhook);

export default router;
