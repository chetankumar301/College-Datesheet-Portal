const Course = require("../models/Course");

// Create Course

exports.createCourse = async (req,res)=>{

    try{

        const course = await Course.create(req.body);

        res.status(201).json({

            success:true,

            data:course

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

// Get All Courses

exports.getCourses = async(req,res)=>{

    const courses = await Course.find();

    res.json({

        success:true,

        data:courses

    });

};