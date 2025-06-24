import React, { useState } from 'react';
import './InquiryForm.css';
import { toast } from 'react-toastify';

const InquiryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    currentClass: '',
    dob: '',
    gender: '',
    fatherName: '',
    fatherQualification: '',
    fatherOccupation: '',
    fatherPhoneNo: '',
    fatherEmail: '',
    motherName: '',
    motherQualification: '',
    motherOccupation: '',
    motherPhoneNo: '',
    motherEmail: '',
    residentialAddress: '',
    haveYouVisitedOurWebsite: false,
    howDoYouKnowAboutSUNVILLEKIDZ: '',
    references: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Student name is required';
      valid = false;
    }

    if (!formData.currentClass) {
      newErrors.class = 'Class is required';
      valid = false;
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
      valid = false;
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
      valid = false;
    }

    if (!formData.fatherName) {
      newErrors.fatherName = "Father's name is required";
      valid = false;
    }

    if (!formData.fatherPhoneNo) {
      newErrors.fatherPhoneNo = "Father's phone number is required";
      valid = false;
    }

    if (!formData.fatherEmail) {
      newErrors.fatherEmail = "Father's email is required";
      valid = false;
    }

    if (!formData.motherName) {
      newErrors.motherName = "Mother's name is required";
      valid = false;
    }

    if (!formData.motherPhoneNo) {
      newErrors.motherPhoneNo = "Mother's phone number is required";
      valid = false;
    }

    if (!formData.motherEmail) {
      newErrors.motherEmail = "Mother's email is required";
      valid = false;
    }

    if (!formData.residentialAddress) {
      newErrors.residentialAddress = 'Residential address is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value.replace(/[^0-9]/g, '')
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleGenderChange = (gender) => {
    setFormData(prev => ({
      ...prev,
      gender: gender
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {

      const res = await fetch('http://localhost:5000/api/inquiry/create/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        console.log('Network response was not ok');
        throw new Error('Network response was not ok');
      }

      // Show success message
      toast.success("Inquiry submitted successfully! Thank you for your interest!");

      // Reset form
      setFormData({
        name: '',
        currentClass: '',
        dob: '',
        gender: '',
        fatherName: '',
        fatherQualification: '',
        fatherOccupation: '',
        fatherPhoneNo: '',
        fatherEmail: '',
        motherName: '',
        motherQualification: '',
        motherOccupation: '',
        motherPhoneNo: '',
        motherEmail: '',
        residentialAddress: '',
        haveYouVisitedOurWebsite: false,
        howDoYouKnowAboutSUNVILLEKIDZ: '',
        references: ''
      });

      // Clear errors
      setErrors({});
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error(error.error);
    }
  };

  return (
    <div className="inquiry-form-container">
      <h1 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: '1.5rem'
      }}>INQUIRY FORM</h1>

      <form className="inquiry-form" onSubmit={handleSubmit}>
        {/* Student Information */}
        <div className="form-section">
          <h3>Student Information</h3>

          <label htmlFor="name">STUDENT NAME</label>
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <label htmlFor="class">CLASS</label>
          <div className="form-group">
            <input
              type="text"
              name="currentClass"
              value={formData.currentClass}
              onChange={handleChange}
              className={errors.class ? 'error' : ''}
            />
            {errors.class && <div className="error-message">{errors.class}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="dob">DATE OF BIRTH</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={errors.dob ? 'error' : ''}
            />
            {errors.dob && <div className="error-message">{errors.dob}</div>}
          </div>

          <div className="form-group gender-group flex gap-4">
            {/* Male Option */}
            <div
              onClick={() => handleGenderChange('male')}
              className={`gender-option cursor-pointer border px-4 py-2 rounded-md transition-all ${formData.gender === 'male'
                  ? 'bg-blue-100 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300'
                }`}
            >
              <label className="cursor-pointer">MALE</label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={() => { }}
                className="hidden"
              />
            </div>

            {/* Female Option */}
            <div
              onClick={() => handleGenderChange('female')}
              className={`gender-option cursor-pointer border px-4 py-2 rounded-md transition-all ${formData.gender === 'female'
                  ? 'bg-pink-100 text-white border-pink-500'
                  : 'bg-white text-gray-700 border-gray-300'
                }`}
            >
              <label className="cursor-pointer">FEMALE</label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={() => { }}
                className="hidden"
              />
            </div>

            {errors.gender && <div className="text-red-500 text-sm mt-2">{errors.gender}</div>}
          </div>

        </div>

        {/* Father's Information */}
        <div className="form-section">
          <h3>Father's Information</h3>
          <div className="form-group">
            <label htmlFor="fatherName">FATHER'S NAME</label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              className={errors.fatherName ? 'error' : ''}
            />
            {errors.fatherName && <div className="error-message">{errors.fatherName}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="fatherQualification">QUALIFICATION</label>
            <input
              type="text"
              name="fatherQualification"
              value={formData.fatherQualification}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fatherOccupation">OCCUPATION</label>
            <input
              type="text"
              name="fatherOccupation"
              value={formData.fatherOccupation}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fatherPhoneNo">PHONE NUMBER *</label>
            <input
              type="number"
              name="fatherPhoneNo"
              value={formData.fatherPhoneNo}
              onChange={handleChange}
              className={errors.fatherPhoneNo ? 'error' : ''}
            />
            {errors.fatherPhoneNo && <div className="error-message">{errors.fatherPhoneNo}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="fatherEmail">EMAIL</label>
            <input
              type="email"
              name="fatherEmail"
              value={formData.fatherEmail}
              onChange={handleChange}
              className={errors.fatherEmail ? 'error' : ''}
            />
            {errors.fatherEmail && <div className="error-message">{errors.fatherEmail}</div>}
          </div>
        </div>

        {/* Mother's Information */}
        <div className="form-section">
          <h3>Mother's Information</h3>
          <div className="form-group">
            <label htmlFor="motherName">MOTHER'S NAME *</label>
            <input
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              className={errors.motherName ? 'error' : ''}
            />
            {errors.motherName && <div className="error-message">{errors.motherName}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="motherQualification">QUALIFICATION</label>
            <input
              type="text"
              name="motherQualification"
              value={formData.motherQualification}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="motherOccupation">OCCUPATION</label>
            <input
              type="text"
              name="motherOccupation"
              value={formData.motherOccupation}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="motherPhoneNo">PHONE NUMBER *</label>
            <input
              type="number"
              name="motherPhoneNo"
              value={formData.motherPhoneNo}
              onChange={handleChange}
              className={errors.motherPhoneNo ? 'error' : ''}
            />
            {errors.motherPhoneNo && <div className="error-message">{errors.motherPhoneNo}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="motherEmail">EMAIL</label>
            <input
              type="email"
              name="motherEmail"
              value={formData.motherEmail}
              onChange={handleChange}
              className={errors.motherEmail ? 'error' : ''}
            />
            {errors.motherEmail && <div className="error-message">{errors.motherEmail}</div>}
          </div>
        </div>

        {/* Additional Information */}
        <div className="form-section">
          <h3>Additional Information</h3>
          <div className="form-group">
            <label htmlFor="residentialAddress">RESIDENTIAL ADDRESS *</label>
            <textarea
              name="residentialAddress"
              value={formData.residentialAddress}
              onChange={handleChange}
              rows="3"
              className={errors.residentialAddress ? 'error' : ''}
            />
            {errors.residentialAddress && <div className="error-message">{errors.residentialAddress}</div>}
          </div>

          <div className="form-group checkbox-group">
            <label htmlFor="haveYouVisitedOurWebsite">Have you visited our website?</label>
            <input
              type="checkbox"
              name="haveYouVisitedOurWebsite"
              checked={formData.haveYouVisitedOurWebsite}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="howDoYouKnowAboutSUNVILLEKIDZ">How did you know about SUNVILLE KIDZ?</label>
            <select
              name="howDoYouKnowAboutSUNVILLEKIDZ"
              value={formData.howDoYouKnowAboutSUNVILLEKIDZ}
              onChange={handleChange}
            >
              <option value="">Select how you know about SUNVILLE KIDZ</option>
              <option value="website">School Website</option>
              <option value="social_media">Social Media</option>
              <option value="referral">Referral</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="references">References (if any)</label>
            <textarea
              name="references"
              value={formData.references}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        <button type="submit">Submit Inquiry</button>
      </form>
    </div>
  );
};

export default InquiryForm;