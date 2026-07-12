exports.calculate = (exam) => {

    let confidence = 100;

    if (!exam.subject)
        confidence -= 40;

    if (!exam.date)
        confidence -= 20;

    if (!exam.time)
        confidence -= 20;

    if (confidence < 0)
        confidence = 0;

    return confidence;

};