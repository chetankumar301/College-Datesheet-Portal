const mongoose = require("mongoose");

const examinationSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    examName: { type: String, required: true, trim: true },
    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicSession",
      required: true,
      index: true,
    },
    examType: {
      type: String,
      enum: ["main", "back", "improvement", "practical"],
      required: true,
      index: true,
    },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    allowedWeekDays: [{ type: Number, min: 0, max: 6 }],
    blockedDates: [{ type: Date }],
    availableShifts: [{ type: String, trim: true }],
    minimumGap: { type: Number, default: 1, min: 0 },
    maximumGap: { type: Number, default: 3, min: 0 },
    maximumExamsPerStudentPerDay: { type: Number, default: 1, min: 1 },
    maximumConsecutiveExamDays: { type: Number, default: 3, min: 1 },
    gapCalculationMode: {
      type: String,
      enum: ["ideal", "compressed", "manual"],
      default: "ideal",
    },
    allowAutomaticGapCompression: { type: Boolean, default: false },
    status: {
      type: String,
      enum: [
        "draft",
        "generated",
        "conflict_review",
        "exam_controller_review",
        "changes_requested",
        "college_owner_approval",
        "approved",
        "published",
        "archived",
      ],
      default: "draft",
      index: true,
    },
    settings: {
      weightCredits: { type: Number, default: 30 },
      weightSubjectType: { type: Number, default: 15 },
      weightSyllabusSize: { type: Number, default: 15 },
      weightComplexity: { type: Number, default: 15 },
      weightHistoricalResult: { type: Number, default: 15 },
      weightFacultyRating: { type: Number, default: 10 },
    },
    publishedAt: { type: Date },
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

examinationSchema.index({ collegeId: 1, academicSession: 1, status: 1 });

module.exports = mongoose.model("Examination", examinationSchema);
