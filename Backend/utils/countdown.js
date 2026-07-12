exports.getDaysLeft = (examDate) => {

    const today = new Date();

    const exam = new Date(examDate);

    const diff = exam - today;

    return Math.ceil(diff / (1000 * 60 * 60 * 24));

};