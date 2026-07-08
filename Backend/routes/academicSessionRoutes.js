const express = require("express");

const router = express.Router();

const {

createSession,

getSessions

} = require("../controllers/academicSessionController");

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

createSession

);

router.get(

"/",

protect,

getSessions

);

module.exports = router;