const mongoose = require('mongoose');

let gridFSBucket = null;

/**
 * Returns the active GridFSBucket instance, creating it if needed.
 */
const getBucket = () => {
  if (!gridFSBucket) {
    if (!mongoose.connection.db) {
      throw new Error('MongoDB connection is not established yet.');
    }
    gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });
  }
  return gridFSBucket;
};

/**
 * Upload a file Buffer directly into MongoDB GridFS.
 *
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {string} originalName - Original filename
 * @param {string} mimeType - File MIME type (e.g. 'application/pdf', 'image/png')
 * @param {object} metadata - Extra metadata (userId, category, etc.)
 * @returns {Promise<{ fileId: string, filename: string, length: number }>}
 */
const uploadToGridFS = (buffer, originalName, mimeType, metadata = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const bucket = getBucket();
      const ext = originalName.includes('.') ? originalName.split('.').pop() : '';
      const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext ? '.' + ext : ''}`;

      const uploadStream = bucket.openUploadStream(uniqueFilename, {
        contentType: mimeType,
        metadata: {
          originalName,
          mimeType,
          ...metadata,
          uploadedAt: new Date(),
        },
      });

      uploadStream.on('error', (err) => {
        reject(err);
      });

      uploadStream.on('finish', () => {
        resolve({
          fileId: uploadStream.id.toString(),
          filename: uniqueFilename,
          length: buffer.length,
          contentType: mimeType,
        });
      });

      uploadStream.end(buffer);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Get file metadata and download stream from MongoDB GridFS.
 * Accepts either an ObjectId string or a filename.
 *
 * @param {string} idOrFilename - ObjectId string or filename
 * @returns {Promise<{ file: object, stream: ReadableStream }>}
 */
const getFileFromGridFS = async (idOrFilename) => {
  const bucket = getBucket();

  let file = null;
  let objectId = null;

  // Check if identifier is a valid 24-char hex ObjectId
  if (mongoose.Types.ObjectId.isValid(idOrFilename) && String(new mongoose.Types.ObjectId(idOrFilename)) === idOrFilename) {
    objectId = new mongoose.Types.ObjectId(idOrFilename);
    const files = await bucket.find({ _id: objectId }).toArray();
    if (files.length > 0) file = files[0];
  }

  // If not found by ObjectId, search by filename
  if (!file) {
    const files = await bucket.find({ filename: idOrFilename }).toArray();
    if (files.length > 0) file = files[0];
  }

  if (!file) {
    return null;
  }

  const stream = bucket.openDownloadStream(file._id);
  return { file, stream };
};

/**
 * Delete a file from MongoDB GridFS by its ObjectId.
 *
 * @param {string|mongoose.Types.ObjectId} fileId
 */
const deleteFromGridFS = async (fileId) => {
  if (!fileId) return;
  try {
    const bucket = getBucket();
    const objectId = typeof fileId === 'string' ? new mongoose.Types.ObjectId(fileId) : fileId;
    await bucket.delete(objectId);
  } catch (err) {
    // If already deleted or not found, silently ignore
    console.warn(`GridFS delete warning for ${fileId}:`, err.message);
  }
};

module.exports = {
  getBucket,
  uploadToGridFS,
  getFileFromGridFS,
  deleteFromGridFS,
};
