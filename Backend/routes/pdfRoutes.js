const express=require("express");

const router=express.Router();

const {
    uploadPDF,
    getPDFStatus
} = require("../controllers/pdfController");

const{

protect

}=require("../middleware/authMiddleware");

const{

authorize

}=require("../middleware/roleMiddleware");
const { requirePlanFeature } = require("../middleware/planFeatureMiddleware");

const upload=require("../middleware/uploadMiddleware");

router.post(

"/upload",

protect,

authorize("admin"),

requirePlanFeature("uploadDatesheetPdf"),

upload.single("pdf"),

uploadPDF

);
router.get(

"/status/:id",

protect,

getPDFStatus

);

module.exports=router;
