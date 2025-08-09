const express = require('express');
const router = express.Router();
const ActivityPlanner = require('../../models/coordinator/Activityplanner');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');

//  POST: Create Activity
router.post('/create/new/activity', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const activity = new ActivityPlanner(req.body);
    await activity.save();
    res.status(201).json({ message: 'Activity created successfully', data: activity });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Failed to create activity', error: error.message });
  }
});

//  PUT: Update Activity
router.put('/update/activity/:id', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const activity = await ActivityPlanner.findByIdAndUpdate({_id:req.params.id}, req.body, { new: true });
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    res.status(200).json({ message: 'Activity updated successfully', data: activity });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update activity', error: error.message });
  }
})

//  GET: All Activities
router.get('/get/all/activities', authMiddleware, authorizeRoles('admin', 'coordinator', 'teacher', 'principal'), async (req, res) => {
  try {
    const activities = await ActivityPlanner.find().sort({ startDate: 1 });
    res.status(200).json({ data: activities });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch activities', error: error.message });
  }
});


// Get activities by class and section
router.get('/get/activities/class/:className/section/:section', authMiddleware, authorizeRoles('admin', 'coordinator', 'teacher', 'principal'), async (req, res) => {
  try {
    const { className, section } = req.params;
    const activities = await ActivityPlanner.find({ class: className, section }).sort({ startDate: 1 });
    res.status(200).json({ data: activities });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch activities for class and section', error: error.message });
  }
});
//  GET: Activity by ID
router.get('/get/activity/by/:id', authMiddleware, authorizeRoles('admin', 'coordinator', 'teacher', 'principal'), async (req, res) => {
  try {
    const activity = await ActivityPlanner.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    res.status(200).json({ data: activity });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch activity', error: error.message });
  }
});
// DELETE: Delete Activity by ID
router.delete('/delete/activity/:id', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const activity = await ActivityPlanner.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.status(200).json({ message: 'Activity deleted successfully', data: activity });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete activity', error: error.message });
  }
});

module.exports = router;
