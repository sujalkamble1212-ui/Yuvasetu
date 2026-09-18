const express = require('express');
const router = express.Router();
const { getActivityLogs, clearActivityLogs } = require('../controllers/logController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.get('/', getActivityLogs);
router.delete('/clear', clearActivityLogs);

module.exports = router;
