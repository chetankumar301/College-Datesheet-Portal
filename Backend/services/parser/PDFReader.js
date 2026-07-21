const pdfParse = require("pdf-parse");
const fs = require("fs");
const https = require("https");

const readRemoteFile = (url) => new Promise((resolve, reject) => {
    https.get(url, (response) => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`Failed to download PDF: ${response.statusCode}`));
            response.resume();
            return;
        }

        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => resolve(Buffer.concat(chunks)));
    }).on("error", reject);
});

async function readPDF(filePath) {
    try {
        const dataBuffer = /^https?:\/\//i.test(filePath)
            ? await readRemoteFile(filePath)
            : fs.readFileSync(filePath);
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
