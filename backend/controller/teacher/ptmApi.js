const express = require('express');
const router = express.Router();
const PTM = require('../../models/teacher/ptmSchema');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');

// Create a new PTM record
router.post('/create/ptm/schedule', authMiddleware, authorizeRoles('admin', 'coordinator', 'teacher'), async (req, res) => {
  try {
    const ptm = new PTM(req.body);
    const savedPtm = await ptm.save();
    res.status(201).json({ message: 'PTM created successfully', data: savedPtm });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) { // Duplicate key error for meetingId
        return res.status(400).json({ message: `Meeting ID '${req.body.meetingId}' already exists.` });
    }
    res.status(500).json({ message: 'Failed to create PTM', error: error.message });
  }
});

// Get all PTM records
router.get('/get/all/ptm/schedules', authMiddleware, authorizeRoles('admin', 'coordinator', 'teacher'), async (req, res) => {
  try {
    const ptms = await PTM.find().sort({ scheduleDate: -1 });
    res.status(200).json({ data: ptms });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch PTMs', error: error.message });
  }
});

// Get a single PTM by meetingId
router.get('/get/:meetingId', authMiddleware, authorizeRoles('admin', 'coordinator', 'teacher'), async (req, res) => {
  try {
    const ptm = await PTM.findOne({ meetingId: req.params.meetingId });
    if (!ptm) {
      return res.status(404).json({ message: 'PTM not found' });
    }
    res.status(200).json({ data: ptm });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching PTM', error: error.message });
  }
});

// Get PTMs by admissionId
router.get('/get/by/:admissionId', authMiddleware, authorizeRoles('admin', 'coordinator', 'teacher'), async (req, res) => {
    try {
      const ptms = await PTM.find({ admissionId: req.params.admissionId }).sort({ scheduleDate: -1 });
      if (ptms.length === 0) {
        return res.status(404).json({ message: 'No PTMs found for this admission ID' });
      }
      res.status(200).json({ data: ptms });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching PTMs by admission ID', error: error.message });
    }
});

// Update a PTM record
router.put('/update/:meetingId', authMiddleware, authorizeRoles('admin', 'coordinator', 'teacher'), async (req, res) => {
  try {
    const updatedPtm = await PTM.findOneAndUpdate(
      { meetingId: req.params.meetingId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPtm) {
      return res.status(404).json({ message: 'PTM not found' });
    }
    res.status(200).json({ message: 'PTM updated successfully', data: updatedPtm });
  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({ message: `Meeting ID '${req.body.meetingId}' already exists.` });
    }
    res.status(500).json({ message: 'Failed to update PTM', error: error.message });
  }
});

// Delete a PTM record
router.delete('/delete/:meetingId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const deletedPtm = await PTM.findOneAndDelete({ meetingId: req.params.meetingId });
    if (!deletedPtm) {
      return res.status(404).json({ message: 'PTM not found' });
    }
    res.status(200).json({ message: 'PTM deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete PTM', error: error.message });
  }
});

module.exports = router;