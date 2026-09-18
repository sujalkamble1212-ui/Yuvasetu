const ActivityLog = require('../models/ActivityLog');

// @route   GET /api/logs
// @desc    Get system activity logs with comprehensive filtering
// @access  Private (Admin only)
const getActivityLogs = async (req, res, next) => {
  try {
    const {
      user,
      action,
      method,
      statusCode,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = req.query;

    const query = {};

    // Filter by user email or role
    if (user) {
      query.$or = [
        { userEmail: { $regex: user, $options: 'i' } },
        { userRole: { $regex: user, $options: 'i' } },
      ];
    }

    // Filter by action
    if (action && action !== 'All') {
      query.action = { $regex: action, $options: 'i' };
    }

    // Filter by HTTP method
    if (method && method !== 'All') {
      query.httpMethod = method.toUpperCase();
    }

    // Filter by status code
    if (statusCode && statusCode !== 'All') {
      query.statusCode = Number(statusCode);
    }

    // Filter by date range
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.timestamp.$lte = end;
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const total = await ActivityLog.countDocuments(query);
    const logs = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email role');

    // Distinct actions for filter dropdown
    const distinctActions = await ActivityLog.distinct('action');

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      logs,
      availableActions: distinctActions,
    });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/logs/clear
// @desc    Clear older activity logs
// @access  Private (Admin only)
const clearActivityLogs = async (req, res, next) => {
  try {
    await ActivityLog.deleteMany({});
    res.json({
      success: true,
      message: 'Activity audit logs cleared successfully.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getActivityLogs,
  clearActivityLogs,
};
