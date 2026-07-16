const express = require("express");
const router = express.Router();

const {
  getAllAuditLogs,
  getAuditLogsByEntity,
  getAuditLogsByUser,
} = require("../controllers/auditLogController");

const { protect } = require("../middleware/authMiddleware");

// Middleware to check if user is super admin or sub super admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== "super_admin" && req.user.role !== "sub_super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }
  next();
};

// Get all audit logs
router.get("/audit-logs", protect, adminOnly, getAllAuditLogs);

// Get audit logs by entity
router.get("/audit-logs/entity/:entityType/:entityId", protect, adminOnly, getAuditLogsByEntity);

// Get audit logs by user
router.get("/audit-logs/user/:userId", protect, adminOnly, getAuditLogsByUser);

module.exports = router;
