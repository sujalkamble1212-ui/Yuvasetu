const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlacementDrive',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    remarks: {
      type: String,
      default: '',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate application by same student to the same drive
applicationSchema.index({ drive: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
