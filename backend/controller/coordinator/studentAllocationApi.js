const express = require('express');
const router = express.Router();
const StudentAllocation = require('../../models/coordinator/studentAllocation');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');

// ✅ Helper: Get next roll number for a given class-section
const getNextRollNo = async (className, section) => {
  const lastStudent = await StudentAllocation
    .find({ class: className, section })
    .sort({ createdAt: -1 }) // latest first
    .limit(1);

  if (lastStudent.length === 0) return '01'; // first roll number
  const lastRoll = parseInt(lastStudent[0].rollNo);
  const nextRoll = lastRoll + 1;

  return nextRoll.toString().padStart(2, '0'); // pad 01, 02...
};

// ✅ POST: Allocate student with auto rollNo
router.post('/create/student/allocation', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const { admissionId, class: className, section, academicYear } = req.body;

    // check duplicate admission
    const exists = await StudentAllocation.findOne({ admissionId });
    if (exists) {
      return res.status(400).json({ message: 'Student already allocated' });
    }

    // ✅ Generate new roll no
    const rollNo = await getNextRollNo(className, section);
    if (!rollNo) return res.status(500).json({ message: 'Roll number generation failed' });

    const newStudent = new StudentAllocation({
      admissionId,
      class: className,
      section,
      academicYear,
      rollNo,
      alloted: true
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student allocated successfully', data: newStudent });
  } catch (error) {
    res.status(400).json({ message: 'Allocation failed', error: error.message });
  }
});

// ✅ GET: All student allocations
router.get('/get/all/student/allocations', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const records = await StudentAllocation.find().sort({ createdAt: -1 });
    res.status(200).json({ data: records });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch records', error: error.message });
  }
});

// ✅ GET: Allocation by admissionId
router.get('/get/student/allocation/by/:admissionId', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try {
    const record = await StudentAllocation.findOne({ admissionId: req.params.admissionId });
    if (!record) return res.status(404).json({ message: 'Allocation not found' });
    res.status(200).json({ data: record });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch allocation', error: error.message });
  }
});

// Get number of student class wise and section wise
router.get('/get/student/class/section/count/:className/:section', authMiddleware, authorizeRoles('admin', 'coordinator'), async (req, res) => {
  try{
      const { className, section } = req.params;
      const count = await StudentAllocation.countDocuments({ class: className, section:section });
      res.status(200).json({ data: count });
  }catch(error){
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch count', error: error.message });
  }
})

module.exports = router;
