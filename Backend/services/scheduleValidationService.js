const { getRequiredGap } = require("./gapCalculationService");

const validateExamination = (payload = {}) => {
  const errors = [];
  if (!payload.examName) errors.push("examName is required");
  if (!payload.academicSession) errors.push("academicSession is required");
  if (!payload.examType) errors.push("examType is required");
  if (!payload.startDate || !payload.endDate) errors.push("startDate and endDate are required");
  if (payload.startDate && payload.endDate && new Date(payload.endDate) < new Date(payload.startDate)) {
    errors.push("endDate cannot be before startDate");
  }
  if (!Array.isArray(payload.availableShifts) || payload.availableShifts.length === 0) {
    errors.push("At least one available shift is required");
  }
  if (!Array.isArray(payload.allowedWeekDays) || payload.allowedWeekDays.length === 0) {
    errors.push("At least one allowed weekday is required");
  }
  if (Number(payload.minimumGap || 0) > Number(payload.maximumGap || 0)) {
    errors.push("minimumGap cannot be greater than maximumGap");
  }
  return errors;
};

const validateScheduleSlot = ({ previousSubject, nextSubject, minimumGap, maxExamsPerDay }) => {
  const hardViolations = [];
  if (previousSubject && nextSubject) {
    const requiredGap = getRequiredGap(
      previousSubject.calculatedDifficultyLevel,
      nextSubject.calculatedDifficultyLevel,
      minimumGap
    );
    if (requiredGap < minimumGap) {
      hardViolations.push("Minimum gap rule violated");
    }
  }
  return {
    valid: hardViolations.length === 0,
    hardViolations,
    maxExamsPerDay,
  };
};

const calculateAvailableDays = ({ startDate, endDate, allowedWeekDays = [], blockedDates = [] }) => {
  const slots = [];
  const cursor = new Date(startDate);
  const end = new Date(endDate);
  const blocked = new Set((blockedDates || []).map((d) => new Date(d).toDateString()));

  while (cursor <= end) {
    if (allowedWeekDays.includes(cursor.getDay()) && !blocked.has(cursor.toDateString())) {
      slots.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return {
    totalCalendarDays: Math.max(0, Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000) + 1),
    actualAvailableDays: slots.length,
    availableDates: slots,
  };
};

module.exports = { validateExamination, validateScheduleSlot, calculateAvailableDays };
