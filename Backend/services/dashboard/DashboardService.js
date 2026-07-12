const Exam = require("../../models/Exam");
const Notification = require("../../models/Notification");
const Complaint = require("../../models/Complaint");
const { getDaysLeft } = require("../../utils/countdown");

exports.getDashboard = async (user) => {

    const today = new Date();

    // Upcoming exams
   const exams = await Exam.find({

    semester: user.semester,

    course: user.course,

    branch: user.branch,

    academicSession: user.academicSession,

    examDate: {
        $gte: today.toISOString().split("T")[0]
    }

})
.populate("subject")
.populate("course")
.populate("branch")
.populate("academicSession")
.sort({
    examDate: 1
});

if(nextExam){

    nextExam._doc.daysLeft = getDaysLeft(nextExam.examDate);

}
    // Next exam
    const nextExam = exams.length > 0 ? exams[0] : null;

    // Notifications
    const notifications = await Notification.find({
        receiver: user._id,
        isDeleted: false
    })
    .sort({ createdAt: -1 })
    .limit(5);

    // Pending complaints
    const complaints = await Complaint.find({
        student: user._id,
        status: { $ne: "RESOLVED" }
    });

    return {

        student:{

            id:user._id,

            name:user.name,

            course:user.course,

            branch:user.branch,

            semester:user.semester

        },

        nextExam,

        upcomingExams: exams,

        notifications,

        pendingComplaints: complaints.length

    };

};