const mongoose = require('mongoose');

const teachingScheduleSchema = new mongoose.Schema({
    empId:{type:String, required:true},
    empName:{type:String, required:true},
    subject:{type:String, required:true},
    className:{type:String, required:true},
    section:{type:String, required:true},
    day:{type:String, required:true},
    startTime:{type:String, required:true},
    endTime:{type:String, required:true},
    roomNumber:{type:String, required:true},
    
},{timestamps:true});

const TeachingSchedule = mongoose.model('TEACHINGSCHEDULE', teachingScheduleSchema);
module.exports = TeachingSchedule;