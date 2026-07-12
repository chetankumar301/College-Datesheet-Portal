const express=require("express");

const router=express.Router();

const{

getPreview,

updateRow,

publishJob

}=require("../controllers/parsingJobController");

const{

protect

}=require("../middleware/authMiddleware");

const{

authorize

}=require("../middleware/roleMiddleware");

router.get(

"/:id",

protect,

authorize("admin"),

getPreview

);

router.put(

"/:id",

protect,

authorize("admin"),

updateRow

);

router.post(

"/publish/:id",

protect,

authorize("admin"),

publishJob

);

module.exports=router;