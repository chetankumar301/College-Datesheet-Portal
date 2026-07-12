const express=require("express");

const router=express.Router();

const{

createComplaint,

getMyComplaints,

getAllComplaints,

replyComplaint

}=require("../controllers/complaintController");

const{

protect

}=require("../middleware/authMiddleware");

const{

authorize

}=require("../middleware/roleMiddleware");

router.post(

"/",

protect,

createComplaint

);

router.get(

"/my",

protect,

getMyComplaints

);

router.get(

"/admin",

protect,

authorize("admin"),

getAllComplaints

);

router.put(

"/reply/:id",

protect,

authorize("admin"),

replyComplaint

);

module.exports=router;