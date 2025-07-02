const mongoose = require('mongoose');
const express = require('express');
const Admission = require('../../models/coordinator/admissionForm');
const AdmissionFees = require('../../models/coordinator/AdmissionFees');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');

const router = express.Router();

// POST API to create admission fees
router.post('/create/admission/fee', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const feesData = req.body;

    // Prevent duplicate entries
    const existing = await AdmissionFees.findOne({ admissionId: feesData.admissionId });
    if (existing) {
      return res.status(400).json({ message: 'Fees already generated for this admission ID' });
    }

    const newFees = new AdmissionFees({
      ...feesData,
    });

    await newFees.save();

    res.status(201).json({
      message: 'Admission fees created successfully',
      data: newFees
    });
  } catch (err) {
    console.error('Error creating fees:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET API to fetch all admission fee records
router.get('/get/admission/fees', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const allFees = await AdmissionFees.find().sort({ createdAt: -1 });
    res.status(200).json({ data: allFees });
  } catch (err) {
    console.error('Error fetching fees:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Optional: Get single fee record by admissionId
router.get('/get/admission/fee/:admissionId', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const { admissionId } = req.params;
    const fee = await AdmissionFees.findOne({ admissionId });

    if (!fee) {
      return res.status(404).json({ message: 'No fees found for this admission ID' });
    }

    res.status(200).json({ data: fee });
  } catch (err) {
    console.error('Error fetching fee:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
