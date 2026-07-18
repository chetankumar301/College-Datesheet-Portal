const gapByDifficulty = {
  "Very Easy": { "Very Easy": 0, "Easy": 0, "Medium": 1, "Hard": 2, "Very Hard": 2 },
  Easy: { "Very Easy": 0, "Easy": 1, "Medium": 1, "Hard": 2, "Very Hard": 2 },
  Medium: { "Very Easy": 1, "Easy": 1, "Medium": 1, "Hard": 2, "Very Hard": 3 },
  Hard: { "Very Easy": 1, "Easy": 1, "Medium": 2, "Hard": 2, "Very Hard": 3 },
  "Very Hard": { "Very Easy": 2, "Easy": 2, "Medium": 2, "Hard": 3, "Very Hard": 3 },
};

const getRequiredGap = (previousLevel = "Medium", nextLevel = "Medium", minimumGap = 1) => {
  const row = gapByDifficulty[previousLevel] || gapByDifficulty.Medium;
  return Math.max(minimumGap, row[nextLevel] ?? minimumGap);
};

module.exports = { getRequiredGap };
