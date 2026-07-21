const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["admin", "super_admin", "sub_super_admin"],
      default: "admin",
    },

    // College reference for sub_super_admin and regular admins
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
    },

    // For sub_super_admin - can manage admins within their college
    permissions: {
      canCreateAdmins: {
        type: Boolean,
        default: false,
      },
      canRemoveAdmins: {
        type: Boolean,
        default: false,
      },
      canAssignRoles: {
        type: Boolean,
        default: false,
      },
      canApproveDatesheet: {
        type: Boolean,
        default: false,
      },
      canRejectDatesheet: {
        type: Boolean,
        default: false,
      },
      canPublishDatesheet: {
        type: Boolean,
        default: false,
      },
      canManageNotifications: {
        type: Boolean,
        default: false,
      },
      canViewReports: {
        type: Boolean,
        default: false,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    profileImagePublicId: {
      type: String,
      default: "",
    },

    mustChangePassword: {
      type: Boolean,
      default: false,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },

    temporaryPasswordCreatedAt: {
      type: Date,
      default: null,
    },

    temporaryPasswordExpiresAt: {
      type: Date,
      default: null,
    },

    accountStatus: {
      type: String,
      enum: ["active", "inactive", "pending_password_change"],
      default: "active",
    },

    isFirstLogin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", adminSchema);
