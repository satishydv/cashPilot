import { verifyToken } from "../utils/token.js";
import User from "../models/User.js";

/**
 * Authenticate incoming Bearer JWT Token
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or account is deactivated",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

/**
 * Authorize specific roles
 * @param  {...string} roles - e.g. 'ADMIN', 'VENDOR'
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to roles [${roles.join(", ")}]`,
      });
    }
    next();
  };
};
