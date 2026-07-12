const mongoose = require("mongoose");

const examScheduleSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:true
    },

    examType:{
        type:String,
        enum:["MAIN","BACK","PRACTICAL"],
        required:true
    },

    academicSession:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"AcademicSession"
    },

    uploadedPDF:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UploadedPDF"
    },

    version:{
        type:Number,
        default:1
    },

    publishedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    publishedAt:{
        type:Date,
        default:Date.now
    },

    course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
},

branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true
},

semester: {
    type: Number,
    required: true
},
},
{
timestamps:true
});

module.exports = mongoose.model(
"ExamSchedule",
examScheduleSchema
);