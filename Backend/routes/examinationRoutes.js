const express = require("express");
const router = express.Router();

const {
  createExamination,
  getExaminations,
  getAcademicScope,
  getEligibleSubjects,
  getApprovalHistory,
  updateExamination,
  calculateDifficulty,
  generateExaminationSchedule,
  compareScheduleOptions,
  validateGeneratedSchedule,
  getScheduleSlots,
  moveScheduleSlot,
  getScheduleVersions,
  getPublishedExaminations,
  getStudentPublishedExaminations,
  downloadExaminationPdf,
  submitExaminationForReview,
  requestExaminationChanges,
  approveExamination,
  publishExamination,
} = require("../controllers/examinationController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { requirePlanFeature } = require("../middleware/planFeatureMiddleware");

const adminAccess = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  next();
};

router.get("/examinations", protect, adminAccess, getExaminations);
router.get("/examinations/scope", protect, adminAccess, getAcademicScope);
router.get("/examinations/eligible-subjects", protect, adminAccess, getEligibleSubjects);
router.post("/examinations", protect, adminAccess, requirePlanFeature("createDatesheet"), createExamination);
router.put("/examinations/:id", protect, adminAccess, updateExamination);
router.post("/examinations/difficulty", protect, adminAccess, requirePlanFeature("automaticDatesheetGenerator"), calculateDifficulty);
router.post("/examinations/:id/generate", protect, adminAccess, requirePlanFeature("automaticDatesheetGenerator"), generateExaminationSchedule);
router.get("/examinations/:id/slots", protect, adminAccess, getScheduleSlots);
router.put("/examinations/:id/slots/:slotId", protect, adminAccess, moveScheduleSlot);
router.get("/examinations/:id/compare", protect, adminAccess, requirePlanFeature("automaticDatesheetGenerator"), compareScheduleOptions);
router.get("/examinations/:id/validate", protect, adminAccess, requirePlanFeature("automaticDatesheetGenerator"), validateGeneratedSchedule);
router.get("/examinations/:id/history", protect, adminAccess, getApprovalHistory);
router.get("/examinations/:id/versions", protect, adminAccess, getScheduleVersions);
router.get("/examinations/published", protect, adminAccess, getPublishedExaminations);
router.get("/examinations/student/published", protect, authorize("student"), getStudentPublishedExaminations);
router.get("/examinations/:id/pdf", protect, adminAccess, downloadExaminationPdf);
router.post("/examinations/:id/submit", protect, adminAccess, requirePlanFeature("createDatesheet"), submitExaminationForReview);
router.post("/examinations/:id/request-changes", protect, adminAccess, requirePlanFeature("createDatesheet"), requestExaminationChanges);
router.post("/examinations/:id/approve", protect, adminAccess, requirePlanFeature("createDatesheet"), approveExamination);
router.post("/examinations/:id/publish", protect, adminAccess, requirePlanFeature("publishDatesheet"), publishExamination);

module.exports = router;
