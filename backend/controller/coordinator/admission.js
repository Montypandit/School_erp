const mongoose = require('mongoose');
const express = require('express');
const Admission = require('../../models/coordinator/admissionForm');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');
const AdmissionApproval = require('../../models/principal/admissionApproval')
const InquiryForm = require('../../models/parents/inquiryForm')
const Attendance = require('../../models/teacher/attendanceSchema');
const router = express.Router();

// POST /api/attendance/save
router.post('/save/attendence', authMiddleware, authorizeRoles('admin', 'coordinator', 'teacher'), async (req, res) => {
  try {
    const { class: className, section, date, students } = req.body;

    if (!className || !date || !Array.isArray(students)) {
      return res.status(400).json({ message: "Class, date, and students are required" });
    }

    const filter = {
      class: className,
      date: new Date(date).toISOString().split('T')[0]
    };
    if (section) filter.section = section;

    // Delete old attendance if already saved
    await Attendance.deleteOne(filter);

    // Save new attendance
    const newAttendance = new Attendance({
      class: className,
      section,
      date,
      students
    });

    const saved = await newAttendance.save();
    res.status(201).json({ message: "✅ Attendance saved successfully", data: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Failed to save attendance", error: err.message });
  }
});





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
});




 // get all student by class
router.get('/get/students/byClass/:classId', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const { classId } = req.params;
    const students = await Admission.find({ class: classId }).sort({ createdAt: -1 });

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No students found for this class' });
    }

    res.status(200).json({ message: 'Students fetched successfully', data: students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch students', error });
  }
});


module.exports = router;
