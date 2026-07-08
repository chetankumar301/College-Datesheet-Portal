const express=require("express");

const router=express.Router();

const{

uploadPDF

}=require("../controllers/pdfController");

const{

protect

}=require("../middleware/authMiddleware");

const{

authorize

}=require("../middleware/roleMiddleware");

const upload=require("../middleware/uploadMiddleware");

router.post(

"/upload",

protect,

authorize("admin"),

upload.single("pdf"),

uploadPDF

);

module.exports=router;