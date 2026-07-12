const Exam = require("../../models/Exam");

exports.detectClashes = async (student) => {

    const exams = await Exam.find({

    semester: student.semester,

    course: student.course,

    branch: student.branch,

    academicSession: student.academicSession

})
.populate("subject");

    const clashes = [];

    for (let i = 0; i < exams.length; i++) {

        for (let j = i + 1; j < exams.length; j++) {

            if (

                exams[i].examDate === exams[j].examDate &&

                exams[i].startTime === exams[j].startTime

            ) {

                clashes.push({

                    subject1: exams[i],

                    subject2: exams[j],

                    reason: "Same Date & Same Time"

                });

            }

        }

    }

    return clashes;

};