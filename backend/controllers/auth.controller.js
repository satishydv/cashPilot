import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import { generateToken } from "../utils/token.js";
import { logAudit } from "../services/audit.service.js";

/**
 * @desc    Login for Admin and Vendor
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find User
    const user = await User.findOne({ email: normalizedEmail }).populate("vendorId");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive. Please contact administrator.",
      });
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Issue JWT Token
    const token = generateToken({
      id: user._id,
      role: user.role,
      vendorId: user.vendorId?._id || null,
    });

    await logAudit({
      userId: user._id,
      action: "USER_LOGIN",
      entityType: "User",
      entityId: user._id,
      metadata: { role: user.role },
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          vendor: user.vendorId || null,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-passwordHash")
      .populate("vendorId");

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

/**
 * @desc    Bootstrap / Seed initial Admin account
 * @route   POST /api/auth/seed-admin
 * @access  Public
 */
export const seedAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await User.findOne({ role: "ADMIN" });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin account already exists",
      });
    }

    const adminName = name || "System Admin";
    const adminEmail = (email || "admin@fintech.com").toLowerCase().trim();
    const adminPassword = password || "Admin@123456";

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Initial Admin created successfully",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create Admin account",
      error: error.message,
    });
  }
};
