const College = require("../models/College");
const { normalizePlan, getPlanConfig } = require("../services/planPricingService");

const featureAliases = {
  uploadDatesheetPdf: ["uploadDatesheetPdf", "replacePdf", "publishDatesheet", "studentPortal", "downloadDatesheet", "notifications", "datesheetArchive"],
  createDatesheet: ["createDatesheet"],
  automaticDatesheetGenerator: ["automaticDatesheetGenerator", "aiScheduling", "creditBasedDifficulty", "smartGapEngine", "clashDetection", "roomAllocation", "seatingPlan", "invigilation", "multipleScheduleOptions", "scheduleQualityScore", "analytics"],
  analytics: ["analytics"],
};

const requirePlanFeature = (feature) => {
  return async (req, res, next) => {
    try {
      const collegeId = req.user?.college || req.params.collegeId || req.body.collegeId;
      if (!collegeId) {
        return res.status(400).json({ success: false, message: "College context is required" });
      }

      const college = await College.findById(collegeId);
      if (!college) {
        return res.status(404).json({ success: false, message: "College not found" });
      }

      const plan = normalizePlan(college.pricingPlan);
      const planConfig = getPlanConfig(plan);
      const allowedFeatures = new Set(planConfig.features || []);
      const featureGroup = featureAliases[feature] || [feature];
      const canAccess = featureGroup.some((name) => allowedFeatures.has(name));

      if (!canAccess) {
        return res.status(403).json({
          success: false,
          message:
            "This feature is available only in the Standard plan.",
        });
      }

      req.collegePlan = plan;
      req.collegeFeatureSet = allowedFeatures;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  requirePlanFeature,
};
