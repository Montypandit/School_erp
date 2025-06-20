const Fees = require('../../models/coordinator/feesModel');


const createFees = async (req, res) => {
  try {
    const newFee = new Fees(req.body);
    const savedFee = await newFee.save();
    res.status(201).json({ message: 'Fees created successfully', data: savedFee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getAllFees = async (req, res) => {
  try {
    const fees = await Fees.find().sort({ createdAt: -1 });
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getSingleFee = async (req, res) => {
  try {
    const fee = await Fees.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee not found' });
    res.status(200).json(fee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateFee = async (req, res) => {
  try {
    const updated = await Fees.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Fee not found' });
    res.status(200).json({ message: 'Fee updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteFee = async (req, res) => {
  try {
    const deleted = await Fees.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Fee not found' });
    res.status(200).json({ message: 'Fee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createFees,
  getAllFees,
  getSingleFee,
  updateFee,
  deleteFee
};
