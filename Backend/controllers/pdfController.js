const UploadedPDF=require("../models/UploadedPDF");

const createParserJob=require("../jobs/parserJob");
const { uploadBuffer } = require("../services/cloudinaryService");
const { deleteFile } = require("../services/cloudinaryService");

exports.uploadPDF=async(req,res)=>{

try{
if (!req.file) {
return res.status(400).json({
success:false,
message:"PDF file is required"
});
}

if (req.file.mimetype !== "application/pdf") {
return res.status(400).json({
success:false,
message:"Only PDF files are allowed for datesheet uploads"
});
}

const{

title,

examType

}=req.body;

const uploaded = await uploadBuffer({
buffer:req.file.buffer,
folder:"college-erp/datesheet-pdfs",
resourceType:"raw"
});

const pdf=await UploadedPDF.create({

title,

originalName:req.file.originalname,

storedName:uploaded.public_id,

filePath:uploaded.secure_url,

fileSize:req.file.size,

mimeType:req.file.mimetype,

cloudinary:{
secureUrl:uploaded.secure_url,
publicId:uploaded.public_id,
resourceType:uploaded.resource_type || "raw"
},

examType,

uploadedBy:req.user._id

});

res.status(201).json({

success:true,

message:"PDF Uploaded Successfully",

data:pdf

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};
exports.getPDFStatus = async(req,res)=>{

    const pdf = await UploadedPDF.findById(

        req.params.id

    );

    res.json({

        success:true,

        status:pdf.status

    });

};

exports.getPDFs = async(req,res)=>{
try{
const query = req.user.role === "admin"
? { uploadedBy:req.user._id }
: {};

const pdfs = await UploadedPDF.find(query)
.sort({ createdAt:-1 })
.limit(100);

res.status(200).json({
success:true,
data:pdfs
});
}
catch(err){
res.status(500).json({
success:false,
message:err.message
});
}
};

exports.deletePDF = async(req,res)=>{
try{
const pdf = await UploadedPDF.findById(req.params.id);

if(!pdf){
return res.status(404).json({
success:false,
message:"PDF not found"
});
}

if(pdf.cloudinary?.publicId){
await deleteFile(pdf.cloudinary.publicId, pdf.cloudinary.resourceType || "raw");
}

await UploadedPDF.findByIdAndDelete(req.params.id);

res.status(200).json({
success:true,
message:"PDF deleted successfully"
});
}
catch(err){
res.status(500).json({
success:false,
message:err.message
});
}
};
