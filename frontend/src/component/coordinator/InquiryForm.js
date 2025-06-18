import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InquiryForm.css';

const InquiryForm = () => {
  const [formData, setFormData] = useState({
    inquiryId: '',
    name: '',
    class: '',
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

    if (!formData.class) {
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
      // Store data in API
      const response = await axios.post("http://localhost:5000/create/inquiry", {
        ...formData,
        dob: formData.dob ? new Date(formData.dob) : null,
        class: formData.class  // Backend expects 'class' as a property
      });
      
      // Show success message
      alert("Inquiry submitted successfully! Thank you for your interest!");
      
      // Reset form
      setFormData({
        inquiryId: '',
        name: '',
        class: '',
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
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with an error
        alert(`Error: ${error.response.data.message || error.response.data.error || 'Something went wrong. Please try again.'}`);
      } else if (error.request) {
        // Request made but no response
        alert('No response from server. Please check your internet connection and try again.');
      } else if (error.message.includes('Network Error')) {
        // Network error
        alert('Unable to connect to server. Please check your internet connection and try again.');
      } else {
        // Other errors
        alert('Error occurred. Please try again.');
      }
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
          <div className="form-group">
            <input 
              type="text" 
              name="inquiryId" 
              value={formData.inquiryId} 
              onChange={handleChange} 
              className={errors.inquiryId ? 'error' : ''}
            />
            <label htmlFor="inquiryId">INQUIRY ID *</label>
            {errors.inquiryId && <div className="error-message">{errors.inquiryId}</div>}
          </div>

          <div className="form-group">
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className={errors.name ? 'error' : ''}
            />
            <label htmlFor="name">STUDENT NAME *</label>
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <input 
              type="text" 
              name="class" 
              value={formData.class} 
              onChange={handleChange} 
              className={errors.class ? 'error' : ''}
            />
            <label htmlFor="class">CLASS *</label>
            {errors.class && <div className="error-message">{errors.class}</div>}
          </div>

          <div className="form-group">
            <input 
              type="date" 
              name="dob" 
              value={formData.dob} 
              onChange={handleChange} 
              className={errors.dob ? 'error' : ''}
            />
            <label htmlFor="dob">DATE OF BIRTH *</label>
            {errors.dob && <div className="error-message">{errors.dob}</div>}
          </div>

          <div className="form-group gender-group">
            <div 
              onClick={() => handleGenderChange('male')}
              className={`gender-option ${formData.gender === 'male' ? 'selected' : ''}`}
            >
              <input 
                type="radio" 
                name="gender" 
                value="male" 
                checked={formData.gender === 'male'} 
                onChange={() => {}} // Prevent direct change
              />
              <label>MALE</label>
            </div>

            <div 
              onClick={() => handleGenderChange('female')}
              className={`gender-option ${formData.gender === 'female' ? 'selected' : ''}`}
            >
              <input 
                type="radio" 
                name="gender" 
                value="female" 
                checked={formData.gender === 'female'} 
                onChange={() => {}} // Prevent direct change
              />
              <label>FEMALE</label>
            </div>

            {errors.gender && <div className="error-message">{errors.gender}</div>}
          </div>
        </div>

        {/* Father's Information */}
        <div className="form-section">
          <h3>Father's Information</h3>
          <div className="form-group">
            <input 
              type="text" 
              name="fatherName" 
              value={formData.fatherName} 
              onChange={handleChange} 
              className={errors.fatherName ? 'error' : ''}
            />
            <label htmlFor="fatherName">FATHER'S NAME *</label>
            {errors.fatherName && <div className="error-message">{errors.fatherName}</div>}
          </div>

          <div className="form-group">
            <input 
              type="text" 
              name="fatherQualification" 
              value={formData.fatherQualification} 
              onChange={handleChange} 
            />
            <label htmlFor="fatherQualification">QUALIFICATION</label>
          </div>

          <div className="form-group">
            <input 
              type="text" 
              name="fatherOccupation" 
              value={formData.fatherOccupation} 
              onChange={handleChange} 
            />
            <label htmlFor="fatherOccupation">OCCUPATION</label>
          </div>

          <div className="form-group">
            <input 
              type="number" 
              name="fatherPhoneNo" 
              value={formData.fatherPhoneNo} 
              onChange={handleChange} 
              className={errors.fatherPhoneNo ? 'error' : ''}
            />
            <label htmlFor="fatherPhoneNo">PHONE NUMBER *</label>
            {errors.fatherPhoneNo && <div className="error-message">{errors.fatherPhoneNo}</div>}
          </div>

          <div className="form-group">
            <input 
              type="email" 
              name="fatherEmail" 
              value={formData.fatherEmail} 
              onChange={handleChange} 
              className={errors.fatherEmail ? 'error' : ''}
            />
            <label htmlFor="fatherEmail">EMAIL *</label>
            {errors.fatherEmail && <div className="error-message">{errors.fatherEmail}</div>}
          </div>
        </div>

        {/* Mother's Information */}
        <div className="form-section">
          <h3>Mother's Information</h3>
          <div className="form-group">
            <input 
              type="text" 
              name="motherName" 
              value={formData.motherName} 
              onChange={handleChange} 
              className={errors.motherName ? 'error' : ''}
            />
            <label htmlFor="motherName">MOTHER'S NAME *</label>
            {errors.motherName && <div className="error-message">{errors.motherName}</div>}
          </div>

          <div className="form-group">
            <input 
              type="text" 
              name="motherQualification" 
              value={formData.motherQualification} 
              onChange={handleChange} 
            />
            <label htmlFor="motherQualification">QUALIFICATION</label>
          </div>

          <div className="form-group">
            <input 
              type="text" 
              name="motherOccupation" 
              value={formData.motherOccupation} 
              onChange={handleChange} 
            />
            <label htmlFor="motherOccupation">OCCUPATION</label>
          </div>

          <div className="form-group">
            <input 
              type="number" 
              name="motherPhoneNo" 
              value={formData.motherPhoneNo} 
              onChange={handleChange} 
              className={errors.motherPhoneNo ? 'error' : ''}
            />
            <label htmlFor="motherPhoneNo">PHONE NUMBER *</label>
            {errors.motherPhoneNo && <div className="error-message">{errors.motherPhoneNo}</div>}
          </div>

          <div className="form-group">
            <input 
              type="email" 
              name="motherEmail" 
              value={formData.motherEmail} 
              onChange={handleChange} 
              className={errors.motherEmail ? 'error' : ''}
            />
            <label htmlFor="motherEmail">EMAIL *</label>
            {errors.motherEmail && <div className="error-message">{errors.motherEmail}</div>}
          </div>
        </div>

        {/* Additional Information */}
        <div className="form-section">
          <h3>Additional Information</h3>
          <div className="form-group">
            <textarea 
              name="residentialAddress" 
              value={formData.residentialAddress} 
              onChange={handleChange} 
              rows="3"
              className={errors.residentialAddress ? 'error' : ''}
            />
            <label htmlFor="residentialAddress">RESIDENTIAL ADDRESS *</label>
            {errors.residentialAddress && <div className="error-message">{errors.residentialAddress}</div>}
          </div>

          <div className="form-group checkbox-group">
            <input 
              type="checkbox" 
              name="haveYouVisitedOurWebsite" 
              checked={formData.haveYouVisitedOurWebsite} 
              onChange={handleChange} 
            />
            <label htmlFor="haveYouVisitedOurWebsite">Have you visited our website?</label>
          </div>

          <div className="form-group">
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
            <label htmlFor="howDoYouKnowAboutSUNVILLEKIDZ">How did you know about SUNVILLE KIDZ?</label>
          </div>

          <div className="form-group">
            <textarea 
              name="references" 
              value={formData.references} 
              onChange={handleChange} 
              rows="3"
            />
            <label htmlFor="references">References (if any)</label>
          </div>
        </div>

        <button type="submit">Submit Inquiry</button>
      </form>
    </div>
  );
};

export default InquiryForm;