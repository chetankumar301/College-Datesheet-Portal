const express = require("express");

const router = express.Router();

const {
  uploadDatesheet,
  getAllDatesheets,
} = require("../controllers/datesheetController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorize,
} = require("../middleware/roleMiddleware");
const { requirePlanFeature } = require("../middleware/planFeatureMiddleware");

const upload = require("../middleware/uploadMiddleware");

router.post(
  "/upload",
  protect,
  authorize("admin"),
  requirePlanFeature("uploadDatesheetPdf"),
  upload.single("pdf"),
  uploadDatesheet
);

router.get(
  "/all",
  protect,
  getAllDatesheets
);

module.exports = router;
