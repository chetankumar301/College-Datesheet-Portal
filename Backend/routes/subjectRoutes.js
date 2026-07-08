const express = require("express");

const router = express.Router();

const {

createSubject,

getSubjectsBySemester

} = require("../controllers/subjectController");

const {

protect

} = require("../middleware/authMiddleware");

const {

authorize

} = require("../middleware/roleMiddleware");

router.post(

"/",

protect,

authorize("admin"),

createSubject

);

router.get(

"/:branchId/:semester",

protect,

getSubjectsBySemester

);

module.exports = router;