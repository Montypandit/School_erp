// routes/teacher.js or routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../../models/admin/employee');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');

// @route   GET /api/teachers
// @desc    Get all users with role = 'teacher'
// @access  Protected (optional: use middleware)
router.get('/getallteacher', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' });
    res.status(200).json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Server Error' });
  }


});


// @route   GET /api/teacher/:empId
// @desc    Get a specific teacher by empId
// @access  Protected (optional: use middleware)
router.get('/getteacher/:empId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const teacher = await User.findOne({ empId: req.params.empId });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json({teacher});
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/teachers/department/:department', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const { department } = req.params;
        const teachers = await User.find({ department });
        if (teachers.length === 0) {
            return res.status(404).json({ error: 'No teachers found in this department' });
        }
        res.status(200).json({ teachers });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch teachers', details: error.message });
    }
});

// update teacher
router.put('/update/teacher/:empId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const updatedTeacher = await User.findOneAndUpdate(
            { empId: req.params.empId },
            req.body,
            { new: true }
        );
        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.status(200).json({ teacher: updatedTeacher });
    } catch (error) {
        console.error('Error updating teacher:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
