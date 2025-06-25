const express = require('express');
const mongoose = require('mongoose');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');
const router = express.Router();

const ExamSchedule = require('../../models/schedule/examSchedule');

// Create Exam
router.post('/create/exam', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const newExam = new ExamSchedule(req.body);
    const saved = await newExam.save();
    res.status(201).json({ message: 'Exam created successfully', data: saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Exams
router.get('/get/all/exams', authMiddleware, authorizeRoles('admin', 'staff'), async (req, res) => {
  try {
    const exams = await ExamSchedule.find().sort({ date: 1 });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Exam by class
router.get('/get/exam/:class', authMiddleware, authorizeRoles('admin', 'staff'), async (req, res) => {
  try {
    const exam = await ExamSchedule.findOne({ class: req.params.class });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Exam by class
router.put('/update/exam/:class', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const updated = await ExamSchedule.findOneAndUpdate({ class: req.params.class }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Exam not found' });

    res.status(200).json({ message: 'Exam updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Exam by class
router.delete('/delete/exam/:class', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const deleted = await ExamSchedule.findOneAndDelete({ class: req.params.class });
    if (!deleted) return res.status(404).json({ message: 'Exam not found' });

    res.status(200).json({ message: 'Exam deleted successfully', data: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
