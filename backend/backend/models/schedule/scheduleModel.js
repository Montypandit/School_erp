const mongoose = require('mongoose');

const weeklyScheduleSchema = new mongoose.Schema({
  className: {
    type: String, // e.g., "Nursery", "LKG", "UKG"
    required: true,
  },
  
  sections: [
    {
      sectionName: {
        type: String, // e.g., "A", "B", "C"
        required: true,
      },
      schedule: [
        {
          day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            required: true,
          },
          lectures: [
            {
              startTime: {
                type: String, // "09:00"
                required: true,
              },
              endTime: {
                type: String, // "10:00"
                required: true,
              },
              subject: {
                type: String,
                required: true,
              },
              teacher: {
                type: String,
                required: true,
              },
              room: {
                type: String,
              }
            }
          ]
        }
      ]
    }
  ]
});

const WeeklySchedule = mongoose.model('WeeklySchedule', weeklyScheduleSchema);
module.exports = WeeklySchedule;
