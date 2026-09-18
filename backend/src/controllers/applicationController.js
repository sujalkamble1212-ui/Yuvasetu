const Application = require('../models/Application');
const PlacementDrive = require('../models/PlacementDrive');
const StudentProfile = require('../models/StudentProfile');

// @route   POST /api/applications/apply/:driveId
// @desc    Apply for a placement drive
// @access  Private (Student)
const applyForDrive = async (req, res, next) => {
  try {
    const { driveId } = req.params;

    const drive = await PlacementDrive.findById(driveId);
    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Placement drive not found.',
      });
    }

    if (drive.driveStatus === 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'This placement drive has already closed.',
      });
    }

    if (new Date(drive.applicationDeadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline for this placement drive has passed.',
      });
    }

    // Check student profile & resume
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile || !profile.resume || !profile.resume.filePath) {
      return res.status(400).json({
        success: false,
        message: 'Please upload your resume in the Resume section before applying.',
      });
    }

    // Check eligibility
    const currentCgpa = profile.currentAcademic?.currentCgpa || 0;
    const backlogs = profile.currentAcademic?.backlogs || 0;

    if (drive.minCgpa > 0 && currentCgpa < drive.minCgpa) {
      return res.status(400).json({
        success: false,
        message: `Ineligible: Drive requires minimum CGPA of ${drive.minCgpa}. Your CGPA is ${currentCgpa}.`,
      });
    }

    if (backlogs > drive.maxBacklogs) {
      return res.status(400).json({
        success: false,
        message: `Ineligible: Drive allows maximum ${drive.maxBacklogs} backlogs. You currently have ${backlogs}.`,
      });
    }

    // Prevent duplicate application
    const existing = await Application.findOne({
      drive: driveId,
      student: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this placement drive.',
      });
    }

    const application = await Application.create({
      drive: driveId,
      student: req.user._id,
      status: 'Applied',
    });

    req.activityAction = 'Placement Application';
    req.activityDetails = { driveId, company: drive.companyName };

    res.status(201).json({
      success: true,
      message: `Successfully applied to ${drive.companyName} for ${drive.jobRole}!`,
      application,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application to this drive.',
      });
    }
    next(err);
  }
};

// @route   GET /api/applications/my
// @desc    Get current student's applications
// @access  Private (Student)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('drive')
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/applications
// @desc    Get all applications (with optional filters: driveId, status)
// @access  Private (Admin)
const getAllApplications = async (req, res, next) => {
  try {
    const { driveId, status } = req.query;
    const query = {};

    if (driveId) query.drive = driveId;
    if (status && status !== 'All') query.status = status;

    const applications = await Application.find(query)
      .populate('drive')
      .populate('student', 'name email mobile')
      .sort({ appliedAt: -1 });

    // Attach student profile snapshot (academics, resume, skills)
    const studentUserIds = applications.map((app) => app.student?._id).filter(Boolean);
    const profiles = await StudentProfile.find({ user: { $in: studentUserIds } });
    const profileMap = new Map();
    profiles.forEach((p) => profileMap.set(p.user.toString(), p));

    const enriched = applications.map((app) => {
      const obj = app.toObject();
      if (app.student && profileMap.has(app.student._id.toString())) {
        obj.studentProfile = profileMap.get(app.student._id.toString());
      }
      return obj;
    });

    res.json({
      success: true,
      count: enriched.length,
      applications: enriched,
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/applications/:id/status
// @desc    Update application status & remarks
// @access  Private (Admin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;

    const validStatuses = ['Applied', 'Shortlisted', 'Selected', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const application = await Application.findById(req.params.id)
      .populate('drive', 'companyName jobRole')
      .populate('student', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    application.status = status;
    if (remarks !== undefined) application.remarks = remarks;
    await application.save();

    req.activityAction = 'Application Status Update';
    req.activityDetails = {
      applicationId: application._id,
      candidate: application.student?.name,
      newStatus: status,
    };

    res.json({
      success: true,
      message: `Candidate status updated to '${status}'.`,
      application,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  applyForDrive,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
};
