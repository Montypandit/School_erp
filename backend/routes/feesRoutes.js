const express = require('express');
const router = express.Router();
const {
  createFees,
  getAllFees,
  getSingleFee,
  updateFee,
  deleteFee
} = require('../controller/coordinator/feesController');

const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRules');


router.post('/create/fees', authMiddleware, authorizeRoles('admin', 'coordinator'), createFees);
router.get('/get/all/fees', authMiddleware, authorizeRoles('admin', 'coordinator'), getAllFees);
router.get('/get/fees/:id', authMiddleware, authorizeRoles('admin', 'coordinator'), getSingleFee);
router.put('/update/fees/:id', authMiddleware, authorizeRoles('admin', 'coordinator'), updateFee);
router.delete('/delete/fees/:id', authMiddleware, authorizeRoles('admin'), deleteFee);

module.exports = router;
