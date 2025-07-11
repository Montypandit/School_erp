const express = require('express');
const router = express.Router();
const {
  createFees,
  getAllFees,
  getSingleFee,
  updateFee,
  deleteFee,
  addRecurringPayment, // ✅ NEW
} = require('../controller/coordinator/feesController');

const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRules');

// 🎓 Admission-time fee operations
router.post('/create/fees', authMiddleware, authorizeRoles('admin', 'coordinator'), createFees);
router.get('/get/all/fees', authMiddleware, authorizeRoles('admin', 'coordinator'), getAllFees);
router.get('/get/fees/:id', authMiddleware, authorizeRoles('admin', 'coordinator'), getSingleFee);
router.put('/update/fees/:id', authMiddleware, authorizeRoles('admin', 'coordinator'), updateFee);
router.delete('/delete/fees/:id', authMiddleware, authorizeRoles('admin'), deleteFee);

// 💳 Recurring fee payment route (monthly/quarterly)
router.put('/add/recurring/payment', authMiddleware, authorizeRoles('admin', 'coordinator'), addRecurringPayment);

module.exports = router;
