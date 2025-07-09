const mongoose = require('mongoose');

const studentStatusSchema = new mongoose.Schema({
    admissionId:{type:String, required:true, unique:true},
    status:{type:String,required:true, default:'Active'},
    leaveDate:{type:String},
    leaveType:{type:String},
    leaveReason:{type:String},
    remarks:{type:String},
},{timestamps:true});

const StudentStatus = mongoose.model('StudentStatus',studentStatusSchema);
module.exports = StudentStatus;