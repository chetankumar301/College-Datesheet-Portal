const Datesheet = require("../models/Datesheet");

// Upload Datesheet

exports.uploadDatesheet = async (req, res) => {
  try {

    const {
      title,
      examType,
      course,
      branch,
      semester,
    } = req.body;

    const pdfFile = req.file.filename;

    const datesheet = await Datesheet.create({
      title,
      examType,
      course,
      branch,
      semester,
      pdfFile,
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Datesheet Uploaded Successfully",
      datesheet,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// Get All Published Datesheets

exports.getAllDatesheets = async (req, res) => {

  const data = await Datesheet.find({
    published: true,
  })
    .populate("course")
    .populate("branch");

  res.json({
    success: true,
    data,
  });

};