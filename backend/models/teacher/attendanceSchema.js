const mongoose = require('mongoose');

const studentAttendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Admission'
  },
  name: {
    type: String,
    required: true
  },
  fatherName: {
    type: String
  },
  admissionId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    default: 'absent'
  }
}, { _id: false }); // Prevents subdocument _id for each student entry

const attendanceSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true
  },
  section: {
    type: String ,// optional
    enum: ['A', 'B', 'C','D']
  },
  date: {
    type: String,
    required: true // stored as YYYY-MM-DD string
  },
  students: [studentAttendanceSchema]
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
