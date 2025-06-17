const mongoose = require('mongoose');

const admissionApprovalSchema = new mongoose.Schema({
    admissionId:{type:String, required:true, unique:true},
    inquiryId:{type:String, required:true, unique:true},
    admissionApproved:{type:String, default:'Pending'}
},{timestamps:true});

const AdmissionApproval = mongoose.model('AdmissionApproval', admissionApprovalSchema);

module.exports = AdmissionApproval;