const express = require('express');
const LeaveRequest = require('../../models/admin/leavemodel');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');
const router = express.Router();

// Generate custom leaveId
const generateLeaveId = () => {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return 'LEAVE' + rand;
};

// Create Leave Request (Student or Admin)
router.post('/create/leave', authMiddleware, async (req, res) => {
  try {
    const leaveId = generateLeaveId();
    const {
      studentName,
      studentId,
      leaveType,
      startDate,
      endDate,
      reason,
    } = req.body;

    const newLeave = new LeaveRequest({
      leaveId,
      studentName,
      studentId,
      leaveType,
      startDate,
      endDate,
      reason,
      submittedAt: new Date(),
      status: 'pending',
    });

    const saved = await newLeave.save();
    res.status(201).json({ message: 'Leave request submitted successfully', data: saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Leave Requests (Admin Only)
router.get('/get/all/leaves', authMiddleware, authorizeRoles('admin','principal'), async (req, res) => {
  try {
    const allLeaves = await LeaveRequest.find().sort({ submittedAt: -1 });
    res.status(200).json(allLeaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Single Leave Request by leaveId
router.put('/update/leave/:id', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
      const { status } = req.body;
      const updatedLeave = await LeaveRequest.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
  
      if (!updatedLeave) return res.status(404).json({ message: 'Leave request not found' });
  
      res.status(200).json({ message: 'Leave status updated', data: updatedLeave });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
// Delete Single Leave Request by leaveId
router.delete('/delete/leave/:leaveId', authMiddleware, authorizeRoles('admin','principal'), async (req, res) => {
  try {
    const deleted = await LeaveRequest.findOneAndDelete({ leaveId: req.params.leaveId });

    if (!deleted) return res.status(404).json({ message: 'Leave request not found' });

    res.status(200).json({ message: 'Leave request deleted successfully', data: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
