const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    userEmail: {
      type: String,
      default: 'Guest/Anonymous',
    },
    userRole: {
      type: String,
      default: 'Guest',
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    httpMethod: {
      type: String,
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    statusCode: {
      type: Number,
      required: true,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    responseTime: {
      type: Number, // in ms
      default: 0,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ timestamp: -1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ userEmail: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
