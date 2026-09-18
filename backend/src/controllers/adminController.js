const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Education = require('../models/Education');
const PlacementDrive = require('../models/PlacementDrive');
const Application = require('../models/Application');

// @route   GET /api/admin/stats
// @desc    Get aggregated overview statistics for admin dashboard
// @access  Private (Admin)
const getAdminStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalDrives = await PlacementDrive.countDocuments();
    const activeDrives = await PlacementDrive.countDocuments({ driveStatus: 'Active' });
    const totalApplications = await Application.countDocuments();
    const shortlistedCount = await Application.countDocuments({ status: 'Shortlisted' });
    const selectedCount = await Application.countDocuments({ status: 'Selected' });

    // Recent applications
    const recentApplications = await Application.find()
      .populate('drive', 'companyName jobRole')
      .populate('student', 'name email')
      .sort({ appliedAt: -1 })
      .limit(5);

    // Upcoming drives
    const upcomingDrives = await PlacementDrive.find({ driveStatus: { $ne: 'Closed' } })
      .sort({ driveDate: 1 })
      .limit(4);

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalDrives,
        activeDrives,
        totalApplications,
        shortlistedCount,
        selectedCount,
      },
      recentApplications,
      upcomingDrives,
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/admin/students
// @desc    Get all registered students with full profiles, education, and resume status
// @access  Private (Admin)
const getStudentsList = async (req, res, next) => {
  try {
    const { search, course, skill } = req.query;

    const userQuery = { role: 'student' };
    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await User.find(userQuery).select('-password').sort({ createdAt: -1 });
    const studentIds = students.map((s) => s._id);

    const profiles = await StudentProfile.find({ user: { $in: studentIds } });
    const educations = await Education.find({ user: { $in: studentIds } });

    const profileMap = new Map();
    profiles.forEach((p) => profileMap.set(p.user.toString(), p));

    const educationMap = new Map();
    educations.forEach((e) => educationMap.set(e.user.toString(), e));

    let enrichedStudents = students.map((student) => {
      const studentObj = student.toObject();
      studentObj.profile = profileMap.get(student._id.toString()) || null;
      studentObj.education = educationMap.get(student._id.toString()) || null;
      return studentObj;
    });

    // Optional filters on profile attributes
    if (course) {
      enrichedStudents = enrichedStudents.filter(
        (s) =>
          s.profile?.currentAcademic?.course &&
          s.profile.currentAcademic.course.toLowerCase().includes(course.toLowerCase())
      );
    }

    if (skill) {
      enrichedStudents = enrichedStudents.filter(
        (s) =>
          s.profile?.skills &&
          s.profile.skills.some((sk) => sk.toLowerCase().includes(skill.toLowerCase()))
      );
    }

    res.json({
      success: true,
      count: enrichedStudents.length,
      students: enrichedStudents,
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/admin/students/:id
// @desc    Get full details for a single student
// @access  Private (Admin)
const getStudentDetail = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.',
      });
    }

    const profile = await StudentProfile.findOne({ user: student._id });
    const education = await Education.findOne({ user: student._id });
    const applications = await Application.find({ student: student._id })
      .populate('drive')
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      student,
      profile,
      education,
      applications,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdminStats,
  getStudentsList,
  getStudentDetail,
};
