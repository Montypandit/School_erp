const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');
const express = require('express');
const router = express.Router();
const StudentPromotion = require('../../models/principal/studentPromotion');

// post promoted student data
router.post('/student/promotion', authMiddleware, authorizeRoles('admin', 'principal'), async (req, res) => {
    try {
        const data = req.body;
        const studentData = new StudentPromotion(data);
        await studentData.save();
        res.status(200).json({ data: studentData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// get all promoted student data
router.get('/get/all/promoted/students', authMiddleware, authorizeRoles('admin', 'principal', 'coordinator'), async (req, res) => {
    try {
        const data = await StudentPromotion.find();
        res.status(200).json({ data: data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.get('/get/promoted/student/:admissionId',authMiddleware,authorizeRoles('admin','principal','coordinator'), async(req,res)=>{
    try{
        const admissionId = req.params.admissionId;
        const data = await StudentPromotion.find({admissionId:admissionId});
        res.status(200).json({data:data});
    }catch(error){
        console.log(error);
        res.status(500).json({message:'Internal server error', error:error.message});
    }
});

module.exports = router;