const mongoose = require("mongoose");

const facultyAvailabilitySchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true, index: true },
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true, index: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", index: true },
    dayOfWeek: { type: Number, min: 0, max: 6, required: true, index: true },
    shift: { type: String, required: true, index: true },
    isAvailable: { type: Boolean, default: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

facultyAvailabilitySchema.index({ collegeId: 1, facultyId: 1, dayOfWeek: 1, shift: 1 });

module.exports = mongoose.model("FacultyAvailability", facultyAvailabilitySchema);
