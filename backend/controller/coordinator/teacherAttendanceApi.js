const express = require('express');
const router = express.Router();
const TeacherAttendance = require('../../models/coordinator/teacherAttendance');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');


router.post('/create/teacher/attendance', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const attendance = new TeacherAttendance(req.body);
    await attendance.save();
    res.status(201).json({ message: 'Teacher attendance recorded', data: attendance });
  } catch (error) {
    res.status(400).json({ message: 'Failed to mark attendance', error: error.message });
  }
});


router.get('/get/all/teacher/attendance', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const records = await TeacherAttendance.find().sort({ date: -1 });
    res.status(200).json({ data: records });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch records', error: error.message });
  }
});

router.get('/get/teacher/attendance/by/:teacherId', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const records = await TeacherAttendance.find({ teacherId: req.params.teacherId }).sort({ date: -1 });
    res.status(200).json({ data: records });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch records', error: error.message });
  }
});

module.exports = router;
