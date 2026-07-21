const Datesheet = require("../models/Datesheet");
const { uploadBuffer } = require("../services/cloudinaryService");

// Upload Datesheet

exports.uploadDatesheet = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        message: "Only PDF files are allowed for datesheet uploads",
      });
    }

    const {
      title,
      examType,
      course,
      branch,
      semester,
    } = req.body;

    const uploaded = await uploadBuffer({
      buffer: req.file.buffer,
      folder: "college-erp/datesheets",
      resourceType: "raw",
    });

    const datesheet = await Datesheet.create({
      title,
      examType,
      course,
      branch,
      semester,
      pdfFile: uploaded.secure_url,
      cloudinary: {
        secureUrl: uploaded.secure_url,
        publicId: uploaded.public_id,
        resourceType: uploaded.resource_type || "raw",
      },
      college: req.user.college,
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
