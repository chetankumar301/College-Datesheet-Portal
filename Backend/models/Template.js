const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ["MAIN_EXAM", "BACK_EXAM", "PRACTICAL_EXAM"],
        required: true
    },
    description: {
        type: String
    },
    pattern: {
        type: Object,
        default: {}
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Template", templateSchema);