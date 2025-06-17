const express = require('express');
const InquiryFormProcess = require('../../models/coordinator/inquiryFormProcess');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Create Inquiry Process (admin or coordinator)
router.post('/inquiry-process', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const { inquiryId } = req.body;

    // Check if inquiryId already exists
    const exists = await InquiryFormProcess.findOne({ inquiryId });
    if (exists) {
      return res.status(400).json({ message: 'Inquiry already processed' });
    }

    const newInquiry = new InquiryFormProcess(req.body);
    const saved = await newInquiry.save();

    res.status(201).json({ message: 'Inquiry Process created successfully', data: saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Inquiries (admin/coordinator)
router.get('/inquiry-process', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const all = await InquiryFormProcess.find().sort({ createdAt: -1 });
    res.status(200).json(all);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Inquiry by inquiryId (admin/coordinator)
router.get('/inquiry-process/:inquiryId', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const inquiry = await InquiryFormProcess.findOne({ inquiryId: req.params.inquiryId });
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.status(200).json(inquiry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Inquiry Process (admin  only)
router.put('/inquiry-process/:inquiryId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const updated = await InquiryFormProcess.findOneAndUpdate(
      { inquiryId: req.params.inquiryId },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Inquiry not found' });
    res.status(200).json({ message: 'Updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Inquiry (admin only)
router.delete('/inquiry-process/:inquiryId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const deleted = await InquiryFormProcess.findOneAndDelete({ inquiryId: req.params.inquiryId });

    if (!deleted) return res.status(404).json({ message: 'Inquiry not found' });
    res.status(200).json({ message: 'Deleted successfully', data: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
