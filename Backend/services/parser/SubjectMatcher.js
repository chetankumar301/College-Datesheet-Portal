const Subject = require("../../models/Subject");

exports.match = async (subjects) => {

    const matchedSubjects = [];

    for (const item of subjects) {

        const subject = await Subject.findOne({

            subjectCode: item.code

        })
        .populate("course")
        .populate("branch");

        if (subject) {

            matchedSubjects.push({

                found: true,

                confidence: 100,

                subject,

                raw: item.raw

            });

        } else {

            matchedSubjects.push({

                found: false,

                confidence: 0,

                code: item.code,

                raw: item.raw

            });

        }

    }

    return matchedSubjects;

};