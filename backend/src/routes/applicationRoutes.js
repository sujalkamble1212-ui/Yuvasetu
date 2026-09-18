const express = require('express');
const router = express.Router();
const {
  applyForDrive,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Student routes
router.post('/apply/:driveId', authorize('student'), applyForDrive);
router.get('/my', authorize('student'), getMyApplications);

// Admin routes
router.get('/', authorize('admin'), getAllApplications);
router.put('/:id/status', authorize('admin'), updateApplicationStatus);

module.exports = router;
