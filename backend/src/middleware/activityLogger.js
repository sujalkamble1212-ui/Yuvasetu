const ActivityLog = require('../models/ActivityLog');

/**
 * Maps HTTP method and URL endpoint to an identifiable activity action
 */
const getActionFromRequest = (req) => {
  if (req.activityAction) return req.activityAction;

  const method = req.method;
  const path = req.originalUrl || req.url;

  if (path.includes('/auth/register') && method === 'POST') return 'User Registration';
  if (path.includes('/auth/login') && method === 'POST') return 'Login';
  if (path.includes('/auth/logout') && method === 'POST') return 'Logout';

  if (path.includes('/student/profile/photo') && method === 'POST') return 'Profile Photo Upload';
  if (path.includes('/student/profile') && (method === 'PUT' || method === 'PATCH')) return 'Profile Update';
  if (path.includes('/student/education') && (method === 'PUT' || method === 'POST')) return 'Education Update';
  if (path.includes('/student/academics') && (method === 'PUT' || method === 'POST')) return 'Current Academic Update';
  if (path.includes('/student/skills') && (method === 'PUT' || method === 'POST')) return 'Skills Update';
  if (path.includes('/student/resume') && method === 'POST') return 'Resume Upload';
  if (path.includes('/student/resume') && method === 'DELETE') return 'Resume Deletion';

  if (path.includes('/drives') && method === 'POST') return 'Placement Drive Creation';
  if (path.includes('/drives') && (method === 'PUT' || method === 'PATCH')) return 'Placement Drive Update';
  if (path.includes('/drives') && method === 'DELETE') return 'Placement Drive Deletion';

  if (path.includes('/applications/apply') && method === 'POST') return 'Placement Application';
  if (path.includes('/applications') && (method === 'PUT' || method === 'PATCH')) return 'Application Status Update';

  // Generic fallback if important route
  if (method !== 'GET' && method !== 'OPTIONS') {
    return `${method} ${path}`;
  }

  return null; // Don't spam database with every passive GET request unless desired
};

const activityLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', async () => {
    try {
      const action = getActionFromRequest(req);
      // Only log designated state-modifying actions or explicit actions
      if (!action && !req.forceLog) return;

      const responseTime = Date.now() - startTime;
      const ipAddress =
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        req.ip ||
        '127.0.0.1';

      const user = req.user ? req.user._id : null;
      const userEmail = req.user
        ? req.user.email
        : req.body?.email || 'Guest/Anonymous';
      const userRole = req.user ? req.user.role : 'Guest';

      await ActivityLog.create({
        user,
        userEmail,
        userRole,
        action: action || `${req.method} ${req.originalUrl}`,
        httpMethod: req.method,
        endpoint: req.originalUrl || req.url,
        statusCode: res.statusCode,
        ipAddress: typeof ipAddress === 'string' ? ipAddress.replace('::ffff:', '') : '127.0.0.1',
        responseTime,
        details: req.activityDetails || {},
        timestamp: new Date(),
      });
    } catch (err) {
      console.error('Activity logging failed silently:', err.message);
    }
  });

  next();
};

module.exports = activityLogger;
