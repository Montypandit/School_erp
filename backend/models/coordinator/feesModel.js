const mongoose = require('mongoose');

const feesSchema = mongoose.Schema({
    recietId:{type:String, required:true, unique:true},
    admissionId:{type:String, required:true},
    name:{type:String, required:true},
    class:{type:String, required:true},
    fatherName:{type:String, required:true},
    gender:{type:String},
    registrationFees:{type:String},
    admissionFees:{type:String},
    annualCharges:{type:String},
    activityFees:{type:String},
    maintenanceFees:{type:String},
    tutionFees:{type:String}
},{timestamps:true});

const feesModel= mongoose.model('FEES',feesSchema);
module.exports = feesModel;