const express = require("express");
const router = express.Router();

const {
  getAllAdmins,
  getAllSubSuperAdmins,
  getCollegeAdmins,
  getCollegeOwners,
  createAdmin,
  resendAdminCredentials,
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

// Get all admins (super admin only)
router.get("/admins", protect, superAdminOnly, getAllAdmins);

// Get all sub super admins (super admin only)
router.get("/sub-super-admins", protect, superAdminOnly, getAllSubSuperAdmins);

// Get admins for a specific college (sub super admin only)
router.get("/college/:collegeId/admins", protect, subSuperAdminOnly, getCollegeAdmins);
router.get("/college/:collegeId/owners", protect, superAdminOnly, getCollegeOwners);

// Create new admin (super admin or sub super admin)
router.post("/admins", protect, createAdmin);

// Sub super admin scoped aliases
router.get("/my-college/admins", protect, subSuperAdminOnly, (req, res) => {
  req.params.collegeId = req.user.college;
  return getCollegeAdmins(req, res);
});
router.post("/my-college/admins", protect, subSuperAdminOnly, createAdmin);

// Regenerate and resend temporary credentials
router.post("/admins/:id/resend-credentials", protect, resendAdminCredentials);

// Update admin (super admin or sub super admin)
router.put("/admins/:id", protect, updateAdmin);

// Delete admin (super admin or sub super admin)
router.delete("/admins/:id", protect, deleteAdmin);

module.exports = router;
