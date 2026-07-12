const ConfidenceEngine = require("./ConfidenceEngine");

exports.generate = (data) => {

    const preview = [];

    const total = Math.max(
        data.subjects.length,
        data.dates.length,
        data.times.length
    );

    for (let i = 0; i < total; i++) {

        const exam = {

            subject: data.subjects[i] || null,

            date: data.dates[i] || null,

            time: data.times[i] || null

        };

        const confidence = ConfidenceEngine.calculate(exam);

        preview.push({

            ...exam,

            confidence,

            status:
                confidence >= 80
                    ? "READY"
                    : "REVIEW"

        });

    }

    return preview;

};