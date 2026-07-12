const express = require("express");

const router = express.Router();

const {

    getExamClashes

} = require("../controllers/clashController");

const {

    protect

} = require("../middleware/authMiddleware");

router.get(

"/",

protect,

getExamClashes

);

module.exports = router;