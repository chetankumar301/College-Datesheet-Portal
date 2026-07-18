const Subscription = require("../models/Subscription");
const College = require("../models/College");
const AuditLog = require("../models/AuditLog");
const { normalizePlan, getPlanConfig, calculatePlanAmount } = require("../services/planPricingService");

// Get all subscriptions (Super Admin only)
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate("college", "name code email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get subscription by college
const getSubscriptionByCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const subscription = await Subscription.findOne({ college: collegeId })
      .populate("college");

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Create subscription (Super Admin only)
const createSubscription = async (req, res) => {
  try {
    const {
      college,
      plan,
      startDate,
      endDate,
      studentCount,
      paymentMethod,
      billingName,
      billingEmail,
      billingAddress,
    } = req.body;

    // Check if college exists
    const collegeExists = await College.findById(college);
    if (!collegeExists) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    const normalizedPlan = normalizePlan(plan);
    const planConfig = getPlanConfig(normalizedPlan);
    const resolvedStudentCount = Number(studentCount) || Number(collegeExists.currentStudents) || 0;
    const pricing = calculatePlanAmount(normalizedPlan, resolvedStudentCount);
    const subscription = await Subscription.create({
      name: planConfig.name,
      code: planConfig.code,
      description: planConfig.description,
      billingCycle: planConfig.billingCycle,
      pricePerStudent: planConfig.pricePerStudent,
      calculatedAmount: pricing.calculatedAmount,
      studentCount: pricing.studentCount,
      features: planConfig.features,
      isActive: true,
      college,
      plan: normalizedPlan,
      startDate,
      endDate,
      amount: pricing.calculatedAmount,
      currency: planConfig.currency,
      paymentMethod,
      billingName,
      billingEmail,
      billingAddress,
      status: "active",
      paymentStatus: "paid",
    });

    // Update college subscription status
    await College.findByIdAndUpdate(college, {
      subscriptionStatus: "active",
      subscriptionStart: startDate,
      subscriptionEnd: endDate,
    });

    // Log the action
    await AuditLog.create({
      user: req.user.id,
      action: "other",
      entityType: "subscription",
      entityId: subscription._id,
      description: `Created subscription for college ${collegeExists.name}`,
      college,
    });

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: {
        subscription,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Renew subscription (Super Admin only)
const renewSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { endDate, studentCount } = req.body;

    const existing = await Subscription.findById(id).populate("college");
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    const planConfig = getPlanConfig(existing.plan);
    const pricing = calculatePlanAmount(existing.plan, Number(studentCount) || existing.studentCount || existing.college?.currentStudents || 0);
    const subscription = await Subscription.findByIdAndUpdate(
      id,
      {
        endDate,
        studentCount: pricing.studentCount,
        calculatedAmount: pricing.calculatedAmount,
        amount: pricing.calculatedAmount,
        pricePerStudent: planConfig.pricePerStudent,
        status: "active",
        paymentStatus: "paid",
        renewalReminderSent: false,
      },
      { new: true }
    );

    // Update college subscription end date
    await College.findByIdAndUpdate(subscription.college, {
      subscriptionEnd: endDate,
      subscriptionStatus: "active",
    });

    // Log the action
    await AuditLog.create({
      user: req.user.id,
      action: "other",
      entityType: "subscription",
      entityId: subscription._id,
      description: `Renewed subscription for college ${subscription.college}`,
      college: subscription.college,
    });

    res.status(200).json({
      success: true,
      message: "Subscription renewed successfully",
      data: {
        subscription,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Cancel subscription (Super Admin only)
const cancelSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findByIdAndUpdate(
      id,
      {
        status: "cancelled",
        autoRenew: false,
      },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    // Log the action
    await AuditLog.create({
      user: req.user.id,
      action: "other",
      entityType: "subscription",
      entityId: subscription._id,
      description: `Cancelled subscription for college ${subscription.college}`,
      college: subscription.college,
    });

    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
      data: subscription,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get revenue analytics (Super Admin only)
const getRevenueAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchQuery = { paymentStatus: "paid" };
    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const subscriptions = await Subscription.find(matchQuery)
      .populate("college", "name code");

    const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

    // Revenue by plan
    const revenueByPlan = subscriptions.reduce((acc, sub) => {
      acc[sub.plan] = (acc[sub.plan] || 0) + sub.amount;
      return acc;
    }, {});

    // Revenue by college
    const revenueByCollege = subscriptions.reduce((acc, sub) => {
      if (sub.college) {
        acc[sub.college.name] = (acc[sub.college.name] || 0) + sub.amount;
      }
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalSubscriptions: subscriptions.length,
        revenueByPlan,
        revenueByCollege,
        subscriptions,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getAllSubscriptions,
  getSubscriptionByCollege,
  createSubscription,
  renewSubscription,
  cancelSubscription,
  getRevenueAnalytics,
};
