const express = require('express');
const InquiryFormProcess = require('../../models/coordinator/inquiryFormProcess');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');
const bcrypt = require('bcryptjs');
const router = express.Router();
const AdmissionApproval = require('../../models/principal/admissionApproval');
import {getNextAdmissionId} from '../../utils/getAdmissionId'

// Create Inquiry Process (admin or coordinator)
router.post('/create/inquiry-process', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const formData = req.body;
    const newInquiry = new InquiryFormProcess(formData);
    const saved = await newInquiry.save();

    const admissionId = getNextAdmissionId();

    const admissionApproval = new AdmissionApproval({
      admissionId:admissionId,
      inquiryId:saved.inquiryId,
      admissionApproved:'Pending'
    });

    await admissionApproval.save();
    
    res.status(201).json({ message: 'Inquiry Process created successfully', data: saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Inquiries (admin/coordinator)
router.get('/get/all/inquiry-process', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const all = await InquiryFormProcess.find().sort({ createdAt: -1 });
    res.status(200).json(all);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Inquiry by inquiryId (admin/coordinator)
router.get('/get/inquiry-process/:inquiryId', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const inquiry = await InquiryFormProcess.findOne({ inquiryId: req.params.inquiryId });
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.status(200).json(inquiry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Inquiry Process (admin  only)
router.put('/update/inquiry-process/:inquiryId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
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
router.delete('/delete/inquiry-process/:inquiryId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const deleted = await InquiryFormProcess.findOneAndDelete({ inquiryId: req.params.inquiryId });

    if (!deleted) return res.status(404).json({ message: 'Inquiry not found' });
    res.status(200).json({ message: 'Deleted successfully', data: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
