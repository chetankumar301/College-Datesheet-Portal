const SubjectDetector = require("./SubjectDetector");
const DateDetector = require("./DateDetector");
const TimeDetector = require("./TimeDetector");
const SubjectMatcher = require("./SubjectMatcher");

exports.extract = async (lines) => {

    const detectedSubjects = SubjectDetector.detect(lines);

    const matchedSubjects = await SubjectMatcher.match(detectedSubjects);

    return {

        subjects: matchedSubjects,

        dates: DateDetector.detect(lines),

        times: TimeDetector.detect(lines)

    };

};