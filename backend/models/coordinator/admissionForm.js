const mongoose = require('mongoose');

const admissionFormSchema = mongoose.Schema({
    admissionId:{type:String, required:true, unique:true},
    inquiryId:{type:String, required:true, unique:true},
    name: { type: String, required: true },
    imageUrl:{type:String},
    fatherName: { type: String, required: true },
    motherName: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
    class:{type:String, required:true},
    section:{type:String},
});

const AdmissionForm = mongoose.model('AdmissionForm', admissionFormSchema);
module.exports = AdmissionForm;