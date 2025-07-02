const mongoose = require('mongoose');

const ptmSchema = new mongoose.Schema({
    admissionId: { type: String, required: true },
    meetingId:{type:String, required:true, unique:true},
    title: { type: String, required: true },
    description: { type: String, required: true },
    scheduleDate:{type:Date, required:true},
    scheduleTime:{type:String, required:true},
    venue:{type:String},
    remarks:{type:String},
    attendBy:{type:String, required:true},
    attendiesPhoneNo:{type:String},
    meetingStatus:{type:String, required:true},

},{timestamps:true} );

module.exports = mongoose.model('PTM', ptmSchema);
