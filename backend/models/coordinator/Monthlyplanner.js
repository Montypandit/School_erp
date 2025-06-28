const mongoose = require('mongoose');

const monthlyPlannerSchema = new mongoose.Schema({
  
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },

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

  semester: {
    type: String,
    enum: ['1st', '2nd', 'summer'],
    required: function () {
      return this.eventType === 'academic' || this.eventType === 'exam';
    }
  },


  targetAudience: {
    classes: [{
      type: String,
      trim: true
    }],
    sections: [{
      type: String,
      trim: true
    }],
    departments: [{
      type: String,
      trim: true
    }],
    specific_users: [{
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'targetAudience.userType'
    }],
    userType: {
      type: String,
      enum: ['Student', 'Teacher', 'Parent', 'Admin', 'Coordinator', 'Principal']
    }
  },

  
  location: {
    type: String,
    trim: true
  },

  venue: {
    type: String,
    trim: true
  }
});

const MonthlyPlanner = mongoose.model('MonthlyPlanner', monthlyPlannerSchema);

module.exports = MonthlyPlanner;
