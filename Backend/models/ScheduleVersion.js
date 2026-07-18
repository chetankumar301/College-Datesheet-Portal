const mongoose = require("mongoose");

const scheduleVersionSchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true, index: true },
    examinationId: { type: mongoose.Schema.Types.ObjectId, ref: "Examination", required: true, index: true },
    scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: "ExamSchedule", required: true, index: true },
    versionNumber: { type: Number, required: true, min: 1 },
    snapshot: { type: mongoose.Schema.Types.Mixed, required: true },
    changeSummary: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

scheduleVersionSchema.index({ collegeId: 1, examinationId: 1, versionNumber: -1 });

module.exports = mongoose.model("ScheduleVersion", scheduleVersionSchema);
