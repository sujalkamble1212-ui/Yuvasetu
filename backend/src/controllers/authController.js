const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Education = require('../models/Education');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'yuvasetu_super_secret_jwt_key_2026_placement_portal',
    { expiresIn: '7d' }
  );
};

// @route   GET /api/auth/admin-exists
// @desc    Check whether an admin account already exists
// @access  Public
const checkAdminExists = async (req, res, next) => {
  try {
    const adminUser = await User.findOne({ role: 'admin' }).select('_id');
    res.json({ success: true, adminExists: !!adminUser });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/auth/register
// @desc    Register a new student or admin
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    // ── Type guards: block NoSQL injection via object payloads ───────────
    if (
      typeof name     !== 'string' ||
      typeof email    !== 'string' ||
      typeof mobile   !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({ success: false, message: 'Invalid input types.' });
    }

    if (!name.trim() || !email.trim() || !mobile.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, mobile number, and password.',
      });
    }

    // ── Email format ──────────────────────────────────────────────────────
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    // ── Mobile: exactly 10 digits ─────────────────────────────────────────
    if (!/^\d{10}$/.test(mobile.trim())) {
      return res.status(400).json({ success: false, message: 'Mobile number must be exactly 10 digits.' });
    }

    // ── Strong password policy ────────────────────────────────────────────
    // min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special char
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must include uppercase, lowercase, a number, and a special character.',
      });
    }

    // ── Only ONE admin account allowed ────────────────────────────────────
    const assignedRole = role === 'admin' ? 'admin' : 'student';
    if (assignedRole === 'admin') {
      const existingAdmin = await User.findOne({ role: 'admin' });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'An admin account already exists. Only one admin is allowed.',
        });
      }
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      password,
      role: assignedRole,
    });

    // If student, create linked blank StudentProfile and Education record
    if (assignedRole === 'student') {
      await StudentProfile.create({
        user: user._id,
        fullName: user.name,
        email: user.email,
        mobile: user.mobile,
      });

      await Education.create({
        user: user._id,
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to YuvaSetu.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & return JWT token
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // ── Type guards: block NoSQL injection via object payloads ───────────
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid input types.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact administrator.',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/auth/me
// @desc    Get currently logged in user info
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let profile = null;
    let education = null;

    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ user: user._id });
      education = await Education.findOne({ user: user._id });
    }

    res.json({
      success: true,
      user,
      profile,
      education,
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/auth/logout
// @desc    Logout user (client destroys token, server logs activity)
// @access  Private
const logout = async (req, res, next) => {
  try {
    req.activityAction = 'Logout';
    res.json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkAdminExists,
  register,
  login,
  getMe,
  logout,
};
