const Admin = require("../models/Admin");
const College = require("../models/College");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { revokeUserRefreshTokens } = require("../services/tokenService");
const { sendCredentialEmail } = require("../services/emailService");

const normalizeUsername = (value = "") => String(value).trim().toLowerCase();

const generateTemporaryPassword = () => {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "-_@.";
  const pool = `${upper}${lower}${numbers}${symbols}`;
  const required = [
    upper[crypto.randomInt(0, upper.length)],
    lower[crypto.randomInt(0, lower.length)],
    numbers[crypto.randomInt(0, numbers.length)],
    symbols[crypto.randomInt(0, symbols.length)],
  ];
  const rest = Array.from({ length: 10 }, () => {
    return pool[crypto.randomInt(0, pool.length)];
  });

  const chars = [...required, ...rest];
  for (let index = chars.length - 1; index > 0; index -= 1) {
    const swapIndex = crypto.randomInt(index + 1);
    [chars[index], chars[swapIndex]] = [chars[swapIndex], chars[index]];
  }

  return chars.join("");
};

const getRoleLabel = (role) => role === "sub_super_admin" ? "College Sub Super Admin" : "Admin";

const getSmtpPrefixForCreator = (creatorRole) => (
  creatorRole === "sub_super_admin" ? "COLLEGE_SMTP" : "SMTP"
);

const toIdString = (value) => {
  if (!value) return "";
  return String(value._id || value);
};

const assertCanManageTarget = (requestUser, targetAdmin) => {
  if (requestUser.role === "super_admin") return true;
  return (
    requestUser.role === "sub_super_admin" &&
    targetAdmin.role === "admin" &&
    toIdString(targetAdmin.college) === toIdString(requestUser.college)
  );
};

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
      const { name, email, username, college, collegeId, permissions } = req.body;
      const targetCollege = collegeId || college;
      const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!["super_admin", "sub_super_admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin account creation is restricted.",
      });
    }

    let role = "admin";
    let adminCollege = targetCollege;

    if (req.user.role === "super_admin") {
      role = req.body.role || "admin";
    } else if (req.user.role === "sub_super_admin") {
      role = "admin";
      adminCollege = req.user.college;
    }

    const isSubSuperAdmin = role === "sub_super_admin";
    const normalizedUsername = normalizeUsername(username);

    if (!name || !normalizedEmail || !normalizedUsername) {
      return res.status(400).json({
        success: false,
        message: "Full name, username, and email are required",
      });
    }

    if (isSubSuperAdmin && !adminCollege) {
      return res.status(400).json({
        success: false,
        message: "Assigned college is required for college sub super admins",
      });
    }

    const collegeRecord = adminCollege
      ? await College.findById(adminCollege).select("name code")
      : null;

    if (isSubSuperAdmin && !collegeRecord) {
      return res.status(404).json({
        success: false,
        message: "Assigned college not found",
      });
    }

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

    const temporaryPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Create admin
    const admin = await Admin.create({
      name,
      email: normalizedEmail,
      username: normalizedUsername,
      password: hashedPassword,
      role,
      college: adminCollege,
      permissions: permissions || {},
      mustChangePassword: true,
      passwordChangedAt: null,
      temporaryPasswordCreatedAt: new Date(),
      temporaryPasswordExpiresAt: null,
      accountStatus: "pending_password_change",
      isFirstLogin: true,
    });

    try {
      await sendCredentialEmail({
        to: normalizedEmail,
        name,
        collegeName: collegeRecord?.name || "College",
        username: normalizedUsername,
        temporaryPassword,
        roleLabel: getRoleLabel(role),
        smtpPrefix: getSmtpPrefixForCreator(req.user.role),
        replyTo: req.user.email,
      });
    } catch (emailErr) {
      await Admin.findByIdAndDelete(admin._id);
      return res.status(502).json({
        success: false,
        message: `${getRoleLabel(role)} was not created because the credentials email could not be sent`,
      });
    }

    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.status(201).json({
      success: true,
      message: role === "sub_super_admin"
          ? "College Sub Super Admin created successfully and credentials email sent"
          : "Admin created successfully and credentials email sent",
      data: {
        user: adminResponse,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const resendAdminCredentials = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id).populate("college", "name code");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (!assertCanManageTarget(req.user, admin)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You cannot resend credentials for this account.",
      });
    }

    const previousState = {
      password: admin.password,
      mustChangePassword: admin.mustChangePassword,
      accountStatus: admin.accountStatus,
      isFirstLogin: admin.isFirstLogin,
      temporaryPasswordCreatedAt: admin.temporaryPasswordCreatedAt,
      temporaryPasswordExpiresAt: admin.temporaryPasswordExpiresAt,
      passwordChangedAt: admin.passwordChangedAt,
    };

    const temporaryPassword = generateTemporaryPassword();

    admin.password = await bcrypt.hash(temporaryPassword, 10);
    admin.mustChangePassword = true;
    admin.accountStatus = "pending_password_change";
    admin.isFirstLogin = true;
    admin.temporaryPasswordCreatedAt = new Date();
    admin.temporaryPasswordExpiresAt = null;
    admin.passwordChangedAt = null;
    await admin.save();
    await revokeUserRefreshTokens(admin._id);

    try {
      await sendCredentialEmail({
        to: admin.email,
        name: admin.name,
        collegeName: admin.college?.name || "College",
        username: admin.username,
        temporaryPassword,
        roleLabel: getRoleLabel(admin.role),
        smtpPrefix: getSmtpPrefixForCreator(req.user.role),
        replyTo: req.user.email,
      });
    } catch (emailErr) {
      Object.assign(admin, previousState);
      await admin.save();
      return res.status(502).json({
        success: false,
        message: "Credentials were not resent because the email could not be delivered",
      });
    }

    res.status(200).json({
      success: true,
      message: "Credentials email sent successfully",
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
    const { name, email, username, password, permissions, isActive, collegeId, college } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = String(email).trim().toLowerCase();
    if (username !== undefined) updateData.username = normalizeUsername(username);
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
      updateData.mustChangePassword = false;
      updateData.accountStatus = "active";
      updateData.isFirstLogin = false;
      updateData.temporaryPasswordCreatedAt = null;
      updateData.temporaryPasswordExpiresAt = null;
      updateData.passwordChangedAt = new Date();
      await revokeUserRefreshTokens(id);
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

    if (req.user.role === "sub_super_admin") {
      const targetAdmin = await Admin.findById(id).select("college role");

      if (!targetAdmin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      if (targetAdmin.role !== "admin" || toIdString(targetAdmin.college) !== toIdString(req.user.college)) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only update admins from your college.",
        });
      }

      delete updateData.college;
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
    if (
      req.user.role === "sub_super_admin" &&
      (admin.role !== "admin" || toIdString(admin.college) !== toIdString(req.user.college))
    ) {
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
  resendAdminCredentials,
  updateAdmin,
  deleteAdmin,
};
