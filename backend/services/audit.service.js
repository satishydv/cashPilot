import AuditLog from "../models/AuditLog.js";

/**
 * Log an audit trail entry
 */
export const logAudit = async ({ userId = null, action, entityType, entityId = null, metadata = {} }) => {
  try {
    await AuditLog.create({
      userId,
      action,
      entityType,
      entityId,
      metadata,
    });
  } catch (err) {
    console.error("Audit log error:", err.message);
  }
};
