const express = require("express");
const router = express.Router();

const {
  getPlatformAnalytics,
  getCollegeAnalytics,
  getAdminActivity,
} = require("../controllers/analyticsController");

const { protect } = require("../middleware/authMiddleware");

// Middleware to check if user is super admin
const superAdminOnly = (req, res, next) => {
  if (req.user.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Super admin only.",
    });
  }
  next();
};

// Middleware to check if user is sub super admin
const subSuperAdminOnly = (req, res, next) => {
  if (req.user.role !== "sub_super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Sub super admin only.",
    });
  }
  next();
};

// Get platform analytics (Super Admin only)
router.get("/platform", protect, superAdminOnly, getPlatformAnalytics);
router.get("/analytics/platform", protect, superAdminOnly, getPlatformAnalytics);

// Get college analytics (Sub Super Admin only)
router.get("/college/:collegeId", protect, subSuperAdminOnly, getCollegeAnalytics);
router.get("/analytics/college/:collegeId", protect, subSuperAdminOnly, getCollegeAnalytics);

// Get admin activity (Sub Super Admin only)
router.get("/admin-activity/:collegeId", protect, subSuperAdminOnly, getAdminActivity);
router.get("/analytics/admin-activity/:collegeId", protect, subSuperAdminOnly, getAdminActivity);

module.exports = router;
