const Branch = require("../models/Branch");

// Create Branch

exports.createBranch = async (req, res) => {

    try{

        const branch = await Branch.create(req.body);

        res.status(201).json({

            success:true,

            data:branch

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

// Get Branches By Course

exports.getBranchesByCourse = async (req,res)=>{

    try{

        const branches = await Branch.find({

            course:req.params.courseId

        });

        res.json({

            success:true,

            data:branches

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};