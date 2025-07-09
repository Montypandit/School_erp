const mongoose = require('mongoose');

const admissionFormSchema =new  mongoose.Schema({
    applicationId:{type:String, required:true, unique:true},
    admissionId:{type:String, required:true, unique:true},
    inquiryId:{type:String, required:true, unique:true},
    rollNo:{type:String},
    name: { type: String, required: true },
    gender:{type:String, required:true},
    class:{type:String, required:true},
    dob:{type:Date},
    childImageUrl:{type:String},
    fatherImageUrl:{type:String},
    motherImageUrl:{type:String},
    fatherName:{type:String, required:true},
    fatherQualification:{type:String},
    fatherOccupation:{type:String},
    fatherMobile:{type:String},
    landLineNo:{type:String},
    motherQualification:{type:String},
    motherOccupation:{type:String},
    motherName:{type:String, required:true},
    motherMobile:{type:String},
    email:{type:String},
    residentialAddress:{type:String},
    transportFacility:{type:String, default:"No"},
    emergencyContactName:{type:String},
    emergencyContactPhoneNo:{type:String},
    doctorName:{type:String},
    doctorPhoneNo:{type:String},
    medicalCondition:{type:String},
    copyOfBirthCertificate:{type:Boolean},
    copyOfIdProof:{type:Boolean},
    photosOfStudent:{type:Boolean},
},{timestamps:true});

const AdmissionForm = mongoose.model('AdmissionForm', admissionFormSchema);
module.exports = AdmissionForm;