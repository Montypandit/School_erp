const express = require('express');
const router = express.Router();
const PTM = require('../../models/teacher/ptmSchema');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');

// ✅ Helper to generate a unique meeting ID
const generateMeetingId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 7);
  return `PTM-${timestamp}-${randomPart}`.toUpperCase();
};

// ✅ POST: Schedule PTM for multiple students
router.post('/schedule', authMiddleware, authorizeRoles('admin', 'coordinator', 'teacher'), async (req, res) => {
  try {
    const { students, class: className, section, scheduledDate, title, description, venue, remarks } = req.body;

    const ptm = new PTM({
      meetingId: generateMeetingId(),
      scheduledBy: req.user._id,
      class: className,
      section,
      students,
      scheduledDate,
      title,
      description,
      venue,
      remarks
    });

    await ptm.save();
    res.status(201).json({ message: 'PTM scheduled successfully', data: ptm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to schedule PTM', error: error.message });
  }
});

// ✅ GET: All PTMs (for admin/coordinator/teacher)
router.get('/get/all/ptm', authMiddleware, authorizeRoles('admin', 'coordinator', 'teacher'), async (req, res) => {
  try {
    const filter = {};
    if (req.query.class) filter.class = req.query.class;
    if (req.query.section) filter.section = req.query.section;

    const ptms = await PTM.find(filter).sort({ scheduledDate: -1 });
    res.status(200).json({ data: ptms });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch PTMs', error: error.message });
  }
});

// ✅ PUT: Update PTM status for a student (complete or reject)
router.put('/update/ptm/status/:ptmId/:admissionId', authMiddleware, authorizeRoles('teacher'), async (req, res) => {
  try {
    const { ptmId, admissionId } = req.params;
    const { status, feedback, rejectionReason } = req.body;

    const ptm = await PTM.findById(ptmId);
    if (!ptm) return res.status(404).json({ message: 'PTM not found' });

    const student = ptm.students.find(s => s.admissionId === admissionId);
    if (!student) return res.status(404).json({ message: 'Student not found in PTM' });

    student.status = status;
    if (status === 'completed') student.feedback = feedback;
    if (status === 'rejected') student.rejectionReason = rejectionReason;

    await ptm.save();
    res.status(200).json({ message: 'Student PTM status updated', data: ptm });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update PTM status', error: error.message });
  }
});

module.exports = router;
