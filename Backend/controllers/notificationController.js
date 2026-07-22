const Notification=require("../models/Notification");
const User=require("../models/User");

exports.getMyNotifications=async(req,res)=>{

try{

const notifications=await Notification.find({

receiver:req.user._id

})
.sort({

createdAt:-1

});

res.json({

success:true,

count:notifications.length,

data:notifications

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};
exports.markAsRead = async (req, res) => {

    try {

        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        // Security check: only the owner can mark it as read
        if (notification.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        notification.isRead = true;

        await notification.save();

        res.json({
            success: true,
            message: "Notification marked as read",
            data: notification
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.markAllAsRead = async (req, res) => {

    try {

        const result = await Notification.updateMany(

            {
                receiver: req.user._id,
                isRead: false
            },

            {
                $set: {
                    isRead: true
                }
            }

        );

        res.json({

            success: true,

            message: "All notifications marked as read",

            modifiedCount: result.modifiedCount

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getUnreadCount = async (req, res) => {

    try {

        const count = await Notification.countDocuments({

    receiver: req.user._id,

    isRead: false,

    isDeleted: false

});

        res.json({

            success: true,

            unread: count

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getMyNotifications = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 20;

        const skip = (page - 1) * limit;

        const notifications = await Notification.find({

    receiver: req.user._id,

    isDeleted: false

})

        .sort({ createdAt: -1 })

        .skip(skip)

        .limit(limit);

        const total = await Notification.countDocuments({

            receiver: req.user._id

        });

        res.json({

            success: true,

            total,

            page,

            totalPages: Math.ceil(total / limit),

            data: notifications

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.deleteNotification = async (req, res) => {

    try {

        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        // Security check
        if (notification.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        notification.isDeleted = true;

        await notification.save();

        res.json({
            success: true,
            message: "Notification deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.createNotification = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const { title, message, type = "UPDATE", audience = "all", course, semester, students = [] } = req.body;

        if (!title || !message) {
            return res.status(400).json({
                success: false,
                message: "Title and message are required"
            });
        }

        const query = { role: "student", isActive: { $ne: false } };
        if (req.user.college) query.college = req.user.college;

        if (audience === "course" && course) query.course = course;
        if (audience === "semester" && semester) query.semester = Number(semester);
        if (audience === "individual" && students.length) query._id = { $in: students };

        const receivers = await User.find(query).select("_id");
        const notifications = await Notification.insertMany(receivers.map((receiver) => ({
            title,
            message,
            type,
            receiver: receiver._id,
            metadata: {}
        })));

        res.status(201).json({
            success: true,
            message: "Notification sent successfully",
            count: notifications.length,
            data: notifications
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
