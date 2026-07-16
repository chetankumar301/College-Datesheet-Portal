const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: "India",
  },
  logo: {
    type: String,
    default: "",
  },
  // Subscription details
  subscriptionStatus: {
    type: String,
    enum: ["active", "suspended", "expired", "trial"],
    default: "trial",
  },
  subscriptionStart: {
    type: Date,
    default: Date.now,
  },
  subscriptionEnd: {
    type: Date,
  },
  maxStudents: {
    type: Number,
    default: 1000,
  },
  currentStudents: {
    type: Number,
    default: 0,
  },
  pricingPlan: {
    type: String,
    enum: ["basic", "standard", "premium", "enterprise"],
    default: "basic",
  },
  annualFee: {
    type: Number,
    default: 0,
  },
  perStudentFee: {
    type: Number,
    default: 0,
  },
  // Status
  isActive: {
    type: Boolean,
    default: true,
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
  suspensionReason: {
    type: String,
    default: "",
  },
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
collegeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("College", collegeSchema);
