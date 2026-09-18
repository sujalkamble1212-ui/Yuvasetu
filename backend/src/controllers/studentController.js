const path = require('path');
const fs = require('fs');
const StudentProfile = require('../models/StudentProfile');
const Education = require('../models/Education');
const User = require('../models/User');
const { uploadToGridFS, deleteFromGridFS } = require('../utils/gridfs');

// Helper to get or create student profile
const getOrCreateProfile = async (userId) => {
  let profile = await StudentProfile.findOne({ user: userId });
  if (!profile) {
    const user = await User.findById(userId);
    profile = await StudentProfile.create({
      user: userId,
      fullName: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  }
  return profile;
};

// @route   GET /api/student/profile
// @desc    Get current student's full profile
// @access  Private (Student)
const getProfile = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    const education = await Education.findOne({ user: req.user._id });

    res.json({
      success: true,
      profile,
      education,
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/student/profile
// @desc    Update student personal info
// @access  Private (Student)
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, mobile, dob, gender, address } = req.body;

    const profile = await getOrCreateProfile(req.user._id);

    if (fullName) {
      profile.fullName = fullName.trim();
      await User.findByIdAndUpdate(req.user._id, { name: fullName.trim() });
    }
    if (mobile) {
      profile.mobile = mobile.trim();
      await User.findByIdAndUpdate(req.user._id, { mobile: mobile.trim() });
    }
    if (dob !== undefined) profile.dob = dob ? new Date(dob) : null;
    if (gender !== undefined) profile.gender = gender;
    if (address !== undefined) profile.address = address;

    await profile.save();

    req.activityAction = 'Profile Update';

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      profile,
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/student/profile/photo
// @desc    Upload student profile photo
// @access  Private (Student)
const uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file.',
      });
    }

    const profile = await getOrCreateProfile(req.user._id);

    // Delete existing old photo from MongoDB GridFS if exists
    if (profile.profilePhotoId) {
      await deleteFromGridFS(profile.profilePhotoId);
    }

    // Upload photo buffer directly to MongoDB GridFS
    const gridFile = await uploadToGridFS(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      { userId: req.user._id, category: 'profile-photo' }
    );

    // Store endpoint path in db: e.g. "api/files/{fileId}/{filename}"
    const relativePath = `api/files/${gridFile.fileId}/${encodeURIComponent(req.file.originalname)}`;
    profile.profilePhoto = relativePath;
    profile.profilePhotoId = gridFile.fileId;
    await profile.save();

    req.activityAction = 'Profile Photo Upload';

    res.json({
      success: true,
      message: 'Profile photo uploaded to MongoDB successfully.',
      profilePhoto: relativePath,
      profile,
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/student/education
// @desc    Get student education history
// @access  Private (Student)
const getEducation = async (req, res, next) => {
  try {
    let education = await Education.findOne({ user: req.user._id });
    if (!education) {
      education = await Education.create({ user: req.user._id });
    }

    res.json({
      success: true,
      education,
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/student/education
// @desc    Update education details (10th, 12th, Diploma, Graduation, Post-Graduation)
// @access  Private (Student)
const updateEducation = async (req, res, next) => {
  try {
    const { tenth, twelfth, diploma, graduation, postGraduation } = req.body;

    let education = await Education.findOne({ user: req.user._id });
    if (!education) {
      education = new Education({ user: req.user._id });
    }

    if (tenth) education.tenth = { ...education.tenth.toObject(), ...tenth };
    if (twelfth) education.twelfth = { ...education.twelfth.toObject(), ...twelfth };
    if (diploma) education.diploma = { ...education.diploma.toObject(), ...diploma };
    if (graduation) education.graduation = { ...education.graduation.toObject(), ...graduation };
    if (postGraduation) education.postGraduation = { ...education.postGraduation.toObject(), ...postGraduation };

    await education.save();

    req.activityAction = 'Education Update';

    res.json({
      success: true,
      message: 'Education details updated successfully.',
      education,
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/student/academics
// @desc    Update current academic details
// @access  Private (Student)
const updateCurrentAcademic = async (req, res, next) => {
  try {
    const academicData = req.body;

    const profile = await getOrCreateProfile(req.user._id);

    profile.currentAcademic = {
      course: academicData.course || '',
      college: academicData.college || '',
      university: academicData.university || '',
      currentYear: academicData.currentYear || '',
      currentSemester: academicData.currentSemester || '',
      division: academicData.division || '',
      batch: academicData.batch || '',
      specialization: academicData.specialization || '',
      currentCgpa: Number(academicData.currentCgpa) || 0,
      backlogs: Number(academicData.backlogs) || 0,
      expectedGraduationYear: academicData.expectedGraduationYear ? Number(academicData.expectedGraduationYear) : null,
    };

    await profile.save();

    req.activityAction = 'Current Academic Update';

    res.json({
      success: true,
      message: 'Current academic details updated successfully.',
      currentAcademic: profile.currentAcademic,
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/student/skills
// @desc    Update skills list
// @access  Private (Student)
const updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: 'Skills must be an array of strings.',
      });
    }

    const cleanSkills = skills
      .map((s) => (typeof s === 'string' ? s.trim() : ''))
      .filter((s) => s.length > 0);

    const profile = await getOrCreateProfile(req.user._id);
    profile.skills = [...new Set(cleanSkills)]; // remove duplicates
    await profile.save();

    req.activityAction = 'Skills Update';

    res.json({
      success: true,
      message: 'Skills updated successfully.',
      skills: profile.skills,
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/student/resume
// @desc    Upload student resume directly to MongoDB GridFS
// @access  Private (Student)
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume file (PDF, DOC, DOCX).',
      });
    }

    const profile = await getOrCreateProfile(req.user._id);

    // Delete existing old resume from MongoDB GridFS if present
    if (profile.resume && profile.resume.fileId) {
      await deleteFromGridFS(profile.resume.fileId);
    }

    // Upload resume buffer directly into MongoDB GridFS
    const gridFile = await uploadToGridFS(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      { userId: req.user._id, category: 'resume' }
    );

    // Endpoint URL path: "api/files/{fileId}/{filename}"
    const relativePath = `api/files/${gridFile.fileId}/${encodeURIComponent(req.file.originalname)}`;

    profile.resume = {
      fileId: gridFile.fileId,
      filePath: relativePath,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      contentType: req.file.mimetype,
      uploadedAt: new Date(),
    };

    await profile.save();

    req.activityAction = 'Resume Upload';

    res.json({
      success: true,
      message: 'Resume uploaded to MongoDB successfully.',
      resume: profile.resume,
    });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/student/resume
// @desc    Delete student resume from MongoDB GridFS
// @access  Private (Student)
const deleteResume = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);

    // Delete file from MongoDB GridFS
    if (profile.resume && profile.resume.fileId) {
      await deleteFromGridFS(profile.resume.fileId);
    }

    profile.resume = {
      fileId: null,
      filePath: '',
      originalName: '',
      fileSize: 0,
      contentType: '',
      uploadedAt: null,
    };

    await profile.save();

    req.activityAction = 'Resume Deletion';

    res.json({
      success: true,
      message: 'Resume deleted successfully from MongoDB.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  getEducation,
  updateEducation,
  updateCurrentAcademic,
  updateSkills,
  uploadResume,
  deleteResume,
};
