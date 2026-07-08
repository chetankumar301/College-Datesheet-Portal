const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
{
    datesheet:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Datesheet",
        required:true
    },

    subject:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject",
        required:true
    },

    examDate:{
        type:Date,
        required:true
    },

    startTime:{
        type:String,
        required:true
    },

    endTime:{
        type:String,
        default:""
    },

    session:{
        type:String,
        default:"Morning"
    },

    venue:{
        type:String,
        default:"TBA"
    }
},
{
timestamps:true
});

module.exports=mongoose.model("Exam",examSchema);