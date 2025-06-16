const express = require('express');
const server = express();
const port = 5000;
server.use(express.json());

const cors = require('cors');
server.use(cors());


const mongoose = require('mongoose');
const {mongoKey} = require('./config/db');






server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
mongoose.connect(mongoKey);
mongoose.connection.on('connected',()=>{
    console.log('MongoDB connection successfull');
});

mongoose.connection.on('error',()=>{
    console.log('MongoDB connection failed');
})