const mongoose = require('mongoose');

const currentAcademicSchema = new mongoose.Schema(
  {
    course: { type: String, default: '' },
    college: { type: String, default: '' },
    university: { type: String, default: '' },
    currentYear: { type: String, default: '' },
    currentSemester: { type: String, default: '' },
    division: { type: String, default: '' },
    batch: { type: String, default: '' },
    specialization: { type: String, default: '' },
    currentCgpa: { type: Number, default: 0 },
    backlogs: { type: Number, default: 0 },
    expectedGraduationYear: { type: Number, default: null },
  },
  { _id: false }
);

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say', ''],
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    profilePhoto: {
      type: String, // endpoint path e.g. "api/files/{fileId}/{filename}"
      default: '',
    },
    profilePhotoId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    skills: {
      type: [String],
      default: [],
    },
    resume: {
      fileId: { type: mongoose.Schema.Types.ObjectId, default: null },
      filePath: { type: String, default: '' }, // endpoint path e.g. "api/files/{fileId}/{filename}"
      originalName: { type: String, default: '' },
      fileSize: { type: Number, default: 0 },
      contentType: { type: String, default: '' },
      uploadedAt: { type: Date, default: null },
    },
    currentAcademic: {
      type: currentAcademicSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
