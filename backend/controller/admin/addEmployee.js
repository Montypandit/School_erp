const express = require('express');
const Employee = require('../../models/admin/employee'); 
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');
const router = express.Router();
//const getEmpCounter = require('../../utils/getEmpCounter');


const generateRandomEmpId = () => {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return 'EMP' + randomStr;
};
// Create Employee api
router.post('/create/employee', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const empId = generateRandomEmpId();
        const {
          firstName, lastName, email, phone, gender, dob, doj, qualification,
          residentalAddress, permanentAddress, role, aadharNo, panNo,
          passportNo, salary, imageUrl
        } = req.body;
    
        const newEmployee = new Employee({
          empId,
          firstName,
          lastName,
          email,
          phone,
          gender,
          dob,
          doj,
          qualification,
          residentalAddress,
          permanentAddress,
          role,
          aadharNo,
          panNo,
          passportNo,
          salary,
          imageUrl
        });
    
        const saved = await newEmployee.save();
        res.status(201).json({ message: 'Employee created successfully', data: saved });
    
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
});

// Get All Employees 
router.get('/get/all/employees', authMiddleware, authorizeRoles('admin','coordinator'), async (req, res) => {
  try {
    const all = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(all);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Get Single Employee by empId 
router.get('/get/employee/:empId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const employee = await Employee.findOne({ empId: req.params.empId });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get employee by email
router.get('/get/employee/email/:email', authMiddleware, authorizeRoles('admin','teacher'), async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.params.email });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    res.status(200).json(employee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Update Employee by empId 
router.put('/update/employee/:empId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const updated = await Employee.findOneAndUpdate(
      { empId: req.params.empId },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Employee not found' });

    res.status(200).json({ message: 'Employee updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Employee by empId 
router.delete('/delete/employee/:empId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const deleted = await Employee.findOneAndDelete({ empId: req.params.empId });

    if (!deleted) return res.status(404).json({ message: 'Employee not found' });

    res.status(200).json({ message: 'Employee deleted successfully', data: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
