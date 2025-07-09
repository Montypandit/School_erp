const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');
const StudentStatus = require('../../models/admin/studentStatus');

router.put('/student/update/status/:admissionId',authMiddleware,authorizeRoles('admin','principal'), async(req,res)=>{
    try{
        const {admissionId} = req.params;
        const {status,reason,leaveDate,leaveType,leaveReason,remarks} = req.body;
        const student = await StudentStatus.findOneAndUpdate({ admissionId: admissionId },{
            status,
            reason,
            leaveDate,
            leaveType,
            leaveReason,
            remarks
        },
        { new: true });
        if(!student){
            return res.status(404).json({message:'Student not found'});
        }
        res.status(200).json({message:'Student status updated',data:student});
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Error updating student status', error:err.message});
    }
});


router.get('/get/all/student/status',authMiddleware,authorizeRoles('admin','principal','coordinator','teacher'), async(req,res)=>{
    try{
        const allStudentsStatusData = await StudentStatus.aggregate([
            {
                $lookup: {
                    from: 'admissionforms', // The collection name for AdmissionForm model
                    localField: 'admissionId',
                    foreignField: 'admissionId',
                    as: 'studentInfo'
                }
            },
            {
                $unwind: {
                    path: '$studentInfo',
                    preserveNullAndEmptyArrays: true // Keep status docs even if no matching admission found
                }
            },
            {
                $addFields: {
                    studentName: '$studentInfo.name',
                    studentClass: '$studentInfo.class'
                }
            },
            {
                $project: { studentInfo: 0 } // Remove the temporary studentInfo field
            }
        ]);
        res.status(200).json({ data: allStudentsStatusData });
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Error fetching all students status', error:err});
    }
});

router.get('/get/student/status/:admissionId',authMiddleware,authorizeRoles('admin','principal','coordinator'), async(req,res)=>{
    try{
        const {admissionId} = req.params;
        const student = await StudentStatus.findOne({admissionId:admissionId});

        if(!student){
            return res.status(404).json({message:'Student not found'});
        
        }

        res.status(200).json({data:student});
    } catch(err){
        console.log(err);
        res.status(500).json({message:'Error fetching student status', error:err.message});
    }
});

module.exports = router;