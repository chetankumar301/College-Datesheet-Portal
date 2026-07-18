const calculateQualityScore = ({ studentClash = 0, roomClash = 0, gapScore = 0, roomUtilization = 0, shiftBalance = 0, facultyAvailability = 0 }) => {
  let score = 0;
  if (studentClash === 0) score += 30;
  if (roomClash === 0) score += 20;
  score += Math.min(20, Math.max(0, gapScore));
  score += Math.min(10, Math.max(0, roomUtilization));
  score += Math.min(10, Math.max(0, shiftBalance));
  score += Math.min(10, Math.max(0, facultyAvailability));
  return Math.min(100, Math.round(score));
};

module.exports = { calculateQualityScore };
