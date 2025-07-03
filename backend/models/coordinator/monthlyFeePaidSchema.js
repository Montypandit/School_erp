const mongoose = require('mongoose');

const monthlyPaymentSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  paidOn: {
    type: Date,
    default: Date.now,
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'UPI', 'Bank Transfer', 'Card'],
    required: true,
  },
  remarks:{type:String, default:''}
});

const studentFeeSchema = new mongoose.Schema({
  admissionId: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    required: true,
  },
  section:{
    type:String,
    required:true
  },
  totalFee: {
    type: Number,
    required: true,
  },
  monthlyFee: {
    type: Number,
    required: true,
  },
  paymentStartMonth: {
    type: String, 
    required: true,
  },
  paymentStartYear: {
    type: Number,
    required: true,
  },
  payments: [monthlyPaymentSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('StudentFee', studentFeeSchema);
