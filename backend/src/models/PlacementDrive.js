const mongoose = require('mongoose');

const placementDriveSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    jobRole: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
    },
    jobDescription: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    eligibilityCriteria: {
      type: String,
      default: '',
    },
    minCgpa: {
      type: Number,
      default: 0,
    },
    minPercentage: {
      type: Number,
      default: 0,
    },
    maxBacklogs: {
      type: Number,
      default: 0,
    },
    salaryPackage: {
      type: String,
      required: [true, 'Salary / Package is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true,
    },
    driveDate: {
      type: Date,
      required: [true, 'Drive date is required'],
    },
    applicationDeadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    driveStatus: {
      type: String,
      enum: ['Active', 'Upcoming', 'Closed'],
      default: 'Active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);
