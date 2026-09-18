const express = require('express');
const router = express.Router();
const { checkAdminExists, register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.get('/admin-exists', checkAdminExists);
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
