const express = require("express");

const router = express.Router();

const {
  testCourse,
} = require("../controllers/courseController");

router.get("/", testCourse);

module.exports = router;