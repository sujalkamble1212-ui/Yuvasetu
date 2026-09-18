const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  getEducation,
  updateEducation,
  updateCurrentAcademic,
  updateSkills,
  uploadResume,
  deleteResume,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadPhoto, uploadResume: uploadResumeMiddleware } = require('../middleware/uploadMiddleware');

// All student routes are protected and student-only
router.use(protect, authorize('student'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/profile/photo', uploadPhoto.single('photo'), uploadProfilePhoto);

router.get('/education', getEducation);
router.put('/education', updateEducation);

router.put('/academics', updateCurrentAcademic);
router.put('/skills', updateSkills);

router.post('/resume', uploadResumeMiddleware.single('resume'), uploadResume);
router.delete('/resume', deleteResume);

module.exports = router;
