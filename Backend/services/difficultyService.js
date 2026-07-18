const normalize = (value, min, max) => {
  if (max === min) return 0;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

const getDifficultyLevel = (score) => {
  if (score <= 30) return "Very Easy";
  if (score <= 45) return "Easy";
  if (score <= 60) return "Medium";
  if (score <= 75) return "Hard";
  return "Very Hard";
};

const calculateSubjectDifficulty = (subject = {}, options = {}) => {
  const weights = {
    credits: 0.3,
    subjectType: 0.15,
    syllabusSize: 0.15,
    complexity: 0.15,
    historicalResult: 0.15,
    facultyRating: 0.1,
    ...options.weights,
  };

  const creditsScore = normalize(Number(subject.credits || 0), 0, 10) * 100;
  const typeScore =
    subject.subjectType === "Practical" ? 25 :
    subject.subjectType === "Project" ? 35 : 60;
  const syllabusScore = normalize(Number(subject.syllabusUnits || 0), 0, 20) * 100;
  const complexityScore = normalize(Number(subject.complexityRating || 0), 0, 10) * 100;
  const historicalScore = normalize(Number(subject.passPercentage || 0), 0, 100);
  const facultyScore = normalize(Number(subject.adminDifficultyRating || subject.facultyRating || 0), 0, 10) * 100;

  const score =
    creditsScore * weights.credits +
    typeScore * weights.subjectType +
    syllabusScore * weights.syllabusSize +
    complexityScore * weights.complexity +
    (100 - historicalScore) * weights.historicalResult +
    facultyScore * weights.facultyRating;

  const calculatedDifficultyScore = Math.max(0, Math.min(100, Math.round(score)));
  return {
    calculatedDifficultyScore,
    calculatedDifficultyLevel: getDifficultyLevel(calculatedDifficultyScore),
    recommendedGap:
      calculatedDifficultyScore >= 76 ? 3 :
      calculatedDifficultyScore >= 61 ? 2 :
      calculatedDifficultyScore >= 46 ? 1 :
      0,
  };
};

module.exports = { calculateSubjectDifficulty, getDifficultyLevel };
