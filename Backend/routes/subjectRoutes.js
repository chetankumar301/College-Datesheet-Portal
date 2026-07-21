const express = require("express");

const router = express.Router();

const {

createSubject,

getSubjects,

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

"/",

protect,

getSubjects

);

router.get(

"/:branchId/:semester",

protect,

getSubjectsBySemester

);

module.exports = router;
