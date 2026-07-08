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

const app = express();

// ==============================
// Middlewares
// ==============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/course", courseRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/subject", subjectRoutes);
app.use("/api/datesheet", datesheetRoutes);
app.use("/api/session",academicSessionRoutes);
app.use("/api/pdf",pdfRoutes);

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

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ==============================
// Export App
// ==============================

module.exports = app;