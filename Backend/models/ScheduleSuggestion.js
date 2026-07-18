const mongoose = require("mongoose");

const scheduleSuggestionSchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true, index: true },
    examinationId: { type: mongoose.Schema.Types.ObjectId, ref: "Examination", required: true, index: true },
    scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: "ExamSchedule", index: true },
    title: { type: String, required: true },
    currentValue: { type: String, default: "" },
    recommendedValue: { type: String, default: "" },
    reason: { type: String, required: true },
    expectedQualityScoreImprovement: { type: Number, default: 0 },
    status: { type: String, enum: ["open", "applied", "dismissed"], default: "open", index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

scheduleSuggestionSchema.index({ collegeId: 1, examinationId: 1, status: 1 });

module.exports = mongoose.model("ScheduleSuggestion", scheduleSuggestionSchema);
