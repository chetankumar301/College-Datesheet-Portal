const Complaint=require("../../models/Complaint");

exports.createComplaint=async(data)=>{

    return await Complaint.create(data);

};