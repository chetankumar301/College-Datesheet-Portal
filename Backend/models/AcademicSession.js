const mongoose = require("mongoose");

const academicSessionSchema = new mongoose.Schema(
{
    sessionName:{
        type:String,
        required:true,
        unique:true
    },

    startYear:{
        type:Number,
        required:true
    },

    endYear:{
        type:Number,
        required:true
    },

    isCurrent:{
        type:Boolean,
        default:false
    },

    isActive:{
        type:Boolean,
        default:true
    }

},
{
timestamps:true
});

module.exports = mongoose.model(
"AcademicSession",
academicSessionSchema
);