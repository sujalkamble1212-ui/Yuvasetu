const PlacementDrive = require('../models/PlacementDrive');
const Application = require('../models/Application');
const StudentProfile = require('../models/StudentProfile');

// @route   GET /api/drives
// @desc    Get list of placement drives (filterable)
// @access  Private (Student & Admin)
const getDrives = async (req, res, next) => {
  try {
    const { status, search, role } = req.query;
    const query = {};

    // For students, default to active and upcoming drives if not specified
    if (req.user.role === 'student' && !status) {
      query.driveStatus = { $in: ['Active', 'Upcoming'] };
    } else if (status && status !== 'All') {
      query.driveStatus = status;
    }

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { jobRole: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } },
      ];
    }

    const drives = await PlacementDrive.find(query).sort({ driveDate: 1 });

    // If request is from student, enrich each drive with applied status & eligibility check
    if (req.user.role === 'student') {
      const studentProfile = await StudentProfile.findOne({ user: req.user._id });
      const studentApplications = await Application.find({ student: req.user._id });
      const appliedDriveIds = new Set(
        studentApplications.map((app) => app.drive.toString())
      );

      const enrichedDrives = drives.map((drive) => {
        const driveObj = drive.toObject();
        driveObj.isApplied = appliedDriveIds.has(drive._id.toString());

        const currentCgpa = studentProfile?.currentAcademic?.currentCgpa || 0;
        const backlogs = studentProfile?.currentAcademic?.backlogs || 0;

        let isEligible = true;
        const reasons = [];

        if (drive.minCgpa > 0 && currentCgpa < drive.minCgpa) {
          isEligible = false;
          reasons.push(`Minimum CGPA required: ${drive.minCgpa} (Your CGPA: ${currentCgpa})`);
        }

        if (backlogs > drive.maxBacklogs) {
          isEligible = false;
          reasons.push(
            `Maximum allowed backlogs: ${drive.maxBacklogs} (You have: ${backlogs})`
          );
        }

        // Check deadline
        const isExpired = new Date(drive.applicationDeadline) < new Date();
        if (isExpired) {
          driveObj.isDeadlinePassed = true;
        }

        driveObj.isEligible = isEligible;
        driveObj.ineligibilityReasons = reasons;

        return driveObj;
      });

      return res.json({
        success: true,
        count: enrichedDrives.length,
        drives: enrichedDrives,
      });
    }

    // Admin view
    res.json({
      success: true,
      count: drives.length,
      drives,
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/drives/:id
// @desc    Get single drive details
// @access  Private
const getDriveById = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Placement drive not found.',
      });
    }

    const driveObj = drive.toObject();

    if (req.user.role === 'student') {
      const studentProfile = await StudentProfile.findOne({ user: req.user._id });
      const existingApplication = await Application.findOne({
        drive: drive._id,
        student: req.user._id,
      });

      driveObj.isApplied = !!existingApplication;
      driveObj.application = existingApplication;

      const currentCgpa = studentProfile?.currentAcademic?.currentCgpa || 0;
      const backlogs = studentProfile?.currentAcademic?.backlogs || 0;

      let isEligible = true;
      const reasons = [];

      if (drive.minCgpa > 0 && currentCgpa < drive.minCgpa) {
        isEligible = false;
        reasons.push(`Minimum CGPA required: ${drive.minCgpa} (Your CGPA: ${currentCgpa})`);
      }

      if (backlogs > drive.maxBacklogs) {
        isEligible = false;
        reasons.push(`Maximum allowed backlogs: ${drive.maxBacklogs} (You have: ${backlogs})`);
      }

      driveObj.isEligible = isEligible;
      driveObj.ineligibilityReasons = reasons;
      driveObj.hasResume = !!studentProfile?.resume?.filePath;
    } else {
      // Admin: count total applicants
      const applicantCount = await Application.countDocuments({ drive: drive._id });
      driveObj.applicantCount = applicantCount;
    }

    res.json({
      success: true,
      drive: driveObj,
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/drives
// @desc    Create a new placement drive
// @access  Private (Admin only)
const createDrive = async (req, res, next) => {
  try {
    const {
      companyName,
      companyLogo,
      jobRole,
      jobDescription,
      requiredSkills,
      eligibilityCriteria,
      minCgpa,
      minPercentage,
      maxBacklogs,
      salaryPackage,
      location,
      driveDate,
      applicationDeadline,
      driveStatus,
    } = req.body;

    if (
      !companyName ||
      !jobRole ||
      !jobDescription ||
      !salaryPackage ||
      !location ||
      !driveDate ||
      !applicationDeadline
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required drive fields.',
      });
    }

    const drive = await PlacementDrive.create({
      companyName: companyName.trim(),
      companyLogo: companyLogo || '',
      jobRole: jobRole.trim(),
      jobDescription,
      requiredSkills: Array.isArray(requiredSkills)
        ? requiredSkills
        : (requiredSkills || '').split(',').map((s) => s.trim()).filter(Boolean),
      eligibilityCriteria: eligibilityCriteria || '',
      minCgpa: minCgpa !== undefined ? Number(minCgpa) : 0,
      minPercentage: minPercentage !== undefined ? Number(minPercentage) : 0,
      maxBacklogs: maxBacklogs !== undefined ? Number(maxBacklogs) : 0,
      salaryPackage: salaryPackage.trim(),
      location: location.trim(),
      driveDate: new Date(driveDate),
      applicationDeadline: new Date(applicationDeadline),
      driveStatus: driveStatus || 'Active',
      createdBy: req.user._id,
    });

    req.activityAction = 'Placement Drive Creation';
    req.activityDetails = { driveId: drive._id, company: drive.companyName };

    res.status(201).json({
      success: true,
      message: 'Placement drive created successfully.',
      drive,
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/drives/:id
// @desc    Update placement drive
// @access  Private (Admin only)
const updateDrive = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Placement drive not found.',
      });
    }

    const updates = req.body;
    if (updates.requiredSkills && typeof updates.requiredSkills === 'string') {
      updates.requiredSkills = updates.requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    Object.assign(drive, updates);
    await drive.save();

    req.activityAction = 'Placement Drive Update';
    req.activityDetails = { driveId: drive._id, company: drive.companyName };

    res.json({
      success: true,
      message: 'Placement drive updated successfully.',
      drive,
    });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/drives/:id
// @desc    Delete placement drive
// @access  Private (Admin only)
const deleteDrive = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Placement drive not found.',
      });
    }

    // Cascade delete applications for this drive
    await Application.deleteMany({ drive: drive._id });
    await drive.deleteOne();

    req.activityAction = 'Placement Drive Deletion';
    req.activityDetails = { driveId: req.params.id, company: drive.companyName };

    res.json({
      success: true,
      message: 'Placement drive and associated applications deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDrives,
  getDriveById,
  createDrive,
  updateDrive,
  deleteDrive,
};
