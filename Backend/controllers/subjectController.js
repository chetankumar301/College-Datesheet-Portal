const Subject = require("../models/subject");

// Create Subject

exports.createSubject = async(req,res)=>{

    try{

        const subject = await Subject.create(req.body);

        res.status(201).json({

            success:true,

            data:subject

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

// Get Subjects

exports.getSubjectsBySemester = async(req,res)=>{

    try{

        const subjects = await Subject.find({

            branch:req.params.branchId,

            semester:req.params.semester

        });

        res.json({

            success:true,

            data:subjects

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};
