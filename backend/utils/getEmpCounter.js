const empCounter = require('../models/others/empCounter');

async function getEmpCounter() {
  const counter = await empCounter.findByIdAndUpdate(
    { _id: 'empId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  // Pad with zeros to make it 3 digits
  const paddedSeq = String(counter.seq).padStart(3, '0');
  return `EMP${paddedSeq}`;
}

module.exports = getEmpCounter;