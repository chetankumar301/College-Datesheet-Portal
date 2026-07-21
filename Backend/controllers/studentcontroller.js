const User = require("../models/User");

const getDashboard = async (req, res) => {

    res.json({

        success: true,

        message: "Student Dashboard",

        user: req.user

    });

};

const getStudents = async (req, res) => {
    try {
        const query = { role: "student" };

        if (req.user.role === "admin" && req.user.college) {
            query.college = req.user.college;
        }

        const students = await User.find(query)
            .select("-password")
            .populate("college", "name code")
            .populate("course", "name code")
            .populate("branch", "name code")
            .populate("academicSession", "name year")
            .sort({ createdAt: -1 })
            .limit(200);

        res.json({
            success: true,
            data: students
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    getDashboard,
    getStudents,
};
