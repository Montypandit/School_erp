const mongoose = require('mongoose');
const inquiryFormProcessSchema =new mongoose.Schema({
    inquiryId: { type: String, required: true, unique: true },
    remarks:{type:String},
    schoolInfo: { type: Boolean, required: true },
    schoolVisit: { type: Boolean, required: true },
    aboutFees: { type: Boolean, required: true },
    educationPolicy:{type:Boolean, required:true},
    prospectus:{type:Boolean},
    formProceeded: { type: Boolean, required: true },
},{timestamps:true});

const InquiryFormProcess = mongoose.model('InquiryFormProcess', inquiryFormProcessSchema);
module.exports = InquiryFormProcess;