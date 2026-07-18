const mongoose = require("mongoose");

const scheduleConflictSchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true, index: true },
    examinationId: { type: mongoose.Schema.Types.ObjectId, ref: "Examination", required: true, index: true },
    scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: "ExamSchedule", index: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", index: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", index: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", index: true },
    conflictType: {
      type: String,
      enum: ["student", "back_paper", "faculty", "room", "capacity", "holiday", "gap", "rule"],
      required: true,
      index: true,
    },
    severity: { type: String, enum: ["low", "medium", "high"], default: "high" },
    message: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

scheduleConflictSchema.index({ collegeId: 1, examinationId: 1, conflictType: 1, createdAt: -1 });

module.exports = mongoose.model("ScheduleConflict", scheduleConflictSchema);
