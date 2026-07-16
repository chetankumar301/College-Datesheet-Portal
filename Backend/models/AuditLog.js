const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
  },
  action: {
    type: String,
    required: true,
    enum: [
      "login",
      "logout",
      "create_admin",
      "update_admin",
      "delete_admin",
      "create_student",
      "update_student",
      "delete_student",
      "upload_pdf",
      "parse_pdf",
      "edit_parsed_data",
      "submit_approval",
      "approve_datesheet",
      "reject_datesheet",
      "publish_datesheet",
      "create_course",
      "update_course",
      "delete_course",
      "create_notification",
      "update_notification",
      "delete_notification",
      "resolve_complaint",
      "view_report",
      "other",
    ],
  },
  entityType: {
    type: String,
    enum: ["admin", "student", "course", "datesheet", "notification", "complaint", "college", "subscription"],
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  description: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ college: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
