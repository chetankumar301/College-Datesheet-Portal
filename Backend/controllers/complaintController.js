const Complaint=require("../models/Complaint");

exports.createComplaint=async(req,res)=>{

try{

const complaint=await Complaint.create({

student:req.user._id,

subject1:req.body.subject1,

subject2:req.body.subject2,

complaintType:req.body.complaintType,

description:req.body.description

});

res.status(201).json({

success:true,

message:"Complaint submitted successfully",

data:complaint

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};

exports.getMyComplaints=async(req,res)=>{

try{

const complaints=await Complaint.find({

student:req.user._id

})

.populate("subject1")

.populate("subject2")

.sort({

createdAt:-1

});

res.json({

success:true,

count:complaints.length,

data:complaints

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};

exports.getAllComplaints=async(req,res)=>{

try{

const complaints=await Complaint.find()

.populate("student")

.populate("subject1")

.populate("subject2")

.sort({

createdAt:-1

});

res.json({

success:true,

count:complaints.length,

data:complaints

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};

const NotificationQueue=require("../services/notification/NotificationQueue");

exports.replyComplaint=async(req,res)=>{

try{

const complaint=await Complaint.findById(req.params.id);

if(!complaint){

return res.status(404).json({

success:false,

message:"Complaint not found"

});

}

complaint.adminReply=req.body.reply;

complaint.status="RESOLVED";

complaint.repliedBy=req.user._id;

complaint.repliedAt=new Date();

await complaint.save();

await NotificationQueue.add({

title:"Complaint Resolved",

message:"Your complaint has been reviewed. Please check the reply.",

type:"COMPLAINT",

receiver:complaint.student,

metadata:{

complaintId:complaint._id

}

});

res.json({

success:true,

message:"Reply submitted successfully"

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};