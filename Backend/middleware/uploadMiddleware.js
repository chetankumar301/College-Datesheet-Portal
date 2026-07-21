const multer=require("multer");

const storage=multer.memoryStorage();

const supportedMimeTypes = new Set([
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
]);

const fileFilter=(req,file,cb)=>{

if(supportedMimeTypes.has(file.mimetype)){

cb(null,true);

}

else{

cb(new Error("Only PDF, JPEG, PNG, and WebP files are allowed"));

}

};

const upload=multer({

storage,

limits:{

fileSize:Number(process.env.MAX_UPLOAD_FILE_SIZE || 10*1024*1024)

},

fileFilter

});

module.exports=upload;
