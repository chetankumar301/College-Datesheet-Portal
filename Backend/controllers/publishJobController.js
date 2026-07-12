exports.publishJob = async (req, res) => {

    try {

        const result = await PublishEngine.publish(
            req.params.id,
            req.user._id
        );

        res.json({
            success: true,
            message: "Exam Schedule Published Successfully",
            schedule: result.schedule,
            totalExams: result.totalPublished
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};