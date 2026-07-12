function extractText(text) {
    try {
        // Split text into lines
        const lines = text.split("\n");
        
        // Filter out empty lines and trim whitespace
        const cleanedLines = lines
            .map(line => line.trim())
            .filter(line => line.length > 0);
        
        return cleanedLines;
    } catch (error) {
        console.error("Error extracting text:", error);
        throw new Error("Failed to extract text from PDF");
    }
}

module.exports = {
    extractText
};