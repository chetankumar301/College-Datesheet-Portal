const mongoose = require("mongoose");
const Admin = require("../../models/Admin");
const User = require("../../models/User");
const Exam = require("../../models/Exam");
const UploadedPDF = require("../../models/UploadedPdf");
const Datesheet = require("../../models/Datesheet");
const Subject = require("../../models/subject");
const Notification = require("../../models/Notification");
const Complaint = require("../../models/Complaint");
const { getDaysLeft } = require("../../utils/countdown");

const toObjectId = (value) => {
  const id = value?._id || value;
  return mongoose.Types.ObjectId.isValid(id) ? id : null;
};

const getStudentDashboard = async (user) => {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const exams = await Exam.find({
    semester: user.semester,
    course: user.course,
    branch: user.branch,
    academicSession: user.academicSession,
    examDate: { $gte: todayString },
  })
    .populate("subject")
    .populate("course")
    .populate("branch")
    .populate("academicSession")
    .sort({ examDate: 1 });

  const nextExam = exams.length > 0 ? exams[0] : null;
  if (nextExam) {
    nextExam._doc.daysLeft = getDaysLeft(nextExam.examDate);
  }

  const notifications = await Notification.find({
    receiver: user._id,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(5);

  const complaints = await Complaint.find({
    student: user._id,
    status: { $ne: "RESOLVED" },
  });

  return {
    student: {
      id: user._id,
      name: user.name,
      course: user.course,
      branch: user.branch,
      semester: user.semester,
    },
    nextExam,
    upcomingExams: exams,
    notifications,
    pendingComplaints: complaints.length,
  };
};

const getAdminDashboard = async (user) => {
  const userCollege = toObjectId(user.college);
  const collegeFilter = user.role === "super_admin" || !userCollege ? {} : { college: userCollege };

  const scopedAdmins = await Admin.find(collegeFilter).select("_id");
  const scopedAdminIds = scopedAdmins.map((admin) => admin._id);
  const uploadedPdfFilter = scopedAdminIds.length ? { uploadedBy: { $in: scopedAdminIds } } : {};

  const [
    students,
    admins,
    uploadedPDFs,
    schedules,
    complaints,
    notifications,
    subjects,
    recentPDFs,
    recentComplaints,
    recentSchedules,
  ] = await Promise.all([
    User.countDocuments(collegeFilter),
    Admin.countDocuments({ ...collegeFilter, role: "admin" }),
    UploadedPDF.countDocuments(uploadedPdfFilter),
    Datesheet.countDocuments(collegeFilter),
    Complaint.countDocuments(),
    Notification.countDocuments(),
    Subject.countDocuments(),
    UploadedPDF.find(uploadedPdfFilter).sort({ createdAt: -1 }).limit(5),
    Complaint.find().populate("student", "name enrollmentNo").sort({ createdAt: -1 }).limit(5),
    Datesheet.find(collegeFilter).sort({ createdAt: -1 }).limit(5),
  ]);

  return {
    users: {
      students,
      admins,
    },
    uploadedPDFs,
    schedules,
    complaints,
    notifications,
    subjects,
    recentPDFs,
    recentComplaints,
    recentSchedules,
  };
};

exports.getDashboard = async (user) => {
  if (user.role === "student") {
    return getStudentDashboard(user);
  }

  return getAdminDashboard(user);
};
