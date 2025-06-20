const mongoose = require('mongoose');

const feesSchema = mongoose.Schema({
  recietId: { type: String, required: true, unique: true },
  admissionId: { type: String, required: true },
  name: { type: String, required: true },
  class: { type: String, required: true },
  fatherName: { type: String, required: true },
  gender: { type: String },

  // Admission time fees
  registrationFees: { type: String },
  admissionFees: { type: String },
  annualCharges: { type: String },
  activityFees: { type: String },
  maintenanceFees: { type: String },
  tutionFees: { type: String },

  // Recurring fee payments
  recurringPayments: [
    {
      periodType: { type: String, enum: ['Monthly', 'Quarterly'], required: true },
      monthOrQuarter: { type: String, required: true }, // e.g., 'June 2025' or 'Q1 2025'
      amountPaid: { type: Number, required: true },
      datePaid: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const feesModel = mongoose.model('FEES', feesSchema);
module.exports = feesModel;
