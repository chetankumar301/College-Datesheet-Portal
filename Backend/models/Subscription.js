const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  plan: {
    type: String,
    enum: ["basic", "standard", "premium", "enterprise"],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "expired", "cancelled", "suspended"],
    default: "active",
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "INR",
  },
  paymentMethod: {
    type: String,
    enum: ["card", "bank_transfer", "upi", "cheque"],
    default: "bank_transfer",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  transactionId: {
    type: String,
    default: "",
  },
  invoiceUrl: {
    type: String,
    default: "",
  },
  // Billing details
  billingName: {
    type: String,
    required: true,
  },
  billingEmail: {
    type: String,
    required: true,
  },
  billingAddress: {
    type: String,
    required: true,
  },
  // Auto-renewal
  autoRenew: {
    type: Boolean,
    default: true,
  },
  renewalReminderSent: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

subscriptionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
