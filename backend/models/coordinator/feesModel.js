const mongoose = require('mongoose');

const feesSchema = mongoose.Schema({
  // Receipt and admission details
  receiptId: { type: String, required: true, unique: true },
  admissionId: { type: String, required: true, index: true },
  
  // Student information
  name: { type: String, required: true },
  class: { type: String, required: true },
  fatherName: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  
  // Standard monthly fee amount for this student
  monthlyFeeAmount: { type: Number, default: 0 },

  // Admission time fees (one-time payments)
  admissionTimeFees: {
    registrationFees: { type: Number, default: 0 },
    admissionFees: { type: Number, default: 0 },
    annualCharges: { type: Number, default: 0 },
    activityFees: { type: Number, default: 0 },
    maintenanceFees: { type: Number, default: 0 },
    tuitionFees: { type: Number, default: 0 },
    totalAdmissionFees: { type: Number, default: 0 },
    admissionFeesReceipt: { type: String }, // Receipt ID for admission fees
    admissionFeesPaidDate: { type: Date },
    isPaid: { type: Boolean, default: false }
  },

  // Monthly fee payments
  monthlyPayments: [
    {
      receiptId: { type: String, required: true },
      year: { type: Number, required: true },
      monthsPaid: [{ 
        type: String, 
        enum: ['January', 'February', 'March', 'April', 'May', 'June',
               'July', 'August', 'September', 'October', 'November', 'December'],
        required: true 
      }],
      amountPerMonth: { type: Number, required: true },
      totalAmount: { type: Number, required: true },
      paymentMethod: { 
        type: String, 
        enum: ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque'],
        default: 'Cash'
      },
      paymentDate: { type: Date, required: true },
      remarks: { type: String },
      createdBy: { type: String }, // User who recorded the payment
      status: { 
        type: String, 
        enum: ['Paid', 'Pending', 'Cancelled', 'Refunded'],
        default: 'Paid'
      }
    }
  ],

  // Additional fee types (extracurricular, exam fees, etc.)
  additionalFees: [
    {
      feeType: { type: String, required: true }, // e.g., 'Exam Fee', 'Sports Fee'
      amount: { type: Number, required: true },
      description: { type: String },
      dueDate: { type: Date },
      paidDate: { type: Date },
      receiptId: { type: String },
      status: { 
        type: String, 
        enum: ['Pending', 'Paid', 'Overdue'],
        default: 'Pending'
      }
    }
  ],

  // Fee summary and calculations
  feeSummary: {
    totalAdmissionFees: { type: Number, default: 0 },
    totalMonthlyFeesPaid: { type: Number, default: 0 },
    totalAdditionalFees: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    lastPaymentDate: { type: Date },
    monthlyFeesStatus: {
      type: String,
      enum: ['Up to Date', 'Pending', 'Overdue'],
      default: 'Pending'
    }
  },

  // Academic year and status
  academicYear: { type: String, required: true }, // e.g., '2024-25'
  status: { 
    type: String, 
    enum: ['Active', 'Inactive', 'Transferred', 'Graduated'],
    default: 'Active'
  },

  // Contact information for fee-related communications
  contactInfo: {
    parentPhone: { type: String },
    parentEmail: { type: String },
    address: { type: String }
  }

}, { 
  timestamps: true,
  // Add indexes for better query performance
  indexes: [
    { admissionId: 1 },
    { 'monthlyPayments.year': 1 },
    { 'monthlyPayments.monthsPaid': 1 },
    { academicYear: 1 },
    { status: 1 }
  ]
});

// Pre-save middleware to calculate totals
feesSchema.pre('save', function(next) {
  // Calculate total admission fees
  if (this.admissionTimeFees) {
    const admissionTotal = 
      (this.admissionTimeFees.registrationFees || 0) +
      (this.admissionTimeFees.admissionFees || 0) +
      (this.admissionTimeFees.annualCharges || 0) +
      (this.admissionTimeFees.activityFees || 0) +
      (this.admissionTimeFees.maintenanceFees || 0) +
      (this.admissionTimeFees.tuitionFees || 0);
    
    this.admissionTimeFees.totalAdmissionFees = admissionTotal;
    this.feeSummary.totalAdmissionFees = admissionTotal;
  }

  // Calculate total monthly fees paid
  const monthlyTotal = this.monthlyPayments.reduce((sum, payment) => {
    return sum + (payment.totalAmount || 0);
  }, 0);
  this.feeSummary.totalMonthlyFeesPaid = monthlyTotal;

  // Calculate total additional fees
  const additionalTotal = this.additionalFees.reduce((sum, fee) => {
    return sum + (fee.status === 'Paid' ? fee.amount : 0);
  }, 0);
  this.feeSummary.totalAdditionalFees = additionalTotal;

  // Calculate grand total
  this.feeSummary.grandTotal = 
    this.feeSummary.totalAdmissionFees + 
    this.feeSummary.totalMonthlyFeesPaid + 
    this.feeSummary.totalAdditionalFees;

  // Update last payment date
  const allPaymentDates = [
    ...this.monthlyPayments.map(p => p.paymentDate),
    ...this.additionalFees.filter(f => f.paidDate).map(f => f.paidDate)
  ].filter(date => date);

  if (allPaymentDates.length > 0) {
    this.feeSummary.lastPaymentDate = new Date(Math.max(...allPaymentDates.map(d => new Date(d))));
  }

  next();
});

// Instance methods
feesSchema.methods.addMonthlyPayment = function(paymentData) {
  this.monthlyPayments.push(paymentData);
  return this.save();
};

feesSchema.methods.getMonthsPaidInYear = function(year) {
  const payments = this.monthlyPayments.filter(payment => payment.year === year);
  const monthsPaid = new Set();
  
  payments.forEach(payment => {
    payment.monthsPaid.forEach(month => monthsPaid.add(month));
  });
  
  return Array.from(monthsPaid);
};

feesSchema.methods.getPendingMonthsInYear = function(year) {
  const allMonths = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
  const paidMonths = this.getMonthsPaidInYear(year);
  return allMonths.filter(month => !paidMonths.includes(month));
};

feesSchema.methods.getTotalFeesPaidInYear = function(year) {
  return this.monthlyPayments
    .filter(payment => payment.year === year)
    .reduce((sum, payment) => sum + payment.totalAmount, 0);
};

// Static methods
feesSchema.statics.findByAdmissionId = function(admissionId) {
  return this.findOne({ admissionId }).exec();
};

feesSchema.statics.getStudentsByFeeStatus = function(status) {
  return this.find({ 'feeSummary.monthlyFeesStatus': status }).exec();
};

feesSchema.statics.getMonthlyCollectionReport = function(year, month) {
  return this.aggregate([
    { $unwind: '$monthlyPayments' },
    { 
      $match: { 
        'monthlyPayments.year': year,
        'monthlyPayments.monthsPaid': month
      }
    },
    {
      $group: {
        _id: null,
        totalCollection: { $sum: '$monthlyPayments.totalAmount' },
        totalStudents: { $sum: 1 },
        payments: { $push: '$monthlyPayments' }
      }
    }
  ]);
};

const feesModel = mongoose.model('FEES', feesSchema);
module.exports = feesModel;