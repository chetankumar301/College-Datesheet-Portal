const mongoose = require("mongoose");

const approvalHistorySchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true, index: true },
    examinationId: { type: mongoose.Schema.Types.ObjectId, ref: "Examination", required: true, index: true },
    action: {
      type: String,
      enum: [
        "created",
        "generated",
        "submitted",
        "changes_requested",
        "approved",
        "published",
        "archived",
      ],
      required: true,
      index: true,
    },
    fromStatus: { type: String, default: "" },
    toStatus: { type: String, default: "" },
    comment: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

approvalHistorySchema.index({ collegeId: 1, examinationId: 1, createdAt: -1 });

module.exports = mongoose.model("ApprovalHistory", approvalHistorySchema);
