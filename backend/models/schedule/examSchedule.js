// models/Exam.js

const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // e.g., "09:00 AM - 12:00 PM"
  duration: { type: String, required: true },
  room: { type: String, required: true },
  class: { type: String, required: true }, // e.g., "5th"
  instructor: { type: String, required: true },
  students: { type: Number, required: true },
  type: { type: String, enum: ["Theory", "Practical"], required: true }
}, { timestamps: true });

module.exports = mongoose.model('ExamSchedule', examSchema);
