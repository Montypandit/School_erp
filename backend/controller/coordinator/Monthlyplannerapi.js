const express = require('express');
const router = express.Router();
const MonthlyPlanner = require('../../models/coordinator/Monthlyplanner'); 
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

const authorizeAdminCoordinator = (req, res, next) => {
  const allowedRoles = ['admin', 'coordinator'];
  if (allowedRoles.includes(req.user.userType)) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Only admin/coordinator allowed' });
  }
};


router.post('/Monthlyplanner', authenticateToken, authorizeAdminCoordinator, async (req, res) => {
  try {
    const newPlan = new MonthlyPlanner(req.body);
    const saved = await newPlan.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/Monthlyplanner', authenticateToken, async (req, res) => {
  try {
    const plans = await MonthlyPlanner.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/Monthlyplanner/:id', authenticateToken, async (req, res) => {
  try {
    const plan = await MonthlyPlanner.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Monthly plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/Monthlyplanner/:id', authenticateToken, authorizeAdminCoordinator, async (req, res) => {
  try {
    const updated = await MonthlyPlanner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Monthly plan not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete('/Monthlyplanner/:id', authenticateToken, authorizeAdminCoordinator, async (req, res) => {
  try {
    const deleted = await MonthlyPlanner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Monthly plan not found' });
    res.json({ message: 'Monthly plan deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
