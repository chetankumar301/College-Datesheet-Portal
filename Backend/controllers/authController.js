const User = require("../models/User");
const Admin = require("../models/Admin");
const RefreshToken = require("../models/RefreshToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  uploadBuffer,
  deleteFile,
} = require("../services/cloudinaryService");
const {
  getRefreshSecret,
  hashToken,
  signAccessToken,
  signRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  revokeRefreshToken,
  revokeUserRefreshTokens,
} = require("../services/tokenService");

// Register User
const register = async (req, res) => {
  try {
    const {
      name,
      enrollmentNo,
      email,
      password,
      role,
      course,
      branch,
      semester,
      year,
      phone,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      enrollmentNo,
      email,
      password: hashedPassword,
      role,
      course,
      branch,
      semester,
      year,
      phone,
    });

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// Login User
const login = async (req, res) => {

  try {

    const { password } = req.body;

    const identifier = String(req.body.identifier || req.body.studentId || req.body.email || "")
      .trim();
    const normalizedIdentifier = identifier.toLowerCase();

    // Admin usernames must not be shadowed by student enrollment numbers.
    let user = await Admin.findOne({
      $or: [
        { email: normalizedIdentifier },
        { username: normalizedIdentifier },
      ],
    });

    if (!user) {
      user = await User.findOne({
        $or: [
          { enrollmentNo: identifier },
          { email: normalizedIdentifier },
        ],
      });
    }

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {

      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });

    }

    const token = signAccessToken(user);
    const refreshToken = await signRefreshToken(user);
    setRefreshTokenCookie(res, refreshToken);

    const userResponse = user.toObject ? user.toObject() : user;
    delete userResponse.password;

    res.json({
      success: true,
      token,
      user: userResponse,
    });

  } catch (err) {

    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

const getProfile = async (req, res) => {

    try {

        res.status(200).json({

            success: true,

            data: req.user

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

const refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const decoded = jwt.verify(token, getRefreshSecret());
    const storedToken = await RefreshToken.findOne({
      tokenHash: hashToken(token),
      revokedAt: null,
    });

    if (!storedToken || storedToken.expiresAt <= new Date()) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        success: false,
        message: "Refresh token expired or invalid",
      });
    }

    const Model = decoded.userModel === "Admin" ? Admin : User;
    const user = await Model.findById(decoded.id).select("-password");

    if (!user) {
      await revokeRefreshToken(token);
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    await revokeRefreshToken(token);
    const accessToken = signAccessToken(user);
    const nextRefreshToken = await signRefreshToken(user);
    setRefreshTokenCookie(res, nextRefreshToken);

    res.status(200).json({
      success: true,
      token: accessToken,
      user,
    });
  } catch (err) {
    clearRefreshTokenCookie(res);
    res.status(401).json({
      success: false,
      message: "Refresh token expired or invalid",
    });
  }
};

const logout = async (req, res) => {
  try {
    await revokeRefreshToken(req.cookies?.refreshToken);
    clearRefreshTokenCookie(res);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const createNewPassword = async (req, res) => {
  try {
    const { password, newPassword, confirmPassword } = req.body;
    const nextPassword = newPassword || password;

    if (!["sub_super_admin", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Password change is only required for admin accounts",
      });
    }

    if (!nextPassword || String(nextPassword).length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    if (confirmPassword !== undefined && nextPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    const user = await Admin.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.mustChangePassword) {
      return res.status(400).json({
        success: false,
        message: "Password has already been changed",
      });
    }

    user.password = await bcrypt.hash(nextPassword, 10);
    user.mustChangePassword = false;
    user.accountStatus = "active";
    user.isFirstLogin = false;
    user.temporaryPasswordCreatedAt = null;
    user.temporaryPasswordExpiresAt = null;
    user.passwordChangedAt = new Date();
    await user.save();

    await revokeUserRefreshTokens(user._id);
    const token = signAccessToken(user);
    const refreshToken = await signRefreshToken(user);
    setRefreshTokenCookie(res, refreshToken);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Password created successfully",
      token,
      user: userResponse,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Profile image must be JPEG, PNG, or WebP",
      });
    }

    const Model = ["super_admin", "sub_super_admin"].includes(req.user.role) ? Admin : User;
    const user = await Model.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const uploadedImage = await uploadBuffer({
      buffer: req.file.buffer,
      folder: "college-erp/profile-images",
      resourceType: "image",
    });

    if (user.profileImagePublicId) {
      await deleteFile(user.profileImagePublicId, "image");
    }

    user.profileImage = uploadedImage.secure_url;
    user.profileImagePublicId = uploadedImage.public_id;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      user: userResponse,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {

    register,

    login,

    getProfile,

    refresh,

    logout
,
    uploadProfileImage,

    createNewPassword

};
