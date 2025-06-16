const express = require('express');
const server = express();
const port = 5000;
server.use(express.json());

const cors = require('cors');
server.use(cors());

const mongoose = require('mongoose');
const { mongoKey } = require('./config/db');

// Import APIs
const userLoginApi = require('./controller/loginApi');
const inquiryApi = require('./controller/parent/inquiryFormApi'); //  Your Inquiry API

// Use APIs
server.use(userLoginApi);
server.use(inquiryApi); // Mount all inquiry routes

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
