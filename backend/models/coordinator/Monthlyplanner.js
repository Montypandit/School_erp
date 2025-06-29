const mongoose = require('mongoose');

const monthlyPlannerSchema = new mongoose.Schema({
  
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },

  class:{type:String},

  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },

  
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },

  year: {
    type: Number,
    required: true,
    min: new Date().getFullYear() - 1,
    max: new Date().getFullYear() + 5
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  eventType: {
    type: String,
    required: true,
    enum: [
      'academic',
      'exam',
      'holiday',
      'meeting',
      'event',
      'assignment',
      'project',
      'extracurricular',
      'maintenance',
      'other'
    ]
  },

  status: {
    type: String,
    enum: ['planned', 'ongoing', 'completed', 'cancelled', 'postponed'],
    default: 'planned'
  },

  
  academicYear: {
    type: String,
    required: true
  },

  venue: {
    type: String,
    trim: true
  }
});

const MonthlyPlanner = mongoose.model('MonthlyPlanner', monthlyPlannerSchema);

module.exports = MonthlyPlanner;
