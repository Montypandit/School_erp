const express = require('express');
const router = express.Router();
const {
  createFee,
  getAllFees,
  getFeeById,
  updateFee,
  deleteFee,
} = require('../controller/coordinator/feesController');

router.post('/', createFee);           
router.get('/', getAllFees);           
router.get('/:id', getFeeById);        
router.put('/:id', updateFee);         
router.delete('/:id', deleteFee);      

module.exports = router;
