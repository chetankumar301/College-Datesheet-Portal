const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    academicSession: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AcademicSession"
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Semester", semesterSchema);