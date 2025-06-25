const mongoose = require('mongoose');

const admissionFeesSchema = new mongoose.Schema({
    receiptId: { type: String, required: true, unique: true },
    admissionId: { type: String, required: true, unique: true },
    registrationFees: { type: Number, default: 0 },
    admissionFees: { type: Number, default: 0 },
    annualCharges: { type: Number, default: 0 },
    activityFees: { type: Number, default: 0 },
    maintenanceFees: { type: Number, default: 0 },
    tutionFees: { type: Number, default: 0 },
    totalAdmissionFees:{type:Number, default:0},
    uniform:{type:Number, default:0},
    transport:{type:Number, default:0},
    books:{type:Number, default:0},
    totalPaidAmount:{type:Number, default:0},
    belt:{type:Number, default:0}
    
}, { timestamps: true });

const AdmissionFees = mongoose.model('AdmissionFees', admissionFeesSchema);

module.exports = AdmissionFees;