const buildSuggestions = (scheduleOptions = []) => {
  return scheduleOptions.map((option) => ({
    title: `${option.name} tuning`,
    currentValue: option.name,
    recommendedValue: option.name,
    reason: "This is a baseline generated option. Adjust gap and shift mix for your college priorities.",
    expectedQualityScoreImprovement: 0,
  }));
};

module.exports = { buildSuggestions };
