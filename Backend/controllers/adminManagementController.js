const Admin = require("../models/Admin");
const College = require("../models/College");
const bcrypt = require("bcryptjs");

// Get all admins (super admin only)
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ role: "admin" })
      .populate("college", "name code")
      .select("-password");
    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get all sub super admins (super admin only)
const getAllSubSuperAdmins = async (req, res) => {
  try {
    const subSuperAdmins = await Admin.find({ role: "sub_super_admin" })
      .populate("college", "name code")
      .select("-password");
    res.status(200).json({
      success: true,
      data: subSuperAdmins,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get admins for a specific college (sub super admin only)
const getCollegeAdmins = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const admins = await Admin.find({ college: collegeId, role: "admin" })
      .select("-password");
    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Create new admin (super admin or sub super admin)
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, college, permissions } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role based on requester
    let role = "admin";
    let adminCollege = college;

    if (req.user.role === "super_admin") {
      // Super admin can create sub super admins or regular admins
      role = req.body.role || "admin";
    } else if (req.user.role === "sub_super_admin") {
      // Sub super admin can only create regular admins for their college
      role = "admin";
      adminCollege = req.user.college;
    }

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role,
      college: adminCollege,
      permissions: permissions || {},
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: admin,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update admin (super admin or sub super admin)
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, permissions, isActive } = req.body;

    const updateData = { name, email };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    if (permissions) {
      updateData.permissions = permissions;
    }
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    const admin = await Admin.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: admin,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete admin (super admin or sub super admin)
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Sub super admin can only delete admins from their college
    if (req.user.role === "sub_super_admin" && admin.college.toString() !== req.user.college.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete admins from your college.",
      });
    }

    await Admin.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getAllAdmins,
  getAllSubSuperAdmins,
  getCollegeAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
