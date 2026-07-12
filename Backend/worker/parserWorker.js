const parserQueue = require("../queue/parserQueue");
const UploadedPDF = require("../models/UploadedPDF");

parserQueue.process(async(job)=>{

    const { pdfId } = job.data;

    console.log("Processing PDF:", pdfId);

    const pdf = await UploadedPDF.findById(pdfId);

    if(!pdf){

        throw new Error("PDF Not Found");

    }

    pdf.status = "PROCESSING";

    await pdf.save();

    const { readPDF } = require("../services/parser/PDFReader");

const { extractText } = require("../services/parser/TextExatractor");

const DocumentAnalyzer = require("../services/parser/DocumentAnalyzer");

const ExamExtractor = require("../services/parser/ExamExtractor");

const PreviewService = require("../services/parser/PreviewService");

const text = await readPDF(pdf.filePath);

const lines = extractText(text);

const analysis = DocumentAnalyzer.analyze(lines);

const exams = await ExamExtractor.extract(lines);

const preview = PreviewService.generate(exams);
const ParsingJob=require("../models/ParsingJob");

await ParsingJob.create({

uploadedPDF:pdf._id,

status:"PREVIEW",

template:analysis.examType,

parsedExams:preview,

logs:[
"PDF Read",
"Parser Completed",
"Preview Generated"
]

});

pdf.status="PREVIEW";

await pdf.save();

console.log(preview);

    // Module 16
    // PDF Reader

    console.log("Parsing Completed");

    pdf.status = "PREVIEW";

    await pdf.save();

});