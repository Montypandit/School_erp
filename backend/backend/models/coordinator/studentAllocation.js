const mongoose = require('mongoose');

const StudentAllocationSchema = new mongoose.Schema({
  admissionId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    unique: true,
  },
  section: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  totalCapacity: {
    type: Number,
    required: true,
  },
  currentCapacity: {
    type: Number,
    default: 0,
  }
});

                                                    //FOR AUTOMATIC ROLL NUMBER.

StudentAllocationSchema.pre('save', async function (next) {
  if (!this.rollNumber) {
    const lastStudent = await mongoose
      .model('StudentAllocation')
      .findOne({})
      .sort({ rollNumber: -1 });

    let newRollNumber = lastStudent
      ? parseInt(lastStudent.rollNumber) + 1
      : 10000000;

    this.rollNumber = String(newRollNumber).padStart(8, '0');
  }
  next();
});

module.exports = mongoose.model('StudentAllocation', StudentAllocationSchema);
