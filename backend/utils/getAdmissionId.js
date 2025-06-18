const Counter = require('../models/others/counter');

async function getNextAdmissionId() {
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'admissionId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  // Pad with zeros to make it 3 digits
  const paddedSeq = String(counter.seq).padStart(3, '0');
  return `ADM${paddedSeq}`;
}

module.exports = getNextAdmissionId;