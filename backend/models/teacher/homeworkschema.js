const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
  admissionId: {
    type: String, 
    required: true
  },
  className: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  homeworkDetails: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Homework', homeworkSchema);
