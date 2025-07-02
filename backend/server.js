const express = require('express');
const server = express();
const port = 5000;

// Middleware
server.use(express.json());

const bodyParser = require('body-parser');
server.use(bodyParser.json());

const cors = require('cors');
server.use(cors());

const mongoose = require('mongoose');
const { mongoKey } = require('./config/db');

// Import APIs
const userLoginApi = require('./controller/loginApi');
const inquiryApi = require('./controller/parent/inquiryFormApi'); 
const inquiryProcessRouter = require('./controller/coordinator/inquiryFormProcessApi');
const admissionApprovalApi = require('./controller/principal/admissionApproval');
const feesRoutes = require('./routes/feesRoutes'); // ✅ Fees API
const addEmployeeRoutes = require('./controller/admin/addEmployee'); // ✅ Employee API
const finalAdmission = require('./controller/coordinator/admission');
const studentAllocationApi = require('./controller/coordinator/studentAllocationApi');
const teacherRoutes = require('./controller/teacher/teacherapi');
const studentRoutes = require('./controller/student/studentapi');
const admissionFees = require('./controller/coordinator/admissionFeesApi')
const examScheduleApi = require('./controller/admin/examScheduleapi');
const leaveApi = require('./controller/admin/leaveApi');
const scheduleApi = require('./controller/scheduleApi');
const activityPlannerRoutes = require('./controller/coordinator/Activityplannerapi');
const monthlyPlannerRoutes = require('./controller/coordinator/Monthlyplannerapi');
const teachingSchedule = require('./controller/coordinator/teachingScheduleApi');
const homeworkRoutes = require('./controller/teacher/homeworkapi');
const ptmApi = require('./controller/teacher/ptmApi');
const examResult = require('./controller/teacher/examResult'); // ✅ Exam Result API

// Use APIs (with consistent route prefix)
server.use('/api/auth', userLoginApi);
server.use('/api/inquiry', inquiryApi);
server.use('/api/inquiry-process', inquiryProcessRouter);
server.use('/api/admissions', admissionApprovalApi);
server.use('/api/fees', feesRoutes);
server.use('/api/employees', addEmployeeRoutes);
server.use('/api/final/admission', finalAdmission);
server.use('/api/student/allocation', studentAllocationApi);
server.use('/api/teachers', teacherRoutes);
server.use('/api/students', studentRoutes);
server.use('/api/admission/fees',admissionFees);
server.use('/api/exams', examScheduleApi);
server.use('/api/leaves', leaveApi);
server.use('/api/schedules',  scheduleApi);
server.use('/api/activity/planner', activityPlannerRoutes);
server.use('/api/monthly/planner', monthlyPlannerRoutes);
server.use('/api/coordinator/students/allocate', studentAllocationApi);
server.use('/api/teaching/schedule',teachingSchedule);
server.use('/api/homework/for/students', homeworkRoutes);
server.use('/api/ptm',ptmApi);


server.use('/api/teacher/results', examResult);
// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// MongoDB connection
mongoose.connect(mongoKey);
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection successful');
});
mongoose.connection.on('error', () => {
  console.log('MongoDB connection failed');
});
