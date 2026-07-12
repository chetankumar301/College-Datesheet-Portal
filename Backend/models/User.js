const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    enrollmentNo: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
},

branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true
},

academicSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicSession",
    required: true
},

    semester: {
      type: Number,
      default: 1,
    },

    year: {
      type: Number,
      default: 1,
    },

    phone: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);