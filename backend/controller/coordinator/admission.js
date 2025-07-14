const mongoose = require('mongoose');
const express = require('express');
const Admission = require('../../models/coordinator/admissionForm');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');
const AdmissionApproval = require('../../models/principal/admissionApproval');
const InquiryForm = require('../../models/parents/inquiryForm');
const Attendance = require('../../models/teacher/attendanceSchema');
//const StudentAllocationSchema = require('../../models/coordinator/studentAllocation');
const router = express.Router();
const StudentStatus = require('../../models/admin/studentStatus');

// ======================= SAVE ATTENDANCE =======================
router.post('/save/attendence', authMiddleware, authorizeRoles('admin', 'coordinator', 'teacher'), async (req, res) => {
  try {
    const { class: className, section, date, students } = req.body;

    if (!className || !date || !Array.isArray(students)) {
      return res.status(400).json({ message: "Class, date, and students are required" });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const formattedDate = parsedDate.toISOString().split('T')[0];

    const filter = { class: className, date: formattedDate };
    if (section) filter.section = section;

    const updatedAttendance = await Attendance.findOneAndUpdate(
      filter,
      {
        class: className,
        section : section || 'N/A',
        date: formattedDate,
        students,
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "✅ Attendance saved successfully", data: updatedAttendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Failed to save attendance", error: err.message });
  }
});

// ======================= GET ATTENDANCE =======================
router.get('/get/attendance', authMiddleware, authorizeRoles('admin', 'coordinator', 'teacher','principal'), async (req, res) => {
  try {
    const { class: className, date } = req.query;

    if (!className || !date) {
      return res.status(400).json({ message: "Class and date are required" });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const formattedDate = parsedDate.toISOString().split("T")[0];

    const attendanceRecord = await Attendance.findOne({ class: className, date: formattedDate });

    if (!attendanceRecord) {
      return res.status(200).json({ message: "No attendance found", students: [] });
    }

    res.status(200).json({ message: "Attendance found", students: attendanceRecord.students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch attendance", error: error.message });
  }
});


// ======================= GET ALL ATTENDANCE RECORDS FOR A SPECIFIC DATE =======================
router.get('/get/all-attendance/:date', authMiddleware, authorizeRoles('admin','teacher','principal'), async (req, res) => {
  try {
    const { date } = req.params;

    if (!date) return res.status(400).json({ message: 'Date is required' });

    const formattedDate = new Date(date).toISOString().split('T')[0];

    const records = await Attendance.find({ date: formattedDate }).sort({ createdAt: -1 });

    if (records.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for this date' });
    }

    // Map and prepare frontend-compatible data
    const mapped = records.map(record => {
      const total = record.students.length;
      const present = record.students.filter(s => s.status === 'present').length;
      const absent = total - present;
      const absentList = record.students
        .filter(s => s.status === 'absent')
        .map(s => s.name || s.studentName || s.admissionId); // Adjust field as per schema

      const attendancePercentage = total === 0 ? 0 : Math.round((present / total) * 100);

      return {
        class: record.class,
        section: record.section,
        totalStudents: total,
        presentStudents: present,
        absentStudents: absent,
        absentList,
        attendancePercentage,
      };
    });

    res.status(200).json({ data: mapped });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// ✅ GET all attendance records for a specific date (e.g., today)
router.get('/get/all-attendance', authMiddleware, authorizeRoles('admin', 'coordinator', 'teacher','principal'), async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const formattedDate = new Date(date).toISOString().split("T")[0];

    const allAttendance = await Attendance.find({ date: formattedDate });

    res.status(200).json({ message: "All attendance fetched", data: allAttendance });
  } catch (err) {
    console.error("Error in /get/all-attendance", err);
    res.status(500).json({ message: "Failed to fetch attendance", error: err.message });
  }
});


// ======================= CREATE ADMISSION =======================
router.post('/create/admission', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const newAdmission = new Admission(req.body);
    const savedAdmission = await newAdmission.save();

    const inquiryId = savedAdmission.inquiryId;
    await AdmissionApproval.findOneAndDelete({ inquiryId });

    const studentStatus = new StudentStatus({
      admissionId:savedAdmission.admissionId,
      status:'Active',
      reason:'',
      leaveDate:'',
      leaveType:'',
      leaveReason:'',
      remarks:''
    });

    await studentStatus.save();

    res.status(201).json({ message: 'Admission form submitted successfully', data: savedAdmission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit admission form', error });
  }
});

// ======================= UPDATE ADMISSION =======================
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


// add section 
// ======================= ALLOCATE STUDENT SECTION =======================
router.post('/students/allocate/section', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const { admissionId, section, academicYear, rollNumber } = req.body;

    if (!admissionId || !section || !academicYear || !rollNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedStudent = await Admission.findOneAndUpdate(
      { admissionId },
      {
        section,
        academicYear,
        rollNumber,
        rollNo: rollNumber // also update rollNo if needed
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "✅ Student section allocated successfully", data: updatedStudent });
  } catch (error) {
    console.error("❌ Error allocating section:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ======================= GET ALL ADMISSIONS =======================
router.get('/get/all/admissions', authMiddleware, authorizeRoles('admin', 'coordinator','teacher','principal'), async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.status(200).json({ message: 'Admissions fetched successfully', data: admissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch admissions', error });
  }
});

// ======================= GET STUDENT BY ADMISSION ID =======================
router.get('/get/student/:admissionId', authMiddleware, authorizeRoles('admin', 'coordinator','teacher','principal'), async (req, res) => {
  try {
    const student = await Admission.findOne({ admissionId: req.params.admissionId });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ data: student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================= GET STUDENTS BY CLASS =======================
router.get('/get/students/byClass/:classId', authMiddleware, authorizeRoles('admin', 'coordinator','principal'), async (req, res) => {
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


router.get('/get/admission/count',authMiddleware, authorizeRoles('admin','coordinator'), async(req,res)=>{
  try{
    // count admissions which are created in current year
    const totalAdmissionCount = await Admission.countDocuments({createdAt:{$gte: new Date(new Date().getFullYear(),0,1)}});
    const totalAdmissionAllTime = await Admission.countDocuments();

    if(!totalAdmissionCount && !totalAdmissionAllTime){
      return status(404).json({message:"No admission found"});
    }
    res.status(200).json({totalAdmissionCount,totalAdmissionAllTime});
  } catch(err){
    console.log(err);
    res.status(500).json({message:'Error fetching admission count', error:err.message});
  }
});

// Delete a student
router.delete('/delete/student/:admissionId',authMiddleware, authorizeRoles('admin'), async (req,res)=>{
  try{
    const {admissionId} = req.params;
    const deleteStudent = await Admission.findByIdAndDelete(admissionId);
    if(!deleteStudent){
      return res.status(404).json({message:'Student not found'});
    }
    res.status(200).json({data:deleteStudent})
  }catch(err){
    console.log(err);
    res.status(500).json({message:'Error deleting student', error:err.message});
  }
});
module.exports = router;
