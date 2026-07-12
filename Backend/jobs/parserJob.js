const parserQueue = require("../queue/parserQueue");

const createParserJob = async (pdfId) => {

    await parserQueue.add({
        pdfId
    });

};

module.exports = createParserJob;