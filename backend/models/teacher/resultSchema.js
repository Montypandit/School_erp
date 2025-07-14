const mongoose = require("mongoose");

const SubjectResultSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  grade:{type:String, required:true}
});

const ExamSchema = new mongoose.Schema({
  examType: { type: String, enum: ["Term I", "Term II", "Term III"], required: true },
  examDate: { type: Date, required: true },
  subjects: [SubjectResultSchema],
  totalObtained: Number,
  totalMax: Number,
  percentage: Number,
  finalGrade: String,
});

const ExamResultSchema = new mongoose.Schema({
  student: {
    name: { type: String, required: true },
    admissionId: { type: String, required: true },
    class: { type: String },
    section: { type: String },
  },
  exams: [ExamSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("ExamResult", ExamResultSchema);
