const ParsingJob=require("../models/ParsingJob");

exports.getJobs=async(req,res)=>{
try{
const jobs=await ParsingJob.find()
.populate("uploadedPDF", "originalName filePath status examType createdAt")
.sort({ createdAt:-1 })
.limit(100);

res.json({
success:true,
data:jobs
});
}
catch(err){
res.status(500).json({
success:false,
message:err.message
});
}
};

exports.getPreview=async(req,res)=>{

try{

const preview=await ParsingJob.findById(

req.params.id

)
.populate("parsedExams.subject");

res.json({

success:true,

data:preview

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};

// Update a single parsed exam row
exports.updateRow = async (req, res) => {
    try {

        const { rowIndex, row } = req.body;

        const job = await ParsingJob.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Parsing Job not found"
            });
        }

        if (
            rowIndex < 0 ||
            rowIndex >= job.parsedExams.length
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid row index"
            });
        }

        job.parsedExams[rowIndex] = {
            ...job.parsedExams[rowIndex].toObject(),
            ...row,
            status: "EDITED"
        };

        await job.save();

        res.json({
            success: true,
            message: "Row updated successfully",
            data: job.parsedExams[rowIndex]
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

const PublishEngine=require("../services/parser/PublishEngine");
exports.publishJob=async(req,res)=>{

try{

const schedule=await PublishEngine.publish(

req.params.id,

req.user._id

);

res.json({

success:true,

message:"Published Successfully",

schedule

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};
