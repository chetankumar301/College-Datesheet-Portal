const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({

    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    subject1:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject",
        required:true
    },

    subject2:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject",
        required:true
    },

    complaintType:{
        type:String,
        enum:[
            "EXAM_CLASH",
            "WRONG_DATE",
            "WRONG_TIME",
            "OTHER"
        ],
        default:"EXAM_CLASH"
    },

    description:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:[
            "PENDING",
            "IN_REVIEW",
            "RESOLVED",
            "REJECTED"
        ],
        default:"PENDING"
    },

    priority:{
        type:String,
        enum:["LOW","MEDIUM","HIGH","URGENT"],
        default:"MEDIUM"
    },

    category:{
        type:String,
        default:"Exam"
    },

    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Admin",
        default:null
    },

    history:[{
        status:String,
        note:String,
        by:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Admin"
        },
        at:{
            type:Date,
            default:Date.now
        }
    }],

    adminReply:{
        type:String,
        default:""
    },

    repliedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },

    repliedAt:{
        type:Date,
        default:null
    }

},{
timestamps:true
});

module.exports = mongoose.model(
    "Complaint",
    complaintSchema
);
