const mongoose = require("mongoose");

const datesheetSchema = new mongoose.Schema(
{

title:{
type:String,
required:true
},

academicSession:{
type:mongoose.Schema.Types.ObjectId,
ref:"AcademicSession",
required:true
},

course:{
type:mongoose.Schema.Types.ObjectId,
ref:"Course",
required:true
},

branch:{
type:mongoose.Schema.Types.ObjectId,
ref:"Branch",
required:true
},

semester:{
type:Number,
required:true
},

examType:{
type:String,
enum:["MAIN","BACK","PRACTICAL"],
required:true
},

version:{
type:Number,
default:1
},

published:{
type:Boolean,
default:false
},

uploadedPDF:{
type:mongoose.Schema.Types.ObjectId,
ref:"UploadedPDF"
},

uploadedBy:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
}

},
{
timestamps:true
});

module.exports=mongoose.model(
"Datesheet",
datesheetSchema
);