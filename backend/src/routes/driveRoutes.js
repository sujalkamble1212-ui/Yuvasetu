const express = require('express');
const router = express.Router();
const {
  getDrives,
  getDriveById,
  createDrive,
  updateDrive,
  deleteDrive,
} = require('../controllers/driveController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getDrives);
router.get('/:id', getDriveById);

// Admin-only management
router.post('/', authorize('admin'), createDrive);
router.put('/:id', authorize('admin'), updateDrive);
router.delete('/:id', authorize('admin'), deleteDrive);

module.exports = router;
