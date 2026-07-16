const express = require("express");
const router = express.Router();

const {
  getAllSubscriptions,
  getSubscriptionByCollege,
  createSubscription,
  renewSubscription,
  cancelSubscription,
  getRevenueAnalytics,
} = require("../controllers/subscriptionController");

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

// Get all subscriptions
router.get("/subscriptions", protect, superAdminOnly, getAllSubscriptions);

// Get subscription by college
router.get("/subscriptions/college/:collegeId", protect, superAdminOnly, getSubscriptionByCollege);

// Create subscription
router.post("/subscriptions", protect, superAdminOnly, createSubscription);

// Renew subscription
router.put("/subscriptions/:id/renew", protect, superAdminOnly, renewSubscription);

// Cancel subscription
router.put("/subscriptions/:id/cancel", protect, superAdminOnly, cancelSubscription);

// Get revenue analytics
router.get("/subscriptions/analytics/revenue", protect, superAdminOnly, getRevenueAnalytics);

module.exports = router;
