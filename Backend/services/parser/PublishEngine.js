const ParsingJob = require("../../models/ParsingJob");
const ExamSchedule = require("../../models/ExamSchedule");
const Exam = require("../../models/Exam");
const User=require("../../models/User");
const NotificationQueue=require("../notification/NotificationQueue");

exports.publish = async (jobId, userId) => {

    // Find parsing job
    const job = await ParsingJob.findById(jobId);

    if (!job) {
        throw new Error("Parsing Job not found");
    }

    if (job.approved) {
        throw new Error("This Parsing Job has already been published.");
    }

    // Create Exam Schedule
    const schedule = await ExamSchedule.create({
        title: "Exam Schedule",
        examType: "BACK", // Later this will come from ParsingJob
        uploadedPDF: job.uploadedPDF,
        publishedBy: userId,
    });

    // Prepare exam documents
    const exams = job.parsedExams
        .filter(row =>
            row.status === "READY" ||
            row.status === "EDITED"
        )
        .map(row => ({
            examSchedule: schedule._id,
            subject: row.subject,
            examDate: row.examDate,
            startTime: row.startTime,
            endTime: row.endTime,
            semester: row.semester,
            status: "SCHEDULED"
        }));

    // Bulk insert
    if (exams.length > 0) {
        const exams = job.parsedExams
.filter(row =>

    row.status === "READY" ||

    row.status === "EDITED"

)

.map(row => ({

    examSchedule: schedule._id,

    subject: row.subject,

    course: schedule.course,

    branch: schedule.branch,

    academicSession: schedule.academicSession,

    semester: row.semester,

    examDate: row.examDate,

    startTime: row.startTime,

    endTime: row.endTime,

    status: "SCHEDULED"

}));

await Exam.insertMany(exams);
    }

    // Update Parsing Job
    job.status = "PUBLISHED";
    job.approved = true;

    job.logs.push(
        `Published by ${userId} on ${new Date().toLocaleString()}`
    );

    await job.save();

    return {
        schedule,
        totalPublished: exams.length
    };
    
    const students = await User.find({

    role: "student",

    course: schedule.course,

    branch: schedule.branch,

    semester: schedule.semester,

    academicSession: schedule.academicSession

});

    for(const student of students){

    await NotificationQueue.add({

    title:"New Datesheet Published",

    message:"A new examination datesheet has been published.",

    type:"DATESHEET",

    receiver:student._id,

    metadata:{

    scheduleId:schedule._id

    }

    });

    }
};