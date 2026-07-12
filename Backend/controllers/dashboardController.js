const DashboardService = require("../services/dashboard/DashboardService");

exports.getDashboard = async (req, res) => {

    try {

        const dashboard = await DashboardService.getDashboard(req.user);

        res.json({

            success: true,

            data: dashboard

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};