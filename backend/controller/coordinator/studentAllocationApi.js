const express = require('express');
const jwt = require('jsonwebtoken');
const StudentAllocation = require('../../models/coordinator/studentAllocation'); // Import your existing model
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');

// 1. CREATE NEW STUDENT ALLOCATION
router.post('/students/allocate', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const {
      admissionId,
      section,
    } = req.body;

    // Validate required fields
    if (!admissionId || !section ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: admissionId, section'
      });
    }

    const studentAllocation = new StudentAllocation({
      admissionId,
      section,
    });

    const savedStudent = await studentAllocation.save();

    res.status(201).json({
      success: true,
      message: 'Student allocation created successfully',
      data: savedStudent
    });

  } catch (error) {
    handleError(res, error, 'Failed to create student allocation');
  }
});

// 2. GET ALL STUDENT ALLOCATIONS WITH PAGINATION AND FILTERING
router.get('/students', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      class: studentClass,
      section,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (studentClass) filter.class = studentClass;
    if (section) filter.section = section;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { admissionId: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const students = await StudentAllocation
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(parseInt(limit));

    const totalStudents = await StudentAllocation.countDocuments(filter);
    const totalPages = Math.ceil(totalStudents / parseInt(limit));

    res.json({
      success: true,
      data: students,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalStudents,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    handleError(res, error, 'Failed to fetch student allocations');
  }
});

// 3. GET SINGLE STUDENT ALLOCATION BY ID
router.get('/students/:id', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const student = await StudentAllocation.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student allocation not found'
      });
    }

    res.json({
      success: true,
      data: student
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }
    handleError(res, error, 'Failed to fetch student allocation');
  }
});

// 4. GET STUDENT BY ADMISSION ID
router.get('/students/admission/:admissionId', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const student = await StudentAllocation.findOne({ 
      admissionId: req.params.admissionId 
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student with this admission ID not found'
      });
    }

    res.json({
      success: true,
      data: student
    });

  } catch (error) {
    handleError(res, error, 'Failed to fetch student by admission ID');
  }
});

// 5. GET STUDENT BY ROLL NUMBER
router.get('/students/roll/:rollNumber',authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const student = await StudentAllocation.findOne({ 
      rollNumber: req.params.rollNumber 
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student with this roll number not found'
      });
    }

    res.json({
      success: true,
      data: student
    });

  } catch (error) {
    handleError(res, error, 'Failed to fetch student by roll number');
  }
});

// 6. UPDATE STUDENT ALLOCATION
router.put('/students/:id', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const allowedUpdates = [
      'name', 'section', 'class', 'totalCapacity', 'currentCapacity'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    const student = await StudentAllocation.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student allocation not found'
      });
    }

    res.json({
      success: true,
      message: 'Student allocation updated successfully',
      data: student
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }
    handleError(res, error, 'Failed to update student allocation');
  }
});

// 7. UPDATE CURRENT CAPACITY
router.patch('/students/:id/capacity', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const { currentCapacity } = req.body;

    if (typeof currentCapacity !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Current capacity must be a number'
      });
    }

    const student = await StudentAllocation.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student allocation not found'
      });
    }

    if (currentCapacity > student.totalCapacity) {
      return res.status(400).json({
        success: false,
        message: 'Current capacity cannot exceed total capacity'
      });
    }

    student.currentCapacity = currentCapacity;
    await student.save();

    res.json({
      success: true,
      message: 'Current capacity updated successfully',
      data: student
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }
    handleError(res, error, 'Failed to update current capacity');
  }
});

// 8. DELETE STUDENT ALLOCATION
router.delete('/students/:id', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const student = await StudentAllocation.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student allocation not found'
      });
    }

    res.json({
      success: true,
      message: 'Student allocation deleted successfully',
      data: student
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }
    handleError(res, error, 'Failed to delete student allocation');
  }
});

// 9. BULK CREATE STUDENT ALLOCATIONS
router.post('/students/bulk', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const { students } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Students array is required and must not be empty'
      });
    }

    const createdStudents = [];
    const errors = [];

    for (let i = 0; i < students.length; i++) {
      try {
        const student = new StudentAllocation(students[i]);
        const savedStudent = await student.save();
        createdStudents.push(savedStudent);
      } catch (error) {
        errors.push({
          index: i,
          data: students[i],
          error: error.message
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Successfully created ${createdStudents.length} student allocations`,
      data: {
        created: createdStudents,
        errors: errors,
        summary: {
          total: students.length,
          successful: createdStudents.length,
          failed: errors.length
        }
      }
    });

  } catch (error) {
    handleError(res, error, 'Failed to bulk create student allocations');
  }
});

// 10. GET STATISTICS
router.get('/students/stats/overview', authenticateToken, authorizeAdminCoordinator, async (req, res) => {
  try {
    const stats = await StudentAllocation.aggregate([
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          totalCapacity: { $sum: '$totalCapacity' },
          totalCurrentCapacity: { $sum: '$currentCapacity' },
          averageCapacityUtilization: {
            $avg: {
              $cond: [
                { $gt: ['$totalCapacity', 0] },
                { $divide: ['$currentCapacity', '$totalCapacity'] },
                0
              ]
            }
          }
        }
      }
    ]);

    const classStats = await StudentAllocation.aggregate([
      {
        $group: {
          _id: '$class',
          count: { $sum: 1 },
          totalCapacity: { $sum: '$totalCapacity' },
          currentCapacity: { $sum: '$currentCapacity' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const sectionStats = await StudentAllocation.aggregate([
      {
        $group: {
          _id: { class: '$class', section: '$section' },
          count: { $sum: 1 },
          totalCapacity: { $sum: '$totalCapacity' },
          currentCapacity: { $sum: '$currentCapacity' }
        }
      },
      { $sort: { '_id.class': 1, '_id.section': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalStudents: 0,
          totalCapacity: 0,
          totalCurrentCapacity: 0,
          averageCapacityUtilization: 0
        },
        byClass: classStats,
        bySection: sectionStats
      }
    });

  } catch (error) {
    handleError(res, error, 'Failed to fetch statistics');
  }
});

module.exports = router;