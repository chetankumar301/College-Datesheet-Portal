const Datesheet = require("../models/Datesheet");
const AuditLog = require("../models/AuditLog");

// Submit datesheet for approval (Admin)
const submitForApproval = async (req, res) => {
  try {
    const { id } = req.params;

    const datesheet = await Datesheet.findByIdAndUpdate(
      id,
      {
        status: "pending_approval",
        submittedForApprovalAt: new Date(),
      },
      { new: true }
    ).populate("college course branch");

    if (!datesheet) {
      return res.status(404).json({
        success: false,
        message: "Datesheet not found",
      });
    }

    // Log the action
    await AuditLog.create({
      user: req.user.id,
      admin: req.user.id,
      college: datesheet.college,
      action: "submit_approval",
      entityType: "datesheet",
      entityId: datesheet._id,
      description: `Submitted datesheet "${datesheet.title}" for approval`,
      metadata: {
        datesheetTitle: datesheet.title,
        course: datesheet.course?.name,
        semester: datesheet.semester,
      },
    });

    res.status(200).json({
      success: true,
      message: "Datesheet submitted for approval",
      data: datesheet,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Approve datesheet (Sub Super Admin)
const approveDatesheet = async (req, res) => {
  try {
    const { id } = req.params;

    const datesheet = await Datesheet.findByIdAndUpdate(
      id,
      {
        status: "approved",
        approvedBy: req.user.id,
        approvedAt: new Date(),
      },
      { new: true }
    ).populate("college course branch");

    if (!datesheet) {
      return res.status(404).json({
        success: false,
        message: "Datesheet not found",
      });
    }

    // Log the action
    await AuditLog.create({
      user: req.user.id,
      admin: req.user.id,
      college: datesheet.college,
      action: "approve_datesheet",
      entityType: "datesheet",
      entityId: datesheet._id,
      description: `Approved datesheet "${datesheet.title}"`,
      metadata: {
        datesheetTitle: datesheet.title,
        course: datesheet.course?.name,
        semester: datesheet.semester,
      },
    });

    res.status(200).json({
      success: true,
      message: "Datesheet approved",
      data: datesheet,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Reject datesheet (Sub Super Admin)
const rejectDatesheet = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const datesheet = await Datesheet.findByIdAndUpdate(
      id,
      {
        status: "rejected",
        rejectedBy: req.user.id,
        rejectedAt: new Date(),
        rejectionReason: reason || "Rejected by admin",
      },
      { new: true }
    ).populate("college course branch");

    if (!datesheet) {
      return res.status(404).json({
        success: false,
        message: "Datesheet not found",
      });
    }

    // Log the action
    await AuditLog.create({
      user: req.user.id,
      admin: req.user.id,
      college: datesheet.college,
      action: "reject_datesheet",
      entityType: "datesheet",
      entityId: datesheet._id,
      description: `Rejected datesheet "${datesheet.title}"`,
      metadata: {
        datesheetTitle: datesheet.title,
        course: datesheet.course?.name,
        semester: datesheet.semester,
        rejectionReason: reason,
      },
    });

    res.status(200).json({
      success: true,
      message: "Datesheet rejected",
      data: datesheet,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Publish datesheet (Sub Super Admin)
const publishDatesheet = async (req, res) => {
  try {
    const { id } = req.params;

    const datesheet = await Datesheet.findByIdAndUpdate(
      id,
      {
        status: "published",
        published: true,
        publishedBy: req.user.id,
        publishedAt: new Date(),
      },
      { new: true }
    ).populate("college course branch");

    if (!datesheet) {
      return res.status(404).json({
        success: false,
        message: "Datesheet not found",
      });
    }

    // Log the action
    await AuditLog.create({
      user: req.user.id,
      admin: req.user.id,
      college: datesheet.college,
      action: "publish_datesheet",
      entityType: "datesheet",
      entityId: datesheet._id,
      description: `Published datesheet "${datesheet.title}"`,
      metadata: {
        datesheetTitle: datesheet.title,
        course: datesheet.course?.name,
        semester: datesheet.semester,
      },
    });

    res.status(200).json({
      success: true,
      message: "Datesheet published",
      data: datesheet,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get pending approval datesheets (Sub Super Admin)
const getPendingDatesheets = async (req, res) => {
  try {
    const { collegeId } = req.params;

    const datesheets = await Datesheet.find({
      college: collegeId,
      status: "pending_approval",
    })
      .populate("course branch uploadedBy")
      .sort({ submittedForApprovalAt: -1 });

    res.status(200).json({
      success: true,
      data: datesheets,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get approved datesheets (Sub Super Admin)
const getApprovedDatesheets = async (req, res) => {
  try {
    const { collegeId } = req.params;

    const datesheets = await Datesheet.find({
      college: collegeId,
      status: "approved",
      published: false,
    })
      .populate("course branch uploadedBy approvedBy")
      .sort({ approvedAt: -1 });

    res.status(200).json({
      success: true,
      data: datesheets,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get rejected datesheets (Sub Super Admin)
const getRejectedDatesheets = async (req, res) => {
  try {
    const { collegeId } = req.params;

    const datesheets = await Datesheet.find({
      college: collegeId,
      status: "rejected",
    })
      .populate("course branch uploadedBy rejectedBy")
      .sort({ rejectedAt: -1 });

    res.status(200).json({
      success: true,
      data: datesheets,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get published datesheets (Public/Student)
const getPublishedDatesheets = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const { examType, semester, course } = req.query;

    const query = {
      college: collegeId,
      status: "published",
      published: true,
    };

    if (examType) query.examType = examType;
    if (semester) query.semester = parseInt(semester);
    if (course) query.course = course;

    const datesheets = await Datesheet.find(query)
      .populate("course branch academicSession")
      .sort({ publishedAt: -1 });

    res.status(200).json({
      success: true,
      data: datesheets,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  submitForApproval,
  approveDatesheet,
  rejectDatesheet,
  publishDatesheet,
  getPendingDatesheets,
  getApprovedDatesheets,
  getRejectedDatesheets,
  getPublishedDatesheets,
};
