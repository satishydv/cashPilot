import express from "express";
import {
  initiateTransaction,
  getTransactionDetails,
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/", initiateTransaction);
router.get("/:identifier", getTransactionDetails);

export default router;
