const express = require("express");

const router = express.Router();

const {
  testSubject,
} = require("../controllers/subjectController");

router.get("/", testSubject);

module.exports = router;