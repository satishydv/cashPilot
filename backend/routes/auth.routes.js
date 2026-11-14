import express from "express";
import { login, getMe, seedAdmin } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", authenticate, getMe);
router.post("/seed-admin", seedAdmin);

export default router;
