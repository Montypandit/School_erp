const mongoose = require('mongoose');
const express = require('express');
const Admission = require('../../models/coordinator/admissionForm');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');
const AdmissionApproval = require('../../models/principal/admissionApproval')
const InquiryForm = require('../../models/parents/inquiryForm')
const router = express.Router();

//  Create Admission
router.post('/create/admission', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const newAdmission = new Admission(req.body);
    const savedAdmission = await newAdmission.save();

    const inquiryId = savedAdmission.inquiryId;
    await AdmissionApproval.findOneAndDelete({inquiryId:inquiryId});
    await InquiryForm.findOneAndDelete({inquiryId:inquiryId});
    
    res.status(201).json({ message: 'Admission form submitted successfully', data: savedAdmission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit admission form', error });
  }
});

// Update Admission
router.put('/update/admission/:admissionId', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const { admissionId } = req.params;
    const updatedAdmission = await Admission.findOneAndUpdate(
      { admissionId },
      req.body,
      { new: true }
    );

    if (!updatedAdmission) {
      return res.status(404).json({ message: 'Admission not found' });
    }

    res.status(200).json({ message: 'Admission updated successfully', data: updatedAdmission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update admission', error });
  }
});

// Get All Admissions
router.get('/get/all/admissions', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.status(200).json({ message: 'Admissions fetched successfully', data: admissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch admissions', error });
  }
});

// get student by admissionId

router.get('/get/student/:admissionId',authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try{
    const student = await Admission.findOne({ admissionId: req.params.admissionId });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ data: student });
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router;
