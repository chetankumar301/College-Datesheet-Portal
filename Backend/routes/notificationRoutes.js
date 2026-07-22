const express=require("express");

const router=express.Router();

const{

getMyNotifications,

markAsRead,

markAllAsRead,

getUnreadCount,

deleteNotification
,
createNotification

}=require("../controllers/notificationController");

const{

protect

}=require("../middleware/authMiddleware");

const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Admin access required" });
    }
    next();
};

router.post(

"/",

protect,

adminOnly,

createNotification

);

router.get(

"/unread-count",

protect,

getUnreadCount

);

router.get(

"/",

protect,

getMyNotifications

);

router.put(

"/mark-all-read",

protect,

markAllAsRead

);

router.put(

"/:id",

protect,

markAsRead

);

router.delete(

"/:id",

protect,

deleteNotification

);

module.exports=router;
