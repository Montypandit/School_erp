const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  leaveId: {
    type: String,
    required: true,
    unique: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  leaveType: {
    type: String,
    enum: ['sick', 'personal', 'family', 'medical', 'emergency', 'other'],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
});

const Leave = mongoose.model('Leave', leaveRequestSchema);

module.exports = Leave;
