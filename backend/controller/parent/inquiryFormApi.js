const express = require('express');
const InquiryForm = require('../../models/parents/inquiryForm');
const router = express.Router();

// Generate 4-5 digit unique inquiry ID
const generateInquiryId = () => {
  return Math.floor(1000 + Math.random() * 90000).toString();
};

// Create Inquiry
router.post('/create/inquiry', async (req, res) => {
  try {
    const {
      name,
      currentClass,
      dob,
      gender,
      fatherName,
      fatherQualification,
      fatherOccupation,
      fatherPhoneNo,
      fatherEmail,
      motherName,
      motherQualification,
      motherOccupation,
      motherPhoneNo,
      motherEmail,
      residentalAddress,
      haveYouVisitedOurWebsite,
      howDoYouKnowAboutSUNVILLEKIDZ,
      references
    } = req.body;

    const inquiryId = generateInquiryId();

    const newInquiry = new InquiryForm({
      inquiryId,
      name,
      currentClass,
      dob,
      gender,
      fatherName,
      fatherQualification,
      fatherOccupation,
      fatherPhoneNo,
      fatherEmail,
      motherName,
      motherQualification,
      motherOccupation,
      motherPhoneNo,
      motherEmail,
      residentalAddress,
      haveYouVisitedOurWebsite,
      howDoYouKnowAboutSUNVILLEKIDZ,
      references
    });

    const saved = await newInquiry.save();
    res.status(201).json({ message: "Inquiry created", data: saved });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Inquiries
router.get('/all/inquiries', async (req, res) => {
  try {
    const all = await InquiryForm.find();
    res.status(200).json(all);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Inquiry by inquiryId
router.get('/get/inquiry/:inquiryId', async (req, res) => {
  try {
    const inquiry = await InquiryForm.findOne({ inquiryId: req.params.inquiryId });

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.status(200).json(inquiry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
