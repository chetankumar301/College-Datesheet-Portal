const XLSX = require("xlsx");
const path = require("path");

const readExcel = (fileName) => {
  try {
    const filePath = path.join(__dirname, "excel", fileName);

    const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);

    return data;

  } catch (error) {

    console.log("Excel Read Error:", error.message);

    return [];

  }
};

module.exports = readExcel;