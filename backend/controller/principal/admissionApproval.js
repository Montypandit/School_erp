const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');
const AdmissionApproval = require('../../models/principal/admissionApproval')

router.post('/admission/approval',authMiddleware, authorizeRoles('admin', 'principal') ,async (req,res)=>{
    try{
        const bodyData = req.body;

        const admissionApprovalData = new AdmissionApproval(bodyData);
        const savedData =   await admissionApprovalData.save();

        res.status(201).json({message:'Admission Status saved successfully', data :savedData})
    }catch(error){
        console.log(error);
        res.status(500).json({message:'Internal server error'});
    }
});

router.get('/get/all/admission/approval/status',authMiddleware, authorizeRoles('admin', 'principal','coordinator') , async (req,res)=>{
    try{
        const admissionApprovalData = await AdmissionApproval.find();
        res.status(201).json({message:'Admission Status fetched successfully', data :admissionApprovalData})
    }catch(error){
        console.log(error);
        res.status(500).json({message:'Internal server error'});
    }
});

router.get('/get/admission/approval/status/:admissionId',authMiddleware, authorizeRoles('admin', 'principal','coordinator') , async (req,res)=>{
    try{
        const admissionApprovalData = await AdmissionApproval.findById(req.params.admissionId);
        if(!admissionApprovalData){
            return res.status(404).json({message:'Admission Status not found'});
        }

        res.status(201).json({data:admissionApprovalData});
    }catch(error){
        console.log(error);
        res.status(500).json({message:'Internal server error'});
    }

});

module.exports = router;