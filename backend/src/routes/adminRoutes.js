const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getStudentsList,
  getStudentDetail,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/students', getStudentsList);
router.get('/students/:id', getStudentDetail);

module.exports = router;
