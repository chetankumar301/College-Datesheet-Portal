const PLAN_CATALOG = {
  basic: {
    name: "Basic",
    code: "basic",
    description: "Core datesheet workflow for upload and publishing.",
    billingCycle: "yearly",
    pricePerStudent: 5,
    currency: "INR",
    features: [
      "uploadDatesheetPdf",
      "replacePdf",
      "publishDatesheet",
      "studentPortal",
      "downloadDatesheet",
      "notifications",
      "datesheetArchive",
    ],
  },
  standard: {
    name: "Standard",
    code: "standard",
    description: "Full smart scheduling and analytics suite.",
    billingCycle: "yearly",
    pricePerStudent: 10,
    currency: "INR",
    features: [
      "uploadDatesheetPdf",
      "replacePdf",
      "publishDatesheet",
      "studentPortal",
      "downloadDatesheet",
      "notifications",
      "datesheetArchive",
      "createDatesheet",
      "automaticDatesheetGenerator",
      "aiScheduling",
      "creditBasedDifficulty",
      "smartGapEngine",
      "clashDetection",
      "roomAllocation",
      "seatingPlan",
      "invigilation",
      "multipleScheduleOptions",
      "scheduleQualityScore",
      "analytics",
    ],
  },
};

const normalizePlan = (plan = "basic") => {
  const key = String(plan).trim().toLowerCase();
  return PLAN_CATALOG[key] ? key : "basic";
};

const getPlanConfig = (plan = "basic") => PLAN_CATALOG[normalizePlan(plan)];

const calculatePlanAmount = (plan = "basic", studentCount = 0) => {
  const planConfig = getPlanConfig(plan);
  const count = Number(studentCount) || 0;
  return {
    studentCount: count,
    pricePerStudent: planConfig.pricePerStudent,
    calculatedAmount: count * planConfig.pricePerStudent,
    currency: planConfig.currency,
  };
};

module.exports = {
  PLAN_CATALOG,
  normalizePlan,
  getPlanConfig,
  calculatePlanAmount,
};
