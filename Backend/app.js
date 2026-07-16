const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const courseRoutes = require("./routes/courseRoutes");
const branchRoutes = require("./routes/branchRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const datesheetRoutes = require("./routes/datesheetRoutes");
const academicSessionRoutes = require("./routes/academicSessionRoutes");
const pdfRoutes=require("./routes/pdfRoutes");
const parsingJobRoutes=require("./routes/parsingJobRoutes");
const studentExamRoutes=require("./routes/studentExamRoutes");
const notificationRoutes=require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const complaintRoutes=require("./routes/complaintRoutes");
const clashRoutes = require("./routes/clashRoutes");
const adminManagementRoutes = require("./routes/adminManagementRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const datesheetApprovalRoutes = require("./routes/datesheetApprovalRoutes");

const app = express();

// ==============================
// Middlewares
// ==============================

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/course", courseRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/subject", subjectRoutes);
app.use("/api/datesheet", datesheetRoutes);
app.use("/api/session",academicSessionRoutes);
app.use("/api/pdf",pdfRoutes);
app.use("/api/parsing-job",parsingJobRoutes);
app.use("/api/student",studentExamRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/complaints",complaintRoutes);
app.use("/api/clashes",clashRoutes);
app.use("/api/super-admin", adminManagementRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/datesheet-approval", datesheetApprovalRoutes);

// ==============================
// Home Route
// ==============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🎓 College Datesheet Portal Backend is Running Successfully 🚀",
  });
});

// ==============================
// API Routes
// ==============================

// Authentication Routes
app.use("/api/auth", authRoutes);

// Student Routes
app.use("/api/student", studentRoutes);

// Admin Routes
app.use("/api/admin", adminRoutes);

// ==============================
// 404 Route
// ==============================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// ==============================
// Export App
// ==============================

module.exports = app;