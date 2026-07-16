const express = require("express");
const router = express.Router();

const {
  getAllColleges,
  getCollege,
  createCollege,
  updateCollege,
  suspendCollege,
  activateCollege,
  deleteCollege,
  getCollegeStats,
} = require("../controllers/collegeController");

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

// Get all colleges
router.get("/colleges", protect, superAdminOnly, getAllColleges);

// Get college statistics
router.get("/colleges/stats", protect, superAdminOnly, getCollegeStats);

// Get single college
router.get("/colleges/:id", protect, superAdminOnly, getCollege);

// Create college
router.post("/colleges", protect, superAdminOnly, createCollege);

// Update college
router.put("/colleges/:id", protect, superAdminOnly, updateCollege);

// Suspend college
router.post("/colleges/:id/suspend", protect, superAdminOnly, suspendCollege);

// Activate college
router.post("/colleges/:id/activate", protect, superAdminOnly, activateCollege);

// Delete college
router.delete("/colleges/:id", protect, superAdminOnly, deleteCollege);

module.exports = router;
