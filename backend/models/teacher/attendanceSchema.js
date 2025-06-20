const mongoose = require('mongoose');

// Individual student attendance
const studentStatusSchema = new mongoose.Schema({
  rollNo: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  name: { type: String, required: true },
  fatherName: { type: String },
  status: { type: String, enum: ['Present', 'Absent', 'Leave'], required: true }
}, { _id: false });

// Full attendance record for a class & subject on a given day
const attendanceSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  subjectName: { type: String, required: true },
  courseCode: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  date: { type: Date, required: true },
  students: [studentStatusSchema]
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
