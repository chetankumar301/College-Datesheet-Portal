const AcademicSession = require("../models/AcademicSession");

// Create Session

exports.createSession = async(req,res)=>{

try{

const session = await AcademicSession.create(req.body);

res.status(201).json({

success:true,

data:session

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};

// Get Sessions

exports.getSessions = async(req,res)=>{

const sessions = await AcademicSession.find();

res.json({

success:true,

data:sessions

});

};