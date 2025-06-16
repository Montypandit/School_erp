const mongoose = require('mongoose');
const inquiryFormSchema =new mongoose.Schema({
    inquiryId:{type:String, required:true, unique:true},
    name:{type:String, required:true},
    dob:{type:Date},
    fatherName:{type:String, required:true},
    motherName:{type:String, required:true},
    city:{type:String, required:true},
    state:{type:String, required:true},
    pincode:{type:String, required:true},
    phone:{type:String, required:true}
},{timestamps:true});

const inquiryFormModel = mongoose.model('INQUIRYFORM',inquiryFormSchema);
module.exports = inquiryFormModel;

