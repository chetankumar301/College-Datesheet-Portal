const Subject = require("../models/subject");

exports.getSubjects = async(req,res)=>{
    try{
        const query = {};

        if(req.query.branch) query.branch = req.query.branch;
        if(req.query.semester) query.semester = Number(req.query.semester);
        if(req.query.course) query.course = req.query.course;

        const subjects = await Subject.find(query)
            .populate("course", "name code")
            .populate("branch", "name code")
            .sort({ semester:1, subjectCode:1 });

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
