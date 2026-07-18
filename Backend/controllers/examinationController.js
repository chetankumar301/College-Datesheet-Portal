const Examination = require("../models/Examination");
const AuditLog = require("../models/AuditLog");
const ApprovalHistory = require("../models/ApprovalHistory");
const ScheduleVersion = require("../models/ScheduleVersion");
const Course = require("../models/Course");
const Branch = require("../models/Branch");
const Semester = require("../models/Semester");
const Subject = require("../models/subject");
const Room = require("../models/Room");
const FacultyAvailability = require("../models/FacultyAvailability");
const ScheduleSlot = require("../models/ScheduleSlot");
const PDFDocument = require("pdfkit");
const { validateExamination } = require("../services/scheduleValidationService");
const { calculateAvailableDays } = require("../services/scheduleValidationService");
const { calculateSubjectDifficulty } = require("../services/difficultyService");
const { generateSchedule } = require("../services/scheduleGeneratorService");
const { buildConflictMatrix } = require("../services/conflictMatrixService");
const { buildSuggestions } = require("../services/scheduleSuggestionService");

const createExamination = async (req, res) => {
  try {
    const errors = validateExamination(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0], errors });
    }

    const examination = await Examination.create({
      ...req.body,
      collegeId: req.user.college || req.body.collegeId,
      createdBy: req.user._id || req.user.id,
      updatedBy: req.user._id || req.user.id,
    });

    await AuditLog.create({
      user: req.user._id || req.user.id,
      admin: req.user._id || req.user.id,
      college: examination.collegeId,
      action: "other",
      entityType: "college",
      entityId: examination._id,
      description: `Created examination "${examination.examName}"`,
      metadata: examination.toObject(),
    });

    res.status(201).json({ success: true, data: examination });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getExaminations = async (req, res) => {
  try {
    const examinations = await Examination.find({
      collegeId: req.user.college || req.query.collegeId,
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: examinations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAcademicScope = async (req, res) => {
  try {
    const [courses, branches, semesters] = await Promise.all([
      Course.find({ isActive: true }).sort({ courseName: 1 }),
      Branch.find({ isActive: true }).populate("course").sort({ branchName: 1 }),
      Semester.find({ isActive: true }).sort({ createdAt: 1 }),
    ]);

    res.json({
      success: true,
      data: { courses, branches, semesters },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getEligibleSubjects = async (req, res) => {
  try {
    const { courseId, branchId, semester } = req.query;
    const query = { isActive: true };
    if (courseId) query.course = courseId;
    if (branchId) query.branch = branchId;
    if (semester) query.semester = Number(semester);

    const subjects = await Subject.find(query)
      .populate("course")
      .populate("branch")
      .sort({ subjectCode: 1 });

    const result = subjects.map((subject) => {
      const difficulty = calculateSubjectDifficulty(subject);
      return {
        ...subject.toObject(),
        ...difficulty,
      };
    });

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateExamination = async (req, res) => {
  try {
    const examination = await Examination.findOneAndUpdate(
      { _id: req.params.id, collegeId: req.user.college || req.body.collegeId },
      { ...req.body, updatedBy: req.user._id || req.user.id },
      { new: true, runValidators: true }
    );
    if (!examination) {
      return res.status(404).json({ success: false, message: "Examination not found" });
    }
    res.json({ success: true, data: examination });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const calculateDifficulty = async (req, res) => {
  try {
    const result = calculateSubjectDifficulty(req.body.subject || req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const generateExaminationSchedule = async (req, res) => {
  try {
    const examination = await Examination.findOne({
      _id: req.params.id,
      collegeId: req.user.college || req.query.collegeId,
    });
    if (!examination) {
      return res.status(404).json({ success: false, message: "Examination not found" });
    }

    const result = await generateSchedule({ examination, collegeId: examination.collegeId });
    await ScheduleSlot.deleteMany({
      collegeId: examination.collegeId,
      examinationId: examination._id,
    });
    await ScheduleSlot.insertMany(
      (result.options?.[0]?.schedule || []).map((slot) => ({
        collegeId: examination.collegeId,
        examinationId: examination._id,
        subjectId: slot.subjectId,
        date: slot.date,
        shift: slot.shift,
        status: "valid",
        createdBy: req.user._id || req.user.id,
        updatedBy: req.user._id || req.user.id,
      }))
    );

    await ScheduleVersion.create({
      collegeId: examination.collegeId,
      examinationId: examination._id,
      scheduleId: examination._id,
      versionNumber: 1,
      snapshot: result,
      changeSummary: "Initial generated schedule",
      createdBy: req.user._id || req.user.id,
    });

    await ApprovalHistory.create({
      collegeId: examination.collegeId,
      examinationId: examination._id,
      action: "generated",
      fromStatus: examination.status,
      toStatus: "generated",
      comment: "Schedule generated",
      createdBy: req.user._id || req.user.id,
      metadata: result,
    });

    examination.status = "generated";
    examination.updatedBy = req.user._id || req.user.id;
    await examination.save();
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getScheduleSlots = async (req, res) => {
  try {
    const examination = await Examination.findOne({
      _id: req.params.id,
      collegeId: req.user.college || req.query.collegeId,
    });
    if (!examination) {
      return res.status(404).json({ success: false, message: "Examination not found" });
    }

    const slots = await ScheduleSlot.find({
      examinationId: examination._id,
      collegeId: examination.collegeId,
    }).populate("subjectId roomId");

    res.json({ success: true, data: slots });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const moveScheduleSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { date, shift } = req.body;

    const slot = await ScheduleSlot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ success: false, message: "Schedule slot not found" });
    }

    if (date && shift) {
      const conflict = await ScheduleSlot.findOne({
        _id: { $ne: slot._id },
        examinationId: slot.examinationId,
        date: new Date(date),
        shift,
      });
      if (conflict) {
        return res.status(400).json({ success: false, message: "Slot conflict detected" });
      }
    }

    slot.date = date ? new Date(date) : slot.date;
    slot.shift = shift || slot.shift;
    slot.updatedBy = req.user._id || req.user.id;
    await slot.save();

    const latestVersion = await ScheduleVersion.findOne({
      collegeId: slot.collegeId,
      examinationId: slot.examinationId,
    }).sort({ versionNumber: -1, createdAt: -1 });

    const snapshotSlots = await ScheduleSlot.find({
      collegeId: slot.collegeId,
      examinationId: slot.examinationId,
    }).lean();

    await ScheduleVersion.create({
      collegeId: slot.collegeId,
      examinationId: slot.examinationId,
      scheduleId: slot.examinationId,
      versionNumber: (latestVersion?.versionNumber || 0) + 1,
      snapshot: {
        slots: snapshotSlots,
        movedSlot: { slotId: slot._id, date: slot.date, shift: slot.shift },
      },
      changeSummary: `Moved slot ${slot._id}`,
      createdBy: req.user._id || req.user.id,
    });

    await ApprovalHistory.create({
      collegeId: slot.collegeId,
      examinationId: slot.examinationId,
      action: "changes_requested",
      fromStatus: "generated",
      toStatus: "generated",
      comment: "Schedule slot moved",
      createdBy: req.user._id || req.user.id,
      metadata: { slotId: slot._id, date: slot.date, shift: slot.shift },
    });

    res.json({ success: true, data: slot });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const submitExaminationForReview = async (req, res) => {
  try {
    const examination = await Examination.findOne({
      _id: req.params.id,
      collegeId: req.user.college || req.query.collegeId,
    });
    if (!examination) {
      return res.status(404).json({ success: false, message: "Examination not found" });
    }
    const fromStatus = examination.status;
    examination.status = "exam_controller_review";
    examination.updatedBy = req.user._id || req.user.id;
    await examination.save();

    await ApprovalHistory.create({
      collegeId: examination.collegeId,
      examinationId: examination._id,
      action: "submitted",
      fromStatus,
      toStatus: examination.status,
      comment: req.body.comment || "Submitted for review",
      createdBy: req.user._id || req.user.id,
    });

    res.json({ success: true, data: examination });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const requestExaminationChanges = async (req, res) => {
  try {
    const examination = await Examination.findOne({
      _id: req.params.id,
      collegeId: req.user.college || req.query.collegeId,
    });
    if (!examination) {
      return res.status(404).json({ success: false, message: "Examination not found" });
    }
    const fromStatus = examination.status;
    examination.status = "changes_requested";
    examination.updatedBy = req.user._id || req.user.id;
    await examination.save();

    await ApprovalHistory.create({
      collegeId: examination.collegeId,
      examinationId: examination._id,
      action: "changes_requested",
      fromStatus,
      toStatus: examination.status,
      comment: req.body.comment || "Changes requested",
      createdBy: req.user._id || req.user.id,
      metadata: { reasons: req.body.reasons || [] },
    });

    res.json({ success: true, data: examination });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const approveExamination = async (req, res) => {
  try {
    const examination = await Examination.findOne({
      _id: req.params.id,
      collegeId: req.user.college || req.query.collegeId,
    });
    if (!examination) {
      return res.status(404).json({ success: false, message: "Examination not found" });
    }
    const fromStatus = examination.status;
    examination.status = "approved";
    examination.updatedBy = req.user._id || req.user.id;
    await examination.save();

    await ApprovalHistory.create({
      collegeId: examination.collegeId,
      examinationId: examination._id,
      action: "approved",
      fromStatus,
      toStatus: examination.status,
      comment: req.body.comment || "Approved",
      createdBy: req.user._id || req.user.id,
    });

    res.json({ success: true, data: examination });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const publishExamination = async (req, res) => {
  try {
    const examination = await Examination.findOne({
      _id: req.params.id,
      collegeId: req.user.college || req.query.collegeId,
    });
    if (!examination) {
      return res.status(404).json({ success: false, message: "Examination not found" });
    }
    const fromStatus = examination.status;
    examination.status = "published";
    examination.publishedAt = new Date();
    examination.publishedBy = req.user._id || req.user.id;
    examination.updatedBy = req.user._id || req.user.id;
    await examination.save();

    await ApprovalHistory.create({
      collegeId: examination.collegeId,
      examinationId: examination._id,
      action: "published",
      fromStatus,
      toStatus: examination.status,
      comment: req.body.comment || "Published",
      createdBy: req.user._id || req.user.id,
    });

    res.json({ success: true, data: examination });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getApprovalHistory = async (req, res) => {
  try {
    const history = await ApprovalHistory.find({
      examinationId: req.params.id,
      collegeId: req.user.college || req.query.collegeId,
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getScheduleVersions = async (req, res) => {
  try {
    const versions = await ScheduleVersion.find({
      examinationId: req.params.id,
      collegeId: req.user.college || req.query.collegeId,
    }).sort({ versionNumber: -1, createdAt: -1 });

    res.json({ success: true, data: versions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getPublishedExaminations = async (req, res) => {
  try {
    const { examType, semester, courseId } = req.query;
    const query = {
      collegeId: req.user.college || req.query.collegeId,
      status: "published",
    };

    if (examType) query.examType = examType;
    if (semester) query.semester = Number(semester);
    if (courseId) query.course = courseId;

    const exams = await Examination.find({
      ...query,
    })
      .populate("course branch academicSession")
      .sort({ publishedAt: -1 });

    res.json({ success: true, data: exams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getStudentPublishedExaminations = async (req, res) => {
  try {
    const { examType, semester, courseId } = req.query;
    const query = {
      collegeId: req.user.college,
      status: "published",
    };

    if (examType) query.examType = examType;
    if (semester) query.semester = Number(semester);
    if (courseId) query.course = courseId;

    const exams = await Examination.find(query)
      .populate("course branch academicSession")
      .sort({ publishedAt: -1 });

    res.json({ success: true, data: exams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const downloadExaminationPdf = async (req, res) => {
  try {
    const examination = await Examination.findOne({
      _id: req.params.id,
      collegeId: req.user.college || req.query.collegeId,
      status: "published",
    });

    if (!examination) {
      return res.status(404).json({ success: false, message: "Published examination not found" });
    }

    const generated = await generateSchedule({ examination, collegeId: examination.collegeId });
    const option = generated.options?.[0];
    const { format = "full" } = req.query;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${(examination.examName || "datesheet").replace(/[^a-z0-9]+/gi, "_").toLowerCase()}_${format}.pdf"`
    );

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    const courseName = examination.course?.courseName || examination.course?.name || "Course";
    const branchName = examination.branch?.branchName || examination.branch?.name || "Branch";
    const semesterLabel = examination.semester ? `Semester ${examination.semester}` : "Semester";

    doc.fontSize(20).text(examination.examName || "Published Datesheet", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(11).text(`Exam Type: ${examination.examType}`);
    doc.text(`Status: ${examination.status}`);
    doc.text(`Published At: ${examination.publishedAt ? new Date(examination.publishedAt).toLocaleString() : "N/A"}`);
    doc.text(`Available Days: ${generated.summary?.availableDays || 0}`);
    doc.text(`Export Format: ${format}`);
    doc.text(`Course: ${courseName}`);
    doc.text(`Branch: ${branchName}`);
    doc.text(`Semester: ${semesterLabel}`);
    doc.moveDown();

    const scheduleRows = option?.schedule || [];
    const groupedRows =
      format === "course"
        ? [{ label: `${courseName} Schedule`, rows: scheduleRows }]
        : format === "semester"
          ? [{ label: `${semesterLabel} Schedule`, rows: scheduleRows }]
          : scheduleRows.map((row, index) => ({ label: `Slot ${index + 1}`, rows: [row] }));

    groupedRows.forEach((group) => {
      doc.fontSize(14).text(group.label, { underline: true });
      doc.moveDown(0.3);
      group.rows.forEach((slot, index) => {
        doc.fontSize(10).text(
          `${index + 1}. Subject ID: ${slot.subjectId} | Date: ${new Date(slot.date).toLocaleDateString()} | Shift: ${slot.shift} | Difficulty: ${slot.calculatedDifficultyLevel}`
        );
      });
      doc.moveDown(0.4);
    });

    doc.moveDown();
    doc.fontSize(12).text(`Quality Score: ${option?.qualityScore ?? 0}/100`);
    doc.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const compareScheduleOptions = async (req, res) => {
  try {
    const examination = await Examination.findOne({
      _id: req.params.id,
      collegeId: req.user.college || req.query.collegeId,
    });
    if (!examination) {
      return res.status(404).json({ success: false, message: "Examination not found" });
    }
    const generated = await generateSchedule({ examination, collegeId: examination.collegeId });
    const activeSubjects = await Subject.find({ isActive: true }).populate("course branch");
    const conflictMatrix = await buildConflictMatrix(activeSubjects, examination.collegeId);
    res.json({
      success: true,
      data: {
        conflictMatrix,
        suggestions: buildSuggestions(generated.options),
        options: generated.options,
        summary: generated.summary,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const validateGeneratedSchedule = async (req, res) => {
  try {
    const examination = await Examination.findOne({
      _id: req.params.id,
      collegeId: req.user.college || req.query.collegeId,
    });
    if (!examination) {
      return res.status(404).json({ success: false, message: "Examination not found" });
    }

    const availability = calculateAvailableDays({
      startDate: examination.startDate,
      endDate: examination.endDate,
      allowedWeekDays: examination.allowedWeekDays || [1, 2, 3, 4, 5, 6],
      blockedDates: examination.blockedDates || [],
    });
    const generated = await generateSchedule({ examination, collegeId: examination.collegeId });
    const activeSubjects = await Subject.find({ isActive: true }).populate("course branch");
    const conflictMatrix = await buildConflictMatrix(activeSubjects, examination.collegeId);
    const rooms = await Room.find({ collegeId: examination.collegeId, isActive: true });
    const facultySlots = await FacultyAvailability.find({ collegeId: examination.collegeId, isAvailable: false });
    const totalCapacity = rooms.reduce((sum, room) => sum + Number(room.capacity || 0), 0);
    const roomClashes = generated.summary.totalSubjects > rooms.length ? generated.summary.totalSubjects - rooms.length : 0;
    const facultyClashes = facultySlots.length;

    res.json({
      success: true,
      data: {
        valid: availability.actualAvailableDays >= 1,
        hardViolations: [
          ...(availability.actualAvailableDays < 1 ? ["No available exam days"] : []),
          ...(totalCapacity < generated.summary.students ? ["Room capacity exceeded"] : []),
          ...(facultyClashes > 0 ? ["Faculty availability conflict"] : []),
        ],
        warnings: availability.actualAvailableDays < 3 ? ["Very limited exam days available"] : [],
        availability,
        conflictMatrix,
        resourceSummary: {
          rooms: rooms.length,
          totalCapacity,
          roomClashes,
          facultyClashes,
        },
        suggestions:
          availability.actualAvailableDays < 3
            ? [
                "Extend exam period suggestion",
                "Allow Sunday suggestion",
                "Add extra shift suggestion",
                "Reduce preferred gap suggestion",
              ]
            : [],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createExamination,
  getExaminations,
  getAcademicScope,
  getEligibleSubjects,
  updateExamination,
  calculateDifficulty,
  generateExaminationSchedule,
  getScheduleSlots,
  moveScheduleSlot,
  compareScheduleOptions,
  validateGeneratedSchedule,
  submitExaminationForReview,
  requestExaminationChanges,
  approveExamination,
  publishExamination,
  getApprovalHistory,
  getScheduleVersions,
  getPublishedExaminations,
  getStudentPublishedExaminations,
  downloadExaminationPdf,
};
