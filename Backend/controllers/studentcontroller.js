const getDashboard = async (req, res) => {

    res.json({

        success: true,

        message: "Student Dashboard",

        user: req.user

    });

};

module.exports = {
    getDashboard,
};