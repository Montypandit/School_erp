const mongoose = require('mongoose');

const teachingScheduleSchema = new mongoose.Schema({
    empId:{type:String, required:true},
    empName:{type:String, required:true},
    subject:{type:String},
    className:{type:String, required:true},
    section:{type:String, required:true},
    day:{type:String},
    startTime:{type:String},
    endTime:{type:String},
    roomNumber:{type:String},
    
},{timestamps:true});

const TeachingSchedule = mongoose.model('TEACHINGSCHEDULE', teachingScheduleSchema);
module.exports = TeachingSchedule;