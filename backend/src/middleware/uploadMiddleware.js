const multer = require('multer');

// In-memory storage for streaming directly into MongoDB GridFS
const memoryStorage = multer.memoryStorage();

// Profile Photo Filter & Multer Config
const photoFileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image file. Only JPEG, JPG, PNG, and WEBP formats are allowed.'), false);
  }
};

const uploadPhoto = multer({
  storage: memoryStorage,
  fileFilter: photoFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// Resume Filter & Multer Config
const resumeFileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid resume file. Only PDF, DOC, and DOCX documents are allowed.'), false);
  }
};

const uploadResume = multer({
  storage: memoryStorage,
  fileFilter: resumeFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = {
  uploadPhoto,
  uploadResume,
};
