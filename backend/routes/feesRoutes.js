const express = require('express');
const router = express.Router();

// Import controller functions (based on your actual implementation)
const {
  createFees,
  getAllFees,
  getStudentByAdmissionId,
  getSingleFee,
  updateFee,
  deleteFee,
  addMonthlyPayment,
  addAdditionalFee,
  getMonthlyCollectionReport,
  getFeeDefaulters
} = require('../controller/coordinator/feesController');

// Import middleware
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRules');

// ========================================
// 🎓 BASIC FEE MANAGEMENT ROUTES
// ========================================

// Create new fee record (admission-time fee setup)
router.post('/create/fees', 
  authMiddleware, 
  authorizeRoles('admin', 'coordinator'), 
  createFees
);

// Get all fees with optional filtering (academicYear, status, class)
router.get('/get/all/fees', 
  authMiddleware, 
  authorizeRoles('admin', 'coordinator', 'accountant'), 
  getAllFees
);

// Get single fee record by database ID
router.get('/get/fees/:id', 
  authMiddleware, 
  authorizeRoles('admin', 'coordinator', 'accountant'), 
  getSingleFee
);

// Update admission-time fees by database ID
router.put('/update/fees/:id', 
  authMiddleware, 
  authorizeRoles('admin', 'coordinator'), 
  updateFee
);

// Delete fee record by database ID
router.delete('/delete/fees/:id', 
  authMiddleware, 
  authorizeRoles('admin'), 
  deleteFee
);

// ========================================
// 🔍 STUDENT LOOKUP ROUTES
// ========================================

// Get student details by admission ID (for React component)
router.get('/student/:admissionId', 
  authMiddleware, 
  authorizeRoles('admin', 'coordinator', 'accountant', 'student'), 
  getStudentByAdmissionId
);

// ========================================
// 💳 PAYMENT PROCESSING ROUTES
// ========================================

// Add monthly fee payment with receipt generation
router.post('/add/monthly/payment', 
  authMiddleware, 
  authorizeRoles('admin', 'coordinator'), 
  addMonthlyPayment
);

// Add additional fees (exam fee, sports fee, etc.)
router.post('/add/additional/fee', 
  authMiddleware, 
  authorizeRoles('admin', 'coordinator'), 
  addAdditionalFee
);

// ========================================
// 📊 REPORTS & ANALYTICS ROUTES
// ========================================

// Get monthly collection report (requires year and month query params)
router.get('/reports/monthly/collection', 
  authMiddleware, 
  authorizeRoles('admin', 'coordinator', 'accountant'), 
  getMonthlyCollectionReport
);

// Get fee defaulters list (students with pending payments)
router.get('/reports/defaulters', 
  authMiddleware, 
  authorizeRoles('admin', 'coordinator', 'accountant'), 
  getFeeDefaulters
);

// ========================================
// 🎯 SPECIFIC QUERY ROUTES
// ========================================

// Get fees by academic year (using query parameter)
router.get('/academic-year/:year', 
  authMiddleware, 
  authorizeRoles('admin', 'coordinator', 'accountant'), 
  (req, res, next) => {
    req.query.academicYear = req.params.year;
    next();
  },
  getAllFees
);

// Get fees by class (using query parameter)
router.get('/class/:className', 
  authMiddleware, 
  authorizeRoles('admin', 'coordinator', 'accountant'), 
  (req, res, next) => {
    req.query.class = req.params.className;
    next();
  },
  getAllFees
);

// Get fees by status (using query parameter)
router.get('/status/:status', 
  authMiddleware, 
  authorizeRoles('admin', 'coordinator', 'accountant'), 
  (req, res, next) => {
    req.query.status = req.params.status;
    next();
  },
  getAllFees
);

// ========================================
// 📋 ADDITIONAL UTILITY ROUTES
// ========================================

// Get current academic year
router.get('/utils/current-academic-year', 
  authMiddleware, 
  authorizeRoles('admin', 'coordinator', 'accountant'), 
  (req, res) => {
    const getCurrentAcademicYear = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      
      if (month >= 4) {
        return `${year}-${(year + 1).toString().slice(-2)}`;
      } else {
        return `${year - 1}-${year.toString().slice(-2)}`;
      }
    };
    
    res.status(200).json({ 
      academicYear: getCurrentAcademicYear(),
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1
    });
  }
);

// Validate admission ID exists
router.get('/validate/admission/:admissionId', 
  authMiddleware, 
  authorizeRoles('admin', 'coordinator'), 
  async (req, res) => {
    try {
      const { admissionId } = req.params;
      const Fees = require('../../models/coordinator/feesModel');
      
      const exists = await Fees.findOne({ admissionId });
      res.status(200).json({ 
        exists: !!exists,
        admissionId,
        message: exists ? 'Admission ID found' : 'Admission ID not found'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ========================================
// 🔄 LEGACY ROUTES (for backward compatibility)
// ========================================

// Legacy recurring payment route (kept for compatibility)
router.put('/add/recurring/payment', 
  authMiddleware, 
  authorizeRoles('admin', 'coordinator'), 
  addMonthlyPayment // Using the same function as monthly payment
);

module.exports = router;