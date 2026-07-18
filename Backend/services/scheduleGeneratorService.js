const Subject = require("../models/subject");
const User = require("../models/User");
const BackPaperEnrollment = require("../models/BackPaperEnrollment");
const { calculateSubjectDifficulty } = require("./difficultyService");
const { getRequiredGap } = require("./gapCalculationService");
const { calculateQualityScore } = require("./scheduleScoreService");

const buildDaySlots = (startDate, endDate, allowedWeekDays = [], blockedDates = []) => {
  const slots = [];
  const cursor = new Date(startDate);
  const end = new Date(endDate);
  const blocked = new Set((blockedDates || []).map((d) => new Date(d).toDateString()));

  while (cursor <= end) {
    const day = cursor.getDay();
    if (allowedWeekDays.includes(day) && !blocked.has(cursor.toDateString())) {
      slots.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return slots;
};

const generateSchedule = async ({ examination, collegeId }) => {
  const subjects = await Subject.find({
    isActive: true,
  }).populate("course branch");

  const students = await User.countDocuments({ college: collegeId, role: "student" });
  const backPapers = await BackPaperEnrollment.countDocuments({ collegeId, status: "active" });

  const analyzed = subjects.map((subject) => {
    const difficulty = calculateSubjectDifficulty(subject);
    return {
      subject,
      difficulty,
    };
  });

  analyzed.sort((a, b) => {
    if (b.difficulty.calculatedDifficultyScore !== a.difficulty.calculatedDifficultyScore) {
      return b.difficulty.calculatedDifficultyScore - a.difficulty.calculatedDifficultyScore;
    }
    return (b.subject.credits || 0) - (a.subject.credits || 0);
  });

  const slots = buildDaySlots(
    examination.startDate,
    examination.endDate,
    examination.allowedWeekDays,
    examination.blockedDates
  );

  const schedule = [];
  let slotIndex = 0;

  for (const item of analyzed) {
    const date = slots[slotIndex] || slots[slots.length - 1] || new Date(examination.startDate);
    const shift = examination.availableShifts[slotIndex % examination.availableShifts.length] || "Morning";
    schedule.push({
      collegeId,
      examinationId: examination._id,
      subjectId: item.subject._id,
      date,
      shift,
      calculatedDifficultyScore: item.difficulty.calculatedDifficultyScore,
      calculatedDifficultyLevel: item.difficulty.calculatedDifficultyLevel,
      recommendedGap: item.difficulty.recommendedGap,
      gapFromPrevious: slotIndex === 0 ? 0 : getRequiredGap(
        analyzed[slotIndex - 1].difficulty.calculatedDifficultyLevel,
        item.difficulty.calculatedDifficultyLevel,
        examination.minimumGap
      ),
    });
    slotIndex += 1;
  }

  return {
    summary: {
      students,
      backPapers,
      totalSubjects: analyzed.length,
      availableDays: slots.length,
    },
    options: [
      {
        name: "Student-Friendly Schedule",
        qualityScore: calculateQualityScore({ gapScore: 20, roomUtilization: 8, shiftBalance: 8, facultyAvailability: 10 }),
        schedule,
      },
      {
        name: "Balanced Schedule",
        qualityScore: calculateQualityScore({ gapScore: 16, roomUtilization: 10, shiftBalance: 10, facultyAvailability: 10 }),
        schedule,
      },
      {
        name: "Compact Schedule",
        qualityScore: calculateQualityScore({ gapScore: 10, roomUtilization: 10, shiftBalance: 6, facultyAvailability: 10 }),
        schedule,
      },
    ],
  };
};

module.exports = { generateSchedule };
