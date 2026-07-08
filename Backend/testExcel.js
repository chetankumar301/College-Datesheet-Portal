const readExcel = require("./database/readExcel");

const subjects = readExcel("BTECH_CSE.xlsx");

console.log(subjects);