const mongoose = require("mongoose");

const uploadedPDFSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:true
    },

    originalName:{
        type:String,
        required:true
    },

    storedName:{
        type:String,
        required:true,
        unique:true
    },

    filePath:{
        type:String,
        required:true
    },

    fileSize:{
        type:Number,
        required:true
    },

    mimeType:{
        type:String,
        default:"application/pdf"
    },

    cloudinary:{
        secureUrl:{
            type:String,
            default:""
        },
        publicId:{
            type:String,
            default:""
        },
        resourceType:{
            type:String,
            default:"raw"
        }
    },

    examType:{
        type:String,
        enum:["MAIN","BACK","PRACTICAL"],
        required:true
    },

    status:{
        type:String,
        enum:[
            "UPLOADED",
            "PROCESSING",
            "PREVIEW",
            "PUBLISHED",
            "FAILED"
        ],
        default:"UPLOADED"
    },

    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Admin",
        required:true
    },

    processingLog:{
        type:String,
        default:""
    }

},
{
timestamps:true
});

module.exports = mongoose.models.UploadedPDF || mongoose.model("UploadedPDF", uploadedPDFSchema);
