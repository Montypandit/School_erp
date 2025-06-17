const mongoose = require('mongoose');
const inquiryFormProcessSchema =new mongoose.Schema({
    inquiryId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    imageUrl:{type:String},
    fatherName: { type: String, required: true },
    motherName: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
    remarks:{type:String},
    previousClass:{type:String,required:true},
    currentClass:{type:String, required:true},
    schoolInfo: { type: Boolean, required: true },
    schoolVisit: { type: Boolean, required: true },
    aboutFees: { type: Boolean, required: true },
    educationPolicy:{type:Boolean, required:true},
    prospectus:{type:Boolean},
    formProceeded: { type: Boolean, required: true },
},{timestamps:true});

const InquiryFormProcess = mongoose.model('InquiryFormProcess', inquiryFormProcessSchema);
module.exports = InquiryFormProcess;