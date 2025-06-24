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

module.exports = router;
