const mongoose = require('mongoose');

let mongod = null;
let cachedPromise = null;

const connectDB = async () => {
  // If already connected, reuse active connection (essential for Vercel serverless)
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/yuvasetu';

  cachedPromise = (async () => {
    try {
      // Connect with 10s timeout for cloud/Atlas and local connections
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        bufferCommands: false, // avoid hanging if disconnected
      });
      console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (localErr) {
      console.warn(`⚠️ Could not connect to primary MongoDB at ${uri.replace(/:([^:@]{4,})@/, ':****@')}: ${localErr.message}`);

      // In production or Vercel serverless environment, do not attempt to start mongodb-memory-server
      if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        throw new Error(
          `Production MongoDB connection failed. Please ensure MONGODB_URI is correctly configured in your environment variables. Details: ${localErr.message}`
        );
      }

      console.log('🔄 Launching local embedded MongoDB instance via mongodb-memory-server...');

      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create({
          instance: {
            dbName: 'yuvasetu',
            port: 27017, // try default port if free
          },
        });
        const memoryUri = mongod.getUri();
        const conn = await mongoose.connect(memoryUri);
        console.log(`✅ Embedded MongoDB Started & Connected: ${memoryUri}`);
        return conn;
      } catch (memErr) {
        // If port 27017 was in use or failed, create with random port
        try {
          const { MongoMemoryServer } = require('mongodb-memory-server');
          mongod = await MongoMemoryServer.create();
          const fallbackUri = mongod.getUri();
          const conn = await mongoose.connect(fallbackUri);
          console.log(`✅ Embedded MongoDB Started & Connected on fallback: ${fallbackUri}`);
          return conn;
        } catch (finalErr) {
          console.error('❌ Failed to establish MongoDB connection:', finalErr.message);
          throw finalErr;
        }
      }
    }
  })();

  try {
    const result = await cachedPromise;
    return result;
  } catch (err) {
    cachedPromise = null;
    throw err;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  cachedPromise = null;
  if (mongod) {
    await mongod.stop();
  }
};

module.exports = { connectDB, disconnectDB };
