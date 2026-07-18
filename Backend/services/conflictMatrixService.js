const User = require("../models/User");
const BackPaperEnrollment = require("../models/BackPaperEnrollment");

const sameCohort = (a, b) => {
  const courseA = String(a.course?._id || a.course || "");
  const courseB = String(b.course?._id || b.course || "");
  const branchA = String(a.branch?._id || a.branch || "");
  const branchB = String(b.branch?._id || b.branch || "");
  return courseA === courseB && branchA === branchB && Number(a.semester) === Number(b.semester);
};

const buildConflictMatrix = async (subjects = [], collegeId) => {
  const matrix = {};
  const backPaperRows = collegeId
    ? await BackPaperEnrollment.find({ collegeId, status: "active" }).populate("subjectId studentId")
    : [];
  const studentRows = collegeId
    ? await User.find({ college: collegeId, role: "student" }).select("course branch semester")
    : [];

  for (let i = 0; i < subjects.length; i += 1) {
    const a = subjects[i];
    matrix[a._id] = matrix[a._id] || {};
    for (let j = 0; j < subjects.length; j += 1) {
      if (i === j) continue;
      const b = subjects[j];

      let commonStudents = 0;
      if (sameCohort(a, b)) {
        commonStudents = studentRows.filter((student) => sameCohort(a, student)).length;
      }

      const backPaperConflict = backPaperRows.filter((row) => {
        const subjectId = String(row.subjectId?._id || row.subjectId || "");
        return subjectId === String(a._id) || subjectId === String(b._id);
      }).length;

      const totalConflict = commonStudents + backPaperConflict;
      if (totalConflict > 0) {
        matrix[a._id][b._id] = {
          commonStudents,
          backPaperConflict,
          totalConflict,
        };
      }
    }
  }

  return matrix;
};

module.exports = { buildConflictMatrix };
