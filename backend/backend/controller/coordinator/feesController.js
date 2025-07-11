const Fees = require('../../models/coordinator/feesModel');

// 📌 Create fees (initial admission-time fee only)
const createFees = async (req, res) => {
  try {
    const newFee = new Fees(req.body); // Make sure body matches schema
    const savedFee = await newFee.save();
    res.status(201).json({ message: 'Fees created successfully', data: savedFee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get all fees (with admission + recurring)
const getAllFees = async (req, res) => {
  try {
    const fees = await Fees.find().sort({ createdAt: -1 });
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get a single fee by _id
const getSingleFee = async (req, res) => {
  try {
    const fee = await Fees.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    res.status(200).json(fee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Update admission-time fees
const updateFee = async (req, res) => {
  try {
    const updated = await Fees.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Fee record not found' });
    res.status(200).json({ message: 'Fee updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Delete fee record
const deleteFee = async (req, res) => {
  try {
    const deleted = await Fees.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Fee record not found' });
    res.status(200).json({ message: 'Fee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ NEW: Add a recurring fee payment (monthly/quarterly)
const addRecurringPayment = async (req, res) => {
  try {
    const { admissionId, periodType, monthOrQuarter, amountPaid } = req.body;

    if (!admissionId || !periodType || !monthOrQuarter || !amountPaid) {
      return res.status(400).json({ message: 'All recurring payment fields are required' });
    }

    const updated = await Fees.findOneAndUpdate(
      { admissionId },
      {
        $push: {
          recurringPayments: {
            periodType,
            monthOrQuarter,
            amountPaid,
            datePaid: new Date()
          }
        }
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Admission not found' });

    res.status(200).json({ message: 'Recurring payment added', data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createFees,
  getAllFees,
  getSingleFee,
  updateFee,
  deleteFee,
  addRecurringPayment
};
