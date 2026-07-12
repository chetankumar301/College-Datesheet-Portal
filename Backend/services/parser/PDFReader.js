const pdfParse = require("pdf-parse");

async function readPDF(filePath) {
    try {
        const fs = require("fs");
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    } catch (error) {
        console.error("Error reading PDF:", error);
        throw new Error("Failed to read PDF file");
    }
}

module.exports = {
    readPDF
};