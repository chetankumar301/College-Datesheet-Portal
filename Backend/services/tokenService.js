const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");

const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || process.env.JWT_EXPIRE || "15m";
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

const getAccessSecret = () => process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

const getUserModelName = (user) =>
  ["super_admin", "sub_super_admin", "admin"].includes(user.role) ? "Admin" : "User";

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const toMilliseconds = (value) => {
  const match = String(value).match(/^(\d+)([smhd])?$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;

  const amount = Number(match[1]);
  const unit = match[2] || "ms";
  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * multipliers[unit];
};

const signAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      userModel: getUserModelName(user),
    },
    getAccessSecret(),
    { expiresIn: ACCESS_EXPIRES_IN }
  );
};

const signRefreshToken = async (user) => {
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      userModel: getUserModelName(user),
      tokenId: crypto.randomUUID(),
    },
    getRefreshSecret(),
    { expiresIn: REFRESH_EXPIRES_IN }
  );

  await RefreshToken.create({
    user: user._id,
    userModel: getUserModelName(user),
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + toMilliseconds(REFRESH_EXPIRES_IN)),
  });

  return token;
};

const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: toMilliseconds(REFRESH_EXPIRES_IN),
  });
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
};

const revokeRefreshToken = async (token) => {
  if (!token) return;

  await RefreshToken.findOneAndUpdate(
    { tokenHash: hashToken(token), revokedAt: null },
    { revokedAt: new Date() }
  );
};

const revokeUserRefreshTokens = async (userId) => {
  await RefreshToken.updateMany(
    { user: userId, revokedAt: null },
    { revokedAt: new Date() }
  );
};

module.exports = {
  getAccessSecret,
  getRefreshSecret,
  hashToken,
  signAccessToken,
  signRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  revokeRefreshToken,
  revokeUserRefreshTokens,
};
