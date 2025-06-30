const express = require('express');
const router = express.Router();
const Homework = require('../../models/teacher/homeworkschema');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');

// Create Homework
router.post('/create/homework', authMiddleware, authorizeRoles('admin', 'coordinator','teacher'), async (req, res) => {
  try {
    const homework = new Homework(req.body);
    const saved = await homework.save();
    res.status(201).json({ message: 'Homework created successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create homework', error });
  }
});

// Get Homework by Admission ID
router.get('/get/homework/by/:admissionId', authMiddleware, authorizeRoles('admin', 'coordinator', 'teacher'), async (req, res) => {
  try {
    const homeworks = await Homework.find({ admissionId: req.params.admissionId }).sort({ createdAt: -1 });
    res.status(200).json({ data: homeworks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching homework', error });
  }
});

// Get Homework by Class & Section
router.get('/get/homework/class/:className/section/:section', authMiddleware, authorizeRoles('admin', 'coordinator', 'teacher'), async (req, res) => {
  const { className, section } = req.params;
  try {
    const homeworks = await Homework.find({ className, section }).sort({ createdAt: -1 });
    res.status(200).json({ data: homeworks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching homework by class-section', error });
  }
});

module.exports = router;
