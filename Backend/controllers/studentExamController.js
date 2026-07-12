const Exam=require("../models/Exam");

exports.getMyExams=async(req,res)=>{

try{

const exams=await Exam.find({

semester:req.user.semester

})
.populate({

path:"subject"

})
.populate("examSchedule");

res.json({

success:true,

data:exams

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};