const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    message:{
        type:String,
        required:true
    },

    type:{
        type:String,
        enum:[
            "DATESHEET",
            "UPDATE",
            "COMPLAINT",
            "REMINDER"
        ],
        default:"DATESHEET"
    },

    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    isRead:{
        type:Boolean,
        default:false
    },

    isDeleted: {
    type: Boolean,
    default: false
},

    metadata:{
        scheduleId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"ExamSchedule"
        },

        complaintId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Complaint"
        }
    }

},
{
timestamps:true
});

module.exports = mongoose.model(
"Notification",
notificationSchema
);