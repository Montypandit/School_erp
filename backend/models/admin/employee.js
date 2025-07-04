const mongoose = require('mongoose')

const employee =new mongoose.Schema({
    empId:{type:String, required:true, unique:true},
    firstName:{type:String, required:true},
    lastName:{type:String},
    email:{type:String, unique:true},
    phone:{type:String, unique:true},
    gender:{type:String},
    dob:{type:Date},
    doj:{type:Date},
    qualification:{type:String},
    residentialAddress:{type:String},
    permanentAddress:{type:String},
    role:{type:String, required:true},
    aadharNo:{type:String},
    panNo:{type:String},
    passportNo:{type:String},
    salary:{type:Number},
    imageUrl:{type:String},
    password:{type:String},
    
},{timestamps:true});


const employeeModel = mongoose.model('EMPLOYEE',employee);
module.exports = employeeModel;