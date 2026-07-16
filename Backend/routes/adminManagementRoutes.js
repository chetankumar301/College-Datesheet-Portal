const express = require("express");
const router = express.Router();

const {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/adminManagementController");

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

// Get all admins
router.get("/admins", protect, superAdminOnly, getAllAdmins);

// Create new admin
router.post("/admins", protect, superAdminOnly, createAdmin);

// Update admin
router.put("/admins/:id", protect, superAdminOnly, updateAdmin);

// Delete admin
router.delete("/admins/:id", protect, superAdminOnly, deleteAdmin);

module.exports = router;
