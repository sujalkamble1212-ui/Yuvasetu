const mongoose = require('mongoose');

const tenthSchema = new mongoose.Schema(
  {
    school: { type: String, default: '' },
    board: { type: String, default: '' },
    passingYear: { type: Number, default: null },
    percentage: { type: Number, default: null },
  },
  { _id: false }
);

const twelfthSchema = new mongoose.Schema(
  {
    college: { type: String, default: '' },
    board: { type: String, default: '' },
    passingYear: { type: Number, default: null },
    percentage: { type: Number, default: null },
  },
  { _id: false }
);

const diplomaSchema = new mongoose.Schema(
  {
    institute: { type: String, default: '' },
    course: { type: String, default: '' },
    universityOrBoard: { type: String, default: '' },
    passingYear: { type: Number, default: null },
    percentageOrCgpa: { type: Number, default: null },
  },
  { _id: false }
);

const graduationSchema = new mongoose.Schema(
  {
    degree: { type: String, default: '' },
    college: { type: String, default: '' },
    university: { type: String, default: '' },
    specialization: { type: String, default: '' },
    passingYear: { type: Number, default: null },
    cgpaOrPercentage: { type: Number, default: null },
  },
  { _id: false }
);

const postGraduationSchema = new mongoose.Schema(
  {
    degree: { type: String, default: '' },
    college: { type: String, default: '' },
    university: { type: String, default: '' },
    specialization: { type: String, default: '' },
    passingYear: { type: Number, default: null },
    cgpaOrPercentage: { type: Number, default: null },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    tenth: { type: tenthSchema, default: () => ({}) },
    twelfth: { type: twelfthSchema, default: () => ({}) },
    diploma: { type: diplomaSchema, default: () => ({}) },
    graduation: { type: graduationSchema, default: () => ({}) },
    postGraduation: { type: postGraduationSchema, default: () => ({}) },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Education', educationSchema);
