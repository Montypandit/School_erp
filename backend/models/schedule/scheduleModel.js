const mongoose = require('mongoose');

const weeklyScheduleSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  sections: [
    {
      sectionName: {
        type: String,
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
                type: String,
                required: true,
              },
              endTime: {
                type: String,
                required: true,
              },
              subject: {
                type: String,
                required: true,
              },
              teacher: {
                type: String,
                //required: true,
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

const scheduleModel = mongoose.model('ScheduleModel', weeklyScheduleSchema);
module.exports = scheduleModel;
