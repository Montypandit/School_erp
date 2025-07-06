const express = require('express');
const Attendance = require('../../models/teacher/attendanceSchema');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');
const router = express.Router();

// CREATE attendance - Teacher only
router.post('/create/attendance', authMiddleware, authorizeRoles('teacher'), async (req, res) => {
  try {
    const teacherId = req.user._id; // from token
    const {
      studentId, studentName, subject, courseCode,
      className, section, date, status
    } = req.body;

    const newAttendance = new Attendance({
      studentId,
      studentName,
      subject,
      courseCode,
      class: className,
      section,
      date,
      status,
      takenBy: teacherId
    });

    const saved = await newAttendance.save();
    res.status(201).json({ message: "Attendance marked", data: saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all attendance - Admin only
router.get('/get/all/attendance', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const records = await Attendance.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET attendance by teacher - Teacher only
router.get('/get/my/attendance', authMiddleware, authorizeRoles('admin','teacher'), async (req, res) => {
  try {
    const teacherId = req.user._id;
    const records = await Attendance.find({ takenBy: teacherId }).sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE attendance - Teacher only
router.put('/update/attendance/:attendanceId', authMiddleware, authorizeRoles('teacher'), async (req, res) => {
  try {
    const updated = await Attendance.findOneAndUpdate(
      { _id: req.params.attendanceId, takenBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Record not found or unauthorized' });

    res.status(200).json({ message: 'Attendance updated', data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET attendance by date for teachers
router.get('/get/all-attendance/:date', authMiddleware, authorizeRoles( 'admin','teacher'), async (req, res) => {
  try {
    const { date } = req.params;

    if (!date) return res.status(400).json({ message: 'Date is required' });

    const records = await Attendance.find({ date }).sort({ createdAt: -1 });

    if (records.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for this date' });
    }

    res.status(200).json({ data: records });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
