const express = require("express");

const router = express.Router();

const {

createCourse,

getCourses

} = require("../controllers/courseController");

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

createCourse

);

router.get(

"/",

protect,

getCourses

);

module.exports = router;