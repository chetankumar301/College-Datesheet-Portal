const mongoose = require("mongoose");

const scheduleSlotSchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true, index: true },
    examinationId: { type: mongoose.Schema.Types.ObjectId, ref: "Examination", required: true, index: true },
    scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: "ExamSchedule", index: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true, index: true },
    date: { type: Date, required: true, index: true },
    shift: { type: String, required: true, index: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    capacity: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["valid", "warning", "conflict", "recommendation"],
      default: "valid",
      index: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

scheduleSlotSchema.index({ collegeId: 1, examinationId: 1, date: 1, shift: 1 });

module.exports = mongoose.model("ScheduleSlot", scheduleSlotSchema);
