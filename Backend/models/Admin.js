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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", adminSchema);