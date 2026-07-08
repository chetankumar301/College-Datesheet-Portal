const mongoose = require("mongoose");

const datesheetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    examType: {
      type: String,
      enum: ["MAIN", "BACK", "PRACTICAL"],
      required: true,
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

    semester: {
      type: Number,
      required: true,
    },

    pdfFile: {
      type: String,
      required: true,
    },

    published: {
      type: Boolean,
      default: false,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Datesheet", datesheetSchema);