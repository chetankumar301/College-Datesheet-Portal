const mongoose = require("mongoose");

const backPaperEnrollmentSchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true, index: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true, index: true },
    academicSession: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicSession", required: true, index: true },
    status: { type: String, enum: ["active", "completed", "cancelled"], default: "active", index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

backPaperEnrollmentSchema.index({ collegeId: 1, studentId: 1, subjectId: 1, academicSession: 1 });

module.exports = mongoose.model("BackPaperEnrollment", backPaperEnrollmentSchema);
