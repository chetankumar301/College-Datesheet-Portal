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

const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ success:false, message:"Admin access required" });
    }
    next();
};

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

adminOnly,

getAllComplaints

);

router.put(

"/reply/:id",

protect,

adminOnly,

replyComplaint

);

module.exports=router;
