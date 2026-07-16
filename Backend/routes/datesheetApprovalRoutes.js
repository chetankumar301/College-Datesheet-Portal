const express = require("express");
const router = express.Router();

const {
  submitForApproval,
  approveDatesheet,
  rejectDatesheet,
  publishDatesheet,
  getPendingDatesheets,
  getApprovedDatesheets,
  getRejectedDatesheets,
  getPublishedDatesheets,
} = require("../controllers/datesheetApprovalController");

const { protect } = require("../middleware/authMiddleware");

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

// Submit datesheet for approval (Admin)
router.post("/datesheets/:id/submit", protect, submitForApproval);

// Approve datesheet (Sub Super Admin)
router.post("/datesheets/:id/approve", protect, subSuperAdminOnly, approveDatesheet);

// Reject datesheet (Sub Super Admin)
router.post("/datesheets/:id/reject", protect, subSuperAdminOnly, rejectDatesheet);

// Publish datesheet (Sub Super Admin)
router.post("/datesheets/:id/publish", protect, subSuperAdminOnly, publishDatesheet);

// Get pending approval datesheets (Sub Super Admin)
router.get("/datesheets/pending/:collegeId", protect, subSuperAdminOnly, getPendingDatesheets);

// Get approved datesheets (Sub Super Admin)
router.get("/datesheets/approved/:collegeId", protect, subSuperAdminOnly, getApprovedDatesheets);

// Get rejected datesheets (Sub Super Admin)
router.get("/datesheets/rejected/:collegeId", protect, subSuperAdminOnly, getRejectedDatesheets);

// Get published datesheets (Public/Student)
router.get("/datesheets/published/:collegeId", getPublishedDatesheets);

module.exports = router;
