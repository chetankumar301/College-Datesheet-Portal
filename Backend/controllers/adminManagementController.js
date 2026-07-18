const Admin = require("../models/Admin");
const College = require("../models/College");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const TEMP_PASSWORD_TTL_HOURS = Number(process.env.TEMP_PASSWORD_TTL_HOURS || 48);

const generateTemporaryPassword = () => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*_-+?";
  const all = upper + lower + numbers + special;
  const pick = (chars) => chars[Math.floor(Math.random() * chars.length)];
  const chars = [
    pick(upper),
    pick(lower),
    pick(numbers),
    pick(special),
    ...crypto.randomBytes(8).toString("base64").replace(/[^A-Za-z0-9]/g, "").slice(0, 8).split(""),
  ];
  while (chars.length < 12) {
    chars.push(pick(all));
  }
  return chars.sort(() => 0.5 - Math.random()).join("");
};

const normalizeUsername = (value = "") => String(value).trim().toLowerCase();

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

// Get college owners for a specific college
const getCollegeOwners = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const owners = await Admin.find({ college: collegeId, role: "sub_super_admin" })
      .populate("college", "name code")
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: owners,
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
      const { name, email, password, username, college, collegeId, permissions } = req.body;
      const targetCollege = collegeId || college;
      const normalizedEmail = String(email || "").trim().toLowerCase();
      const normalizedUsername = normalizeUsername(username || normalizedEmail.split("@")[0]);
      const isSubSuperAdmin = req.body.role === "sub_super_admin";

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [
        { email: normalizedEmail },
        { username: normalizedUsername },
      ],
    });
    if (existingAdmin) {
      if (existingAdmin.username === normalizedUsername) {
        return res.status(400).json({
          success: false,
          code: "USERNAME_ALREADY_EXISTS",
          message: "This username is already in use.",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    const generatedTemporaryPassword = password || generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(generatedTemporaryPassword, 10);

    // Determine role based on requester
    let role = "admin";
    let adminCollege = targetCollege;

    if (req.user.role === "super_admin") {
      // Super admin can create sub super admins or regular admins
      role = req.body.role || "admin";
    } else if (req.user.role === "sub_super_admin") {
      // Sub super admin can only create regular admins for their college
      role = "admin";
      adminCollege = req.user.college;
    }

    if (role === "sub_super_admin" && !adminCollege) {
      return res.status(400).json({
        success: false,
        message: "College is required for college sub super admins",
      });
    }

    // Create admin
    const admin = await Admin.create({
      name,
      email: normalizedEmail,
      username: normalizedUsername,
      password: hashedPassword,
      role,
      college: adminCollege,
      permissions: permissions || {},
      mustChangePassword: isSubSuperAdmin,
      passwordChangedAt: null,
      temporaryPasswordCreatedAt: isSubSuperAdmin ? new Date() : null,
      temporaryPasswordExpiresAt: isSubSuperAdmin ? new Date(Date.now() + TEMP_PASSWORD_TTL_HOURS * 60 * 60 * 1000) : null,
      accountStatus: isSubSuperAdmin ? "pending_password_change" : "active",
      isFirstLogin: isSubSuperAdmin,
    });

    res.status(201).json({
      success: true,
      message: role === "sub_super_admin"
        ? "College Sub Super Admin created successfully"
        : "Admin created successfully",
      data: {
        user: admin,
        emailSent: false,
      },
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
    const { name, email, password, permissions, isActive, collegeId, college } = req.body;

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
    if (collegeId || college) {
      updateData.college = collegeId || college;
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
  getCollegeOwners,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
