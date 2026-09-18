const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

dotenv.config({ path: path.join(__dirname, '../.env') });

const { connectDB } = require('./config/db');
const activityLogger = require('./middleware/activityLogger');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const driveRoutes = require('./routes/driveRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const logRoutes = require('./routes/logRoutes');
const { fileRouter, serveGridFSFile } = require('./routes/fileRoutes');

// Startup helpers
const ensureAdmin = require('./utils/ensureAdmin');

const app = express();

// ── Security: HTTP headers ────────────────────────────────────────────────────
app.use(helmet());

// ── CORS: dynamically allow local dev, Vercel deployments, & configured origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
];

const isOriginAllowed = (origin) => {
  if (!origin) return true; // requests without Origin header (Postman, curl, same-domain)
  if (allowedOrigins.includes(origin)) return true;

  if (process.env.CLIENT_URL) {
    const clientUrl = process.env.CLIENT_URL.trim().replace(/\/+$/, '');
    if (origin === clientUrl) return true;
  }

  if (process.env.CORS_ORIGIN) {
    const list = process.env.CORS_ORIGIN.split(',').map((o) => o.trim().replace(/\/+$/, ''));
    if (list.includes('*') || list.includes(origin)) return true;
  }

  // Allow Vercel preview & production deployments
  if (/^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(origin)) {
    return true;
  }

  return false;
};

app.use(cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));

// ── Body parsing (limit body size to prevent DoS via huge payloads) ───────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── NoSQL injection protection ────────────────────────────────────────────────
app.use(mongoSanitize());

// ── XSS protection ────────────────────────────────────────────────────────────
app.use(xss());

// ── HTTP Parameter Pollution prevention ───────────────────────────────────────
app.use(hpp());

// ── Global rate limiter ───────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api', globalLimiter);

// ── Auth-specific rate limiter ────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
  skipSuccessfulRequests: true,
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.use(morgan('dev'));
}

// ── Lazy Database & Admin Initializer for Serverless Invocations ──────────────
let initPromise = null;
const ensureInitialized = () => {
  if (!initPromise) {
    initPromise = (async () => {
      await connectDB();
      await ensureAdmin();
    })().catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
};

app.use(async (req, res, next) => {
  try {
    await ensureInitialized();
    next();
  } catch (err) {
    next(err);
  }
});

// ── File Serving (GridFS + Static Fallback) ───────────────────────────────────
app.use('/api/files', fileRouter);

app.use('/uploads/:folder?/:filename?', async (req, res, next) => {
  const target = req.params.filename || req.params.folder;
  if (target) {
    try {
      const { getFileFromGridFS } = require('./utils/gridfs');
      const found = await getFileFromGridFS(target);
      if (found) {
        return serveGridFSFile(req, res, target);
      }
    } catch (e) {
      // pass to next
    }
  }
  next();
});
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Activity Logging Middleware ───────────────────────────────────────────────
app.use(activityLogger);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'YuvaSetu - Student Placement Portal',
    tagline: 'Connecting Students to Careers',
    environment: process.env.VERCEL ? 'vercel-serverless' : (process.env.NODE_ENV || 'development'),
    time: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/logs', logRoutes);

// ── Error Handling Middleware ─────────────────────────────────────────────────
app.use(errorHandler);

module.exports = { app, ensureInitialized };
