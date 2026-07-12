const mongoose = require("mongoose");

const parsedExamSchema = new mongoose.Schema(
{
    subject:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject"
    },

    subjectCode:String,

    subjectName:String,

    examDate:String,

    startTime:String,

    endTime:String,

    semester:Number,

    confidence:{
        type:Number,
        default:0
    },

    status:{
        type:String,
        enum:["READY","REVIEW","EDITED"],
        default:"REVIEW"
    },

    errors:[String]

},
{
    _id:false
}
);

const logSchema = new mongoose.Schema({

    action:{
        type:String,
        required:true
    },

    timestamp:{
        type:Date,
        default:Date.now
    },

    performedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{
    _id:false
});

const parsingJobSchema = new mongoose.Schema({

    uploadedPDF:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UploadedPDF",
        required:true
    },

    status:{
        type:String,
        enum:[
            "UPLOADED",
            "PROCESSING",
            "PREVIEW",
            "READY_FOR_REVIEW",
            "PUBLISHING",
            "PUBLISHED",
            "FAILED"
        ],
        default:"UPLOADED"
    },

    template:String,

    parsedExams:[parsedExamSchema],

    logs:[logSchema]

},
{
    timestamps:true
});

module.exports = mongoose.model(
    "ParsingJob",
    parsingJobSchema
);