const express = require('express');
const router = express.Router();
//const WeeklySchedule = require('../../models/schedule/scheduleModel'); // your provided schema
// const authMiddleware = require('../../middleware/authMiddleware');
// const authorizeRoles = require('../../middleware/authorizeRoles');
const scheduleModel = require('../models/schedule/scheduleModel');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRules');

// const authMiddleware = require('../middleware/authMiddleware');
// const authorizeRoles = require('../middleware/authorizeRoles');


/**
 * CREATE Weekly Schedule (Admin, Coordinator)
 */
router.post('/create/schedule', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const { className, sections } = req.body;

    const newSchedule = new scheduleModel({ className, sections });
    const saved = await newSchedule.save();

    res.status(201).json({ message: 'Weekly schedule created', data: saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET All Weekly Schedules (Admin, Coordinator, Teacher)
 */
router.get('/get/all/schedules', authMiddleware, authorizeRoles('admin', 'coordinator', 'teacher'), async (req, res) => {
  try {
    const schedules = await scheduleModel.find().sort({ className: 1 });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET Schedule by Class Name (All Roles)
 */
router.get('/get/schedule/:className', authMiddleware, authorizeRoles('admin', 'coordinator', 'teacher'), async (req, res) => {
  try {
    const schedule = await scheduleModel.findOne({ className: req.params.className });

    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * UPDATE Schedule by ID (Admin, Coordinator)
 */
router.put('/update/schedule/:scheduleId', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const updated = await scheduleModel.findByIdAndUpdate(req.params.scheduleId, req.body, { new: true });

    if (!updated) return res.status(404).json({ message: 'Schedule not found' });

    res.status(200).json({ message: 'Schedule updated', data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE Schedule by ID (Admin only)
 */
router.delete('/delete/schedule/:scheduleId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const deleted = await scheduleModel.findByIdAndDelete(req.params.scheduleId);

    if (!deleted) return res.status(404).json({ message: 'Schedule not found' });

    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
