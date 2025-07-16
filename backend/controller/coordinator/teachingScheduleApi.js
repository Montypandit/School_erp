const express = require('express');
const router = express.Router();
const TeachingSchedule = require('../../models/coordinator/teachingSchedule');
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');
const { castObject } = require('../../models/loginModels/loginModel');

router.post('/create/teaching/schedule',authMiddleware, authorizeRoles('admin','coordinator'), async (req,res)=>{
    try {
        const { empId, empName, subject, className, section, day, startTime, endTime, roomNumber } = req.body;

        const newSchedule = new TeachingSchedule({
            empId:empId,
            empName:empName,
            subject:subject,
            className: className,
            section:section,
            day:day,
            startTime:startTime,
            endTime:endTime,
            roomNumber:roomNumber
        });

        await newSchedule.save();
        res.status(201).json({ message: 'Teaching schedule created successfully', schedule: newSchedule });
    } catch (error) {
        console.log('Error creating teaching schedule:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/get/teaching/schedule',authMiddleware, authorizeRoles('admin','coordinator'), async (req,res)=>{
    try{
        const schedules = await TeachingSchedule.find();
        if(!schedules){
            return res.status(404).json({message:"No teaching schedules found"});
        }

        res.status(200).json(schedules);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
});

router.get('/get/teaching/schedule/:empId',authMiddleware,authorizeRoles('admin','coordinator','teacher'), async (req,res)=>{
    try{
        console.log('I am accessed')
        const { empId } = req.params;
        const schedule = await TeachingSchedule.find({empId:empId});
        if(!schedule){
            return res.status(404).json({message:"No teaching schedule found"});
        }
        res.status(200).json(schedule);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
});

module.exports = router;