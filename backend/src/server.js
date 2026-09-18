const { app, ensureInitialized } = require('./app');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await ensureInitialized();

    app.listen(PORT, () => {
      console.log(`🚀 YuvaSetu Backend Server running on http://localhost:${PORT}`);
      console.log(`📁 File storage: MongoDB GridFS (resumes & photos stored in database)`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
