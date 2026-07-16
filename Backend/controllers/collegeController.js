const College = require("../models/College");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Subscription = require("../models/Subscription");

// Get all colleges (Super Admin only)
const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find().sort({ createdAt: -1 });
    
    // Get student count for each college
    const collegesWithStats = await Promise.all(
      colleges.map(async (college) => {
        const studentCount = await User.countDocuments({ college: college._id, role: "student" });
        const adminCount = await Admin.countDocuments({ college: college._id, role: "admin" });
        const subSuperAdminCount = await Admin.countDocuments({ college: college._id, role: "sub_super_admin" });
        
        return {
          ...college.toObject(),
          studentCount,
          adminCount,
          subSuperAdminCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: collegesWithStats,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get single college
const getCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    
    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    const studentCount = await User.countDocuments({ college: college._id, role: "student" });
    const adminCount = await Admin.countDocuments({ college: college._id, role: "admin" });
    const subSuperAdminCount = await Admin.countDocuments({ college: college._id, role: "sub_super_admin" });

    res.status(200).json({
      success: true,
      data: {
        ...college.toObject(),
        studentCount,
        adminCount,
        subSuperAdminCount,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Create new college (Super Admin only)
const createCollege = async (req, res) => {
  try {
    const {
      name,
      code,
      email,
      phone,
      address,
      city,
      state,
      country,
      pricingPlan,
      maxStudents,
      annualFee,
      perStudentFee,
    } = req.body;

    // Check if college already exists
    const existingCollege = await College.findOne({ $or: [{ email }, { code }] });
    if (existingCollege) {
      return res.status(400).json({
        success: false,
        message: "College with this email or code already exists",
      });
    }

    // Calculate subscription end date (1 year from now)
    const subscriptionEnd = new Date();
    subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);

    const college = await College.create({
      name,
      code: code.toUpperCase(),
      email,
      phone,
      address,
      city,
      state,
      country: country || "India",
      pricingPlan,
      maxStudents,
      annualFee,
      perStudentFee,
      subscriptionEnd,
      subscriptionStatus: "trial",
    });

    res.status(201).json({
      success: true,
      message: "College created successfully",
      data: college,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update college (Super Admin only)
const updateCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }

    const college = await College.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "College updated successfully",
      data: college,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Suspend college (Super Admin only)
const suspendCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const college = await College.findByIdAndUpdate(
      id,
      {
        isSuspended: true,
        subscriptionStatus: "suspended",
        suspensionReason: reason || "Suspended by super admin",
      },
      { new: true }
    );

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "College suspended successfully",
      data: college,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Activate college (Super Admin only)
const activateCollege = async (req, res) => {
  try {
    const { id } = req.params;

    const college = await College.findByIdAndUpdate(
      id,
      {
        isSuspended: false,
        subscriptionStatus: "active",
        suspensionReason: "",
      },
      { new: true }
    );

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "College activated successfully",
      data: college,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete college (Super Admin only)
const deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;

    const college = await College.findByIdAndDelete(id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    // Delete all associated data
    await User.deleteMany({ college: id });
    await Admin.deleteMany({ college: id });
    await Subscription.deleteMany({ college: id });

    res.status(200).json({
      success: true,
      message: "College and all associated data deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get college statistics (Super Admin only)
const getCollegeStats = async (req, res) => {
  try {
    const totalColleges = await College.countDocuments();
    const activeColleges = await College.countDocuments({ subscriptionStatus: "active" });
    const suspendedColleges = await College.countDocuments({ isSuspended: true });
    const expiredColleges = await College.countDocuments({ subscriptionStatus: "expired" });

    const totalStudents = await User.countDocuments({ role: "student" });
    const totalAdmins = await Admin.countDocuments({ role: "admin" });
    const totalSubSuperAdmins = await Admin.countDocuments({ role: "sub_super_admin" });

    // Revenue calculation
    const colleges = await College.find();
    const totalRevenue = colleges.reduce((sum, college) => {
      return sum + (college.annualFee || 0) + (college.currentStudents * college.perStudentFee || 0);
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        totalColleges,
        activeColleges,
        suspendedColleges,
        expiredColleges,
        totalStudents,
        totalAdmins,
        totalSubSuperAdmins,
        totalRevenue,
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
  getAllColleges,
  getCollege,
  createCollege,
  updateCollege,
  suspendCollege,
  activateCollege,
  deleteCollege,
  getCollegeStats,
};
