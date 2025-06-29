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
  alloted:{type: Boolean, default: false},
  academicYear:{type:String, required:true}
}, {timestamps:true});



module.exports = mongoose.model('StudentAllocation', StudentAllocationSchema);
