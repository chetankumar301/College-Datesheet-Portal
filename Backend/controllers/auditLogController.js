const AuditLog = require("../models/AuditLog");

// Get all audit logs (Super Admin and Sub Super Admin)
const getAllAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, college, startDate, endDate, search, role } = req.query;
    
    const query = {};
    if (action) query.action = action;
    if (college) query.college = college;
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: "i" } },
        { action: { $regex: search, $options: "i" } },
        { ipAddress: { $regex: search, $options: "i" } },
      ];
    }
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // If sub super admin, only show logs for their college
    if (req.user.role === "sub_super_admin" && req.user.college) {
      query.college = req.user.college;
    }

    let logs = await AuditLog.find(query)
      .populate("user", "name email role")
      .populate("admin", "name email username role")
      .populate("college", "name code")
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (role) {
      logs = logs.filter((log) => (log.admin?.role || log.user?.role || "").toLowerCase() === role.toLowerCase());
    }

    const total = role ? logs.length : await AuditLog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get audit logs for a specific entity
const getAuditLogsByEntity = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const query = { entityType, entityId };

    const logs = await AuditLog.find(query)
      .populate("user", "name email")
      .populate("admin", "name email")
      .populate("college", "name code")
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await AuditLog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get audit logs for a specific user
const getAuditLogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const logs = await AuditLog.find({ user: userId })
      .populate("user", "name email")
      .populate("admin", "name email")
      .populate("college", "name code")
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await AuditLog.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Create audit log (helper function, not exposed as route)
const createAuditLog = async (logData) => {
  try {
    const log = await AuditLog.create(logData);
    return log;
  } catch (err) {
    console.error("Error creating audit log:", err);
  }
};

module.exports = {
  getAllAuditLogs,
  getAuditLogsByEntity,
  getAuditLogsByUser,
  createAuditLog,
};
