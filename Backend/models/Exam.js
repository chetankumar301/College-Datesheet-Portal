const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({

    examSchedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExamSchedule",
        required: true
    },

    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true
    },

    academicSession: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AcademicSession",
        required: true
    },

    semester: {
        type: Number,
        required: true
    },

    examDate: {
        type: String,
        required: true
    },

    startTime: {
        type: String,
        required: true
    },

    endTime: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "SCHEDULED"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Exam", examSchema);