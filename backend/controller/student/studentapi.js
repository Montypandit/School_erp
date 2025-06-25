const express = require('express');
const router = express.Router();
const User = require('../../models/admin/employee');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');

// ✅ Your GET /getallstudent route
router.get('/getallstudent', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;


// @route   GET /api/students/getstudent/:empId
// @desc    Get a specific student by empId
// @access  Admin only
router.get('/getstudent/:empId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const student = await User.findOne({ empId: req.params.empId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json( student );
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
