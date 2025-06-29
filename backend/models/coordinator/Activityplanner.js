const mongoose = require('mongoose');

const activityPlannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Activity title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Activity description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  activityType: {
    type: String,
    required: [true, 'Activity type is required'],
    enum: [
      'Sports',
      'Cultural',
      'Academic',
      'Workshop',
      'Seminar',
      'Competition',
      'Field Trip',
      'Exhibition',
      'Meeting',
      'Celebration',
      'Training',
      'Other'
    ]
  },
  
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Start date cannot be in the past'
    }
  },
  
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value >= this.startDate;
      },
      message: 'End date must be after or equal to start date'
    }
  },
  
  time: {
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time format (HH:MM)']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time format (HH:MM)']
    }
  },
  
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true,
    maxlength: [200, 'Venue cannot exceed 200 characters']
  },
  
  classesInvolved: [{
    class: {
      type: String,
      required: true
    },
    section: {
      type: String,
      required: true
    }
  }],
  

  
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['planned', 'approved', 'ongoing', 'completed', 'cancelled', 'postponed'],
    default: 'planned'
  }
},{timestamps:true});

const ActivityPlanner = mongoose.model('ActivityPlanner', activityPlannerSchema);

module.exports = ActivityPlanner;
