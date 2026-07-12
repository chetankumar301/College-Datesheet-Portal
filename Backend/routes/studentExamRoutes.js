const express=require("express");

const router=express.Router();

const{

getMyExams

}=require("../controllers/studentExamController");

const{

protect

}=require("../middleware/authMiddleware");

router.get(

"/my-exams",

protect,

getMyExams

);

module.exports=router;