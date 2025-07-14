const mongoose = require('mongoose');

const ptmSchema = new mongoose.Schema({
  scheduledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  students: [
    {
      admissionId: { type: String, required: true },
      name: { type: String, required: true },
      status: { type: String, enum: ['pending', 'completed', 'rejected'], default: 'pending' },
      feedback: { type: String },
      rejectionReason: { type: String }
    }
  ],
  class: { type: String, required: true },
  section: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('PTM', ptmSchema);

