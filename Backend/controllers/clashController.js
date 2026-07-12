const ClashDetector = require("../services/clash/ClashDetector");

exports.getExamClashes = async (req, res) => {

    try {

        const clashes = await ClashDetector.detectClashes(req.user);

        res.json({

            success: true,

            totalClashes: clashes.length,

            data: clashes

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};