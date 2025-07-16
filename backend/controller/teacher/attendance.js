const mongoose = require('mongoose');
const express = require('express');
//const Attendance = require('../../models/teacher/attendanceSchema');
const Attendance = require('../../models/teacher/attendanceSchema'); // assume model is already created
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');
const StudentStatus = require('../../models/admin/studentStatus');
const router = express.Router();

// CREATE attendance - Teacher only
// router.post('/create/attendance', authMiddleware, authorizeRoles('teacher'), async (req, res) => {
//   try {
//     const teacherId = req.user._id; // from token
//     const {
//       studentId, studentName, subject, courseCode,
//       className, section, date, status
//     } = req.body;

//     const newAttendance = new Attendance({
//       studentId,
//       studentName,
//       subject,
//       courseCode,
//       class: className,
//       section,
//       date,
//       status,
//       takenBy: teacherId
//     });

//     const saved = await newAttendance.save();
//     res.status(201).json({ message: "Attendance marked", data: saved });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // GET all attendance - Admin only
// router.get('/get/all/attendance', authMiddleware, authorizeRoles('admin'), async (req, res) => {
//   try {
//     const records = await Attendance.find().sort({ createdAt: -1 });
//     res.status(200).json(records);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // GET attendance by teacher - Teacher only
// router.get('/get/my/attendance', authMiddleware, authorizeRoles('teacher'), async (req, res) => {
//   try {
//     const teacherId = req.user._id;
//     const records = await Attendance.find({ takenBy: teacherId }).sort({ createdAt: -1 });
//     res.status(200).json(records);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // UPDATE attendance - Teacher only
// router.put('/update/attendance/:attendanceId', authMiddleware, authorizeRoles('teacher'), async (req, res) => {
//   try {
//     const updated = await Attendance.findOneAndUpdate(
//       { _id: req.params.attendanceId, takenBy: req.user._id },
//       req.body,
//       { new: true }
//     );
//     if (!updated) return res.status(404).json({ message: 'Record not found or unauthorized' });

//     res.status(200).json({ message: 'Attendance updated', data: updated });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// GET attendance by date for teachers

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


module.exports = router;
