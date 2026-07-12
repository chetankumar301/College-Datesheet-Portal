const Notification=require("../../models/Notification");

exports.send=async(data)=>{

    return await Notification.create(data);

};