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
const feesRoutes = require('./routes/feesRoutes'); // ✅ Fees API import
const addEmployee = require('./controller/admin/addEmployee');

// Use APIs
server.use(userLoginApi);
server.use(inquiryApi);
server.use(inquiryProcessRouter);
server.use(admissionApprovalApi);
server.use('/api/fees', feesRoutes); // ✅ Mounting fees API
server.use(addEmployee);

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
