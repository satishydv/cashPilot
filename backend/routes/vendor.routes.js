import express from "express";
import {
  getVendorProfile,
  addOrUpdateBankAccount,
  getBankAccount,
  getVendorTransactions,
  getVendorPayouts,
  getVendorDashboardStats,
  createVendorDeposit,
} from "../controllers/vendor.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// All vendor routes require authentication and VENDOR role
router.use(authenticate, authorize("VENDOR"));

router.get("/profile", getVendorProfile);
router.post("/bank-account", addOrUpdateBankAccount);
router.get("/bank-account", getBankAccount);
router.get("/transactions", getVendorTransactions);
router.get("/payouts", getVendorPayouts);
router.get("/dashboard-stats", getVendorDashboardStats);
router.post("/deposit", createVendorDeposit);

export default router;
