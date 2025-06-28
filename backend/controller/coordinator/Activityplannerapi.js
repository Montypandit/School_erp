const express = require('express');
const router = express.Router();
const ActivityPlanner = require('../../models/coordinator/Activityplanner');
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


router.post('/activities', authenticateToken, authorizeAdminCoordinator, async (req, res) => {
  try {
    const newActivity = new ActivityPlanner(req.body);
    const saved = await newActivity.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/activities', authenticateToken, async (req, res) => {
  try {
    const activities = await ActivityPlanner.find();
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/activities/:id', authenticateToken, async (req, res) => {
  try {
    const activity = await ActivityPlanner.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/activities/:id', authenticateToken, authorizeAdminCoordinator, async (req, res) => {
  try {
    const updated = await ActivityPlanner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Activity not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete('/activities/:id', authenticateToken, authorizeAdminCoordinator, async (req, res) => {
  try {
    const deleted = await ActivityPlanner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Activity not found' });
    res.json({ message: 'Activity deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
