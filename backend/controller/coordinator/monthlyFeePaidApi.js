const express = require('express');
const StudentFee = require('../../models/coordinator/monthlyFeePaidSchema');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/authorizeRules');

/**
 * @route   POST /api/fees/:admissionId
 * @desc    Create or update a student's fee record and add new payments.
 * @access  Private (Coordinator)
 */
router.post('/paid/fees/:admissionId', authMiddleware, authorizeRoles('coordinator'), async (req, res) => {
    const { admissionId } = req.params;
    const { className, section, totalFee, monthlyFee, paymentStartMonth, paymentStartYear, payments } = req.body;

    try {
        let studentFee = await StudentFee.findOne({ admissionId });

        if (studentFee) {
            // --- UPDATE EXISTING FEE RECORD ---
            // Update base details if they've changed
            studentFee.className = className || studentFee.className;
            studentFee.section = section || studentFee.section;
            studentFee.totalFee = totalFee || studentFee.totalFee;
            studentFee.monthlyFee = monthlyFee || studentFee.monthlyFee;
            studentFee.paymentStartMonth = paymentStartMonth || studentFee.paymentStartMonth;
            studentFee.paymentStartYear = paymentStartYear || studentFee.paymentStartYear;

            // Add new payments from the request body
            if (payments && Array.isArray(payments)) {
                payments.forEach(payment => {
                    studentFee.payments.push({
                        month: payment.month,
                        year: payment.year,
                        amountPaid: payment.amountPaid,
                        paymentMode: payment.paymentMode,
                        remarks: payment.remarks,
                    });
                });
            }

            const updatedStudentFee = await studentFee.save();
            return res.status(200).json(updatedStudentFee);

        } else {
            // --- CREATE NEW FEE RECORD ---
            const newStudentFee = new StudentFee({
                admissionId,
                className,
                section,
                totalFee,
                monthlyFee,
                paymentStartMonth,
                paymentStartYear,
                payments
            });

            const savedStudentFee = await newStudentFee.save();
            return res.status(201).json(savedStudentFee);
        }
    } catch (error) {
        console.error('Error processing student fee:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

/**
 * @route   GET /api/fees/:admissionId
 * @desc    Get all fee details and payments for a student.
 * @access  Private (Coordinator)
 */
router.get('/get/fees/:admissionId', authMiddleware, authorizeRoles('coordinator'), async (req, res) => {
    try {
        const studentFee = await StudentFee.findOne({ admissionId: req.params.admissionId });
        if (!studentFee) {
            return res.status(404).json({ message: 'No fee data found for this student' });
        }
        res.status(200).json(studentFee);
    } catch (error) {
        console.error('Error fetching fee data:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;