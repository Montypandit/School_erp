const Fees = require('../../models/coordinator/feesModel');


const createFee = async (req, res) => {
  try {
    const newFee = new Fees(req.body);
    const savedFee = await newFee.save();
    res.status(201).json(savedFee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const getAllFees = async (req, res) => {
  try {
    const fees = await Fees.find();
    res.status(200).json(fees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getFeeById = async (req, res) => {
  try {
    const fee = await Fees.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    res.status(200).json(fee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateFee = async (req, res) => {
  try {
    const updatedFee = await Fees.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedFee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const deleteFee = async (req, res) => {
  try {
    await Fees.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Fee record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createFee,
  getAllFees,
  getFeeById,
  updateFee,
  deleteFee,
};
