const express = require('express');
const router = express.Router();
const MonthlyPlanner = require('../../models/coordinator/monthlyPlanner');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');

// Create Monthly Plan
router.post('/create/monthly/planner', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const newPlan = new MonthlyPlanner(req.body);
    const savedPlan = await newPlan.save();
    res.status(201).json({ message: 'Monthly plan created', data: savedPlan });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create monthly plan', error: err.message });
  }
});

// Update Monthly Plan
router.put('/update/monthly-plan/by/:id', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const updatedPlan = await MonthlyPlanner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPlan) return res.status(404).json({ message: 'Monthly plan not found' });
    res.status(200).json({ message: 'Monthly plan updated', data: updatedPlan });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update monthly plan', error: err.message });
  }
});

// Get All Monthly Plans
router.get('/get/all/monthly/planners', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const plans = await MonthlyPlanner.find().sort({ startDate: 1 });
    res.status(200).json({ message: 'Monthly plans fetched', data: plans });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch monthly plans', error: err.message });
  }
});

// Get All Monthly Plans by Class
router.get('/get/monthly/plans/class/:className', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const { className } = req.params;
    const plans = await MonthlyPlanner.find({ class: className }).sort({ startDate: 1 });
    res.status(200).json({ message: 'Monthly plans for class fetched', data: plans });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch monthly plans for class', error: err.message });
  }
});

// Get Monthly Plan by ID
router.get('/get/monthly-plan/by/:id', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const plan = await MonthlyPlanner.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Monthly plan not found' });
    res.status(200).json({ data: plan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/delete/monthly/plan/by/:id', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const deletedPlan = await MonthlyPlanner.findByIdAndDelete(req.params.id);
    if (!deletedPlan) return res.status(404).json({ message: 'Monthly plan not found' });
    res.status(200).json({ message: 'Monthly plan deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete monthly plan', error: err.message });
  }
});
module.exports = router;
