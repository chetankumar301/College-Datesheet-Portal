const mongoose = require("mongoose");

const datesheetSchema = new mongoose.Schema(
{

title:{
type:String,
required:true
},

// College reference for multi-tenant support
college:{
type:mongoose.Schema.Types.ObjectId,
ref:"College",
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

// Approval workflow status
status:{
type:String,
enum:["draft","pending_approval","approved","rejected","published"],
default:"draft"
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
ref:"Admin"
},

// Approval tracking
submittedForApprovalAt:{
type:Date
},

approvedBy:{
type:mongoose.Schema.Types.ObjectId,
ref:"Admin"
},

approvedAt:{
type:Date
},

rejectedBy:{
type:mongoose.Schema.Types.ObjectId,
ref:"Admin"
},

rejectedAt:{
type:Date
},

rejectionReason:{
type:String,
default:""
},

// Published by
publishedBy:{
type:mongoose.Schema.Types.ObjectId,
ref:"Admin"
},

publishedAt:{
type:Date
},

// Exam data (parsed from PDF)
examData:[{
  subject:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Subject"
  },
  subjectCode:String,
  subjectName:String,
  examDate:Date,
  examTime:String,
  duration:String,
  venue:String
}]

},
{
timestamps:true
});

module.exports=mongoose.model(
"Datesheet",
datesheetSchema
);