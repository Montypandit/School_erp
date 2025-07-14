const express = require('express');
const router = express.Router();
const ExamResult = require('../../models/teacher/resultSchema');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');

// ===========================
// POST - Create Exam Result
// ===========================
router.post('/create/result', authMiddleware, authorizeRoles('teacher'), async (req, res) => {
  try {
    const createdBy = req.user._id;
    const { student, exams } = req.body;

    if (!student || !exams || !Array.isArray(exams)) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    // Only keep subject-wise data without total or grade calculation
    const cleanExams = exams.map((exam) => ({
      examType: exam.examType,
      examDate: exam.examDate,
      subjects: exam.subjects.map((s) => ({
        subjectName: s.subjectName,
        grade: s.grade,
      })),
    }));

    const newResult = new ExamResult({
      student,
      exams: cleanExams,
      createdBy,
    });

    const saved = await newResult.save();
    res.status(201).json({ message: 'Result stored successfully', data: saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===========================
// GET - All Results (Admin)
// ===========================
router.get('/get/all/result', authMiddleware, authorizeRoles('admin', 'teacher'), async (req, res) => {
  try {
    const results = await ExamResult.find().sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===========================
// GET - My Created Results (Teacher)
// ===========================
router.get('/get/my/result', authMiddleware, authorizeRoles('teacher'), async (req, res) => {
  try {
    const teacherId = req.user._id;
    const results = await ExamResult.find({ createdBy: teacherId }).sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===========================
// PUT - Update Result by ID
// ===========================
router.put('/update/result/:resultId', authMiddleware, authorizeRoles('teacher'), async (req, res) => {
  try {
    const updated = await ExamResult.findOneAndUpdate(
      { _id: req.params.resultId, createdBy: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Result not found or unauthorized' });

    res.status(200).json({ message: 'Result updated', data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// view result by admissionId
// ===========================
// GET - View Result by Admission ID
// ===========================
router.get('/view/result/:admissionId', authMiddleware, authorizeRoles('teacher'), async (req, res) => {
  try {
    const { admissionId } = req.params;

    // Find result by admission ID
    const result = await ExamResult.findOne({ 'student.admissionId': admissionId });

    if (!result) {
      return res.status(404).json({ message: 'Result not found for this student' });
    }

    const subjectMap = {}; // subjectName => { midTerm, final, totals... }

    let totalObtained = 0;
    let totalMaximum = 0;

    result.exams.forEach((exam) => {
      const type = exam.examType; // Mid Term / Final Exam
      exam.subjects.forEach((sub) => {
        const { subjectName, obtainedMarks, totalMarks } = sub;
        if (!subjectMap[subjectName]) {
          subjectMap[subjectName] = {
            subjectName,
            midTermMarks: 0,
            midTermTotal: 0,
            finalMarks: 0,
            finalTotal: 0,
            totalObtained: 0,
            totalMaximum: 0,
          };
        }

        if (type === "Mid Term") {
          subjectMap[subjectName].midTermMarks += obtainedMarks;
          subjectMap[subjectName].midTermTotal += totalMarks;
        } else if (type === "Final Exam") {
          subjectMap[subjectName].finalMarks += obtainedMarks;
          subjectMap[subjectName].finalTotal += totalMarks;
        }

        subjectMap[subjectName].totalObtained += obtainedMarks;
        subjectMap[subjectName].totalMaximum += totalMarks;

        totalObtained += obtainedMarks;
        totalMaximum += totalMarks;
      });
    });

    const subjectSummaries = Object.values(subjectMap).map((s) => {
      const percentage = s.totalMaximum > 0 ? ((s.totalObtained / s.totalMaximum) * 100).toFixed(2) : 0;
      let grade = 'F';
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B';
      else if (percentage >= 60) grade = 'C';
      else grade = 'F';

      return {
        ...s,
        percentage,
        grade,
      };
    });

    const overallPercentage = totalMaximum > 0 ? ((totalObtained / totalMaximum) * 100).toFixed(2) : 0;
    let overallGrade = 'F';
    if (overallPercentage >= 90) overallGrade = 'A+';
    else if (overallPercentage >= 80) overallGrade = 'A';
    else if (overallPercentage >= 70) overallGrade = 'B';
    else if (overallPercentage >= 60) overallGrade = 'C';

    res.status(200).json({
      student: result.student,
      totalObtained,
      totalMaximum,
      overallPercentage,
      overallGrade,
      subjectSummaries,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
