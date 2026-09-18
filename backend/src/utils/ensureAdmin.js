const User = require('../models/User');

/**
 * ensureAdmin
 * -----------
 * Called once on server startup.
 * Checks whether an admin account exists in the database.
 * If none found, creates one using credentials from environment variables.
 * The password is bcrypt-hashed automatically by the User model pre-save hook
 * (cost factor 12) — the plain-text password is NEVER stored in plain-text.
 */
const ensureAdmin = async () => {
  try {
    const existing = await User.findOne({ role: 'admin' });

    if (existing) {
      console.log('✅ Admin account verified: ' + existing.email);
      return;
    }

    // Read credentials from .env
    const name     = process.env.ADMIN_NAME     || 'Placement Cell Admin';
    const email    = process.env.ADMIN_EMAIL    || 'admin@yuvasetu.edu';
    const mobile   = process.env.ADMIN_MOBILE   || '9000000000';
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
      console.error('❌ ADMIN_PASSWORD is not set in .env. Admin account will NOT be created.');
      console.error('   Add ADMIN_PASSWORD=<your-password> to .env and restart the server.');
      return;
    }

    // Validate password strength
    const strongPwd = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/.test(password);
    if (password.length < 8 || !strongPwd) {
      console.error('❌ ADMIN_PASSWORD is too weak.');
      console.error('   Must be 8+ chars with uppercase, lowercase, digit, and special character.');
      console.error('   Admin account will NOT be created.');
      return;
    }

    // Create admin — bcrypt hashing happens automatically in the User model pre-save hook
    const admin = await User.create({
      name:     name.trim(),
      email:    email.toLowerCase().trim(),
      mobile:   mobile.trim(),
      password, // plain-text here; hashed (bcrypt cost=12) before DB write
      role:     'admin',
    });

    console.log('');
    console.log('🛡️  ── Admin Account Bootstrapped ──────────────────');
    console.log('🛡️  Name   : ' + admin.name);
    console.log('🛡️  Email  : ' + admin.email);
    console.log('🛡️  Role   : admin');
    console.log('🛡️  Password: bcrypt-hashed with cost factor 12');
    console.log('🛡️  ─────────────────────────────────────────────────');
    console.log('');
  } catch (err) {
    if (err.code === 11000) {
      // Admin was just created by a parallel startup — safe to ignore
      console.log('✅ Admin account already exists (concurrent check passed).');
      return;
    }
    console.error('❌ Failed to ensure admin account:', err.message);
  }
};

module.exports = ensureAdmin;
