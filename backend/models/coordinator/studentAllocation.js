const mongoose = require('mongoose');

const StudentAllocationSchema = new mongoose.Schema({
  admissionId: {
    type: String,
    required: true,
    unique: true,
  },
  section: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D'],
  },
  class:{type:String, required:true},
  rollNo:{type:String, required:true},
  academicYear:{type:String, required:true},
  alloted:{type: Boolean, default: false},
}, {timestamps:true});



module.exports = mongoose.model('StudentAllocation', StudentAllocationSchema);
