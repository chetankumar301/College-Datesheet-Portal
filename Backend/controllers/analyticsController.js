const College = require("../models/College");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Subscription = require("../models/Subscription");
const Datesheet = require("../models/Datesheet");
const mongoose = require("mongoose");

// Get platform analytics (Super Admin only)
const getPlatformAnalytics = async (req, res) => {
  try {
    const totalColleges = await College.countDocuments();
    const activeColleges = await College.countDocuments({ subscriptionStatus: "active" });
    const suspendedColleges = await College.countDocuments({ isSuspended: true });
    const trialColleges = await College.countDocuments({ subscriptionStatus: "trial" });

    const totalStudents = await User.countDocuments({ role: "student" });
    const totalAdmins = await Admin.countDocuments({ role: "admin" });
    const totalSubSuperAdmins = await Admin.countDocuments({ role: "sub_super_admin" });

    // Revenue
    const colleges = await College.find();
    const totalRevenue = colleges.reduce((sum, college) => {
      return sum + (college.annualFee || 0) + (college.currentStudents * college.perStudentFee || 0);
    }, 0);

    // Monthly revenue (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlyRevenue = await Subscription.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Student distribution by college
    const studentDistribution = await User.aggregate([
      { $match: { role: "student" } },
      {
        $group: {
          _id: "$college",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "colleges",
          localField: "_id",
          foreignField: "_id",
          as: "college",
        },
      },
      {
        $unwind: "$college",
      },
      {
        $project: {
          collegeName: "$college.name",
          collegeCode: "$college.code",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Growth metrics (new colleges in last 30 days)
    const newColleges = await College.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Growth metrics (new students in last 30 days)
    const newStudents = await User.countDocuments({
      role: "student",
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.status(200).json({
      success: true,
      data: {
        totalColleges,
        activeColleges,
        suspendedColleges,
        trialColleges,
        totalStudents,
        totalAdmins,
        totalSubSuperAdmins,
        totalRevenue,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        studentDistribution,
        newColleges,
        newStudents,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get college-specific analytics (Sub Super Admin)
const getCollegeAnalytics = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const collegeObjectId = new mongoose.Types.ObjectId(collegeId);

    const totalStudents = await User.countDocuments({ college: collegeId, role: "student" });
    const totalAdmins = await Admin.countDocuments({ college: collegeId, role: "admin" });

    // Students by course
    const studentsByCourse = await User.aggregate([
      { $match: { college: collegeObjectId, role: "student" } },
      {
        $group: {
          _id: "$course",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $project: {
          courseName: "$course.name",
          courseCode: "$course.code",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Students by semester
    const studentsBySemester = await User.aggregate([
      { $match: { college: collegeObjectId, role: "student" } },
      {
        $group: {
          _id: "$semester",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Datesheet statistics
    const totalDatesheets = await Datesheet.countDocuments({ college: collegeId });
    const publishedDatesheets = await Datesheet.countDocuments({ 
      college: collegeId, 
      status: "published" 
    });
    const pendingDatesheets = await Datesheet.countDocuments({ 
      college: collegeId, 
      status: "pending_approval" 
    });

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalAdmins,
        studentsByCourse,
        studentsBySemester,
        totalDatesheets,
        publishedDatesheets,
        pendingDatesheets,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get admin activity (Sub Super Admin)
const getAdminActivity = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const AuditLog = require("../models/AuditLog");
    const collegeObjectId = new mongoose.Types.ObjectId(collegeId);

    const activities = await AuditLog.find({
      college: collegeId,
      timestamp: { $gte: startDate },
    })
      .populate("admin", "name email")
      .sort({ timestamp: -1 })
      .limit(100);

    // Activity by admin
    const activityByAdmin = await AuditLog.aggregate([
      {
        $match: {
          college: collegeObjectId,
          timestamp: { $gte: startDate },
          admin: { $exists: true },
        },
      },
      {
        $group: {
          _id: "$admin",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "admins",
          localField: "_id",
          foreignField: "_id",
          as: "admin",
        },
      },
      {
        $unwind: "$admin",
      },
      {
        $project: {
          adminName: "$admin.name",
          adminEmail: "$admin.email",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        activities,
        activityByAdmin,
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
  getPlatformAnalytics,
  getCollegeAnalytics,
  getAdminActivity,
};
