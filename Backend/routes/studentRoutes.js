const express = require("express");

const router = express.Router();

const {
    getDashboard
} = require("../controllers/studentController");

const {
    protect
} = require("../middleware/authMiddleware");

const {
    authorize
} = require("../middleware/roleMiddleware");

router.get(
    "/dashboard",
    protect,
    authorize("student"),
    getDashboard
);

module.exports = router;