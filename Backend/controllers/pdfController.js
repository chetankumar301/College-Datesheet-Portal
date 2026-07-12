const UploadedPDF=require("../models/UploadedPDF");

const createParserJob=require("../jobs/parserJob");

exports.uploadPDF=async(req,res)=>{

try{

const{

title,

examType

}=req.body;

const pdf=await UploadedPDF.create({

title,

originalName:req.file.originalname,

storedName:req.file.filename,

filePath:req.file.path,

fileSize:req.file.size,

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