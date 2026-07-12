const NotificationService=require("./NotificationService");

exports.add=async(notification)=>{

    await NotificationService.send(notification);

};