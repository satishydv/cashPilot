import express from "express";
import {
  registerVendor,
  listVendors,
  getVendorById,
  updateCommissionRate,
  toggleVendorStatus,
  getAllTransactions,
  getAllPayouts,
  triggerPayout,
  getDashboardStats,
  getAuditLogs,
} from "../controllers/admin.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public / open per user request for easy testing, or can be guarded
router.post("/vendors", registerVendor);

// Protected Admin endpoints
router.get("/vendors", authenticate, authorize("ADMIN"), listVendors);
router.get("/vendors/:id", authenticate, authorize("ADMIN"), getVendorById);
router.patch("/vendors/:id/commission", authenticate, authorize("ADMIN"), updateCommissionRate);
router.patch("/vendors/:id/status", authenticate, authorize("ADMIN"), toggleVendorStatus);

router.get("/transactions", authenticate, authorize("ADMIN"), getAllTransactions);
router.get("/payouts", authenticate, authorize("ADMIN"), getAllPayouts);
router.post("/payouts/:id/execute", authenticate, authorize("ADMIN"), triggerPayout);

router.get("/dashboard-stats", authenticate, authorize("ADMIN"), getDashboardStats);
router.get("/audit-logs", authenticate, authorize("ADMIN"), getAuditLogs);

export default router;
