const express = require("express");

const router = express.Router();

const {
  testBranch,
} = require("../controllers/branchController");

router.get("/", testBranch);

module.exports = router;