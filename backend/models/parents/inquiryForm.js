const mongoose = require('mongoose');
const inquiryFormSchema =new mongoose.Schema({
    inquiryId:{type:String, required:true, unique:true},
    name:{type:String, required:true},
    currentClass:{type:String, required:true},
    dob:{type:Date},
    gender:{type:String, required:true},
    fatherName:{type:String, required:true},
    fatherQualification:{type:String},
    fatherOccupation:{type:String},
    fatherPhoneNo:{type:String},
    fatherEmail:{type:String},
    motherPhoneNo:{type:String},
    motherEmail:{type:String},
    motherQualification:{type:String},
    motherOccupation:{type:String},
    motherName:{type:String, required:true},
    residentialAddress:{type:String},
    haveYouVisitedOurWebsite:{type:Boolean},
    howDoYouKnowAboutSUNVILLEKIDZ:{type:String},
    references:{type:String},
    doYouHaveSiblings:{type:Boolean},
    siblings:[
        {
            name:{type:String},
            age:{type:String}
        }
    ]
},{timestamps:true});

const inquiryFormModel = mongoose.model('INQUIRYFORM',inquiryFormSchema);
module.exports = inquiryFormModel;

