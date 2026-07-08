const express = require("express");

const router = express.Router();

const {
    getBranchesByCourse,
    createBranch,
} = require("../controllers/branchController");

const {
    protect,
} = require("../middleware/authMiddleware");

const {
    authorize,
} = require("../middleware/roleMiddleware");

// Admin
router.post(
    "/",
    protect,
    authorize("admin"),
    createBranch
);

// Student/Admin
router.get(
    "/course/:courseId",
    protect,
    getBranchesByCourse
);

module.exports = router;