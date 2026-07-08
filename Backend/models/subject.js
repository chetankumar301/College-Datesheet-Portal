const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    subjectCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    subjectName: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    year: {
      type: Number,
      required: true,
      min: 1,
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
    },

    credits: {
      type: Number,
      default: 4,
    },

    subjectType: {
      type: String,
      enum: ["Theory", "Practical", "Project"],
      default: "Theory",
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

module.exports = mongoose.model("Subject", subjectSchema);