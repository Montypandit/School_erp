import React, { useState } from 'react';
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
    doYouHaveSiblings: false,
    siblings: [{ name: '', age: '' }],
    haveYouVisitedOurWebsite: false,
    howDoYouKnowAboutSUNVILLEKIDZ: '',
    references: ''
  });

  const [errors, setErrors] = useState({});

  const classOptions = [
    { value: '', label: 'Select Class' },
    { value: 'Pre Nursery', label: 'Pre Nursery' },
    { value: 'Nursery', label: 'Nursery' },
    { value: 'LKG', label: 'LKG' },
    { value: 'UKG', label: 'UKG' }
  ];

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Required field validations
    if (!formData.name.trim()) {
      newErrors.name = 'Student name is required';
      valid = false;
    }

    if (!formData.currentClass) {
      newErrors.currentClass = 'Class is required';
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

    if (!formData.fatherName.trim()) {
      newErrors.fatherName = "Father's name is required";
      valid = false;
    }

    if (!formData.fatherPhoneNo.trim()) {
      newErrors.fatherPhoneNo = "Father's mobile number is required";
      valid = false;
    } else if (!/^\d{10}$/.test(formData.fatherPhoneNo)) {
      newErrors.fatherPhoneNo = "Please enter a valid 10-digit mobile number";
      valid = false;
    }

    if (!formData.motherName.trim()) {
      newErrors.motherName = "Mother's name is required";
      valid = false;
    }

    if (!formData.motherPhoneNo.trim()) {
      newErrors.motherPhoneNo = "Mother's mobile number is required";
      valid = false;
    } else if (!/^\d{10}$/.test(formData.motherPhoneNo)) {
      newErrors.motherPhoneNo = "Please enter a valid 10-digit mobile number";
      valid = false;
    }

    if (!formData.residentialAddress.trim()) {
      newErrors.residentialAddress = 'Residential address is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'fatherPhoneNo' || name === 'motherPhoneNo') {
      // Only allow numbers and limit to 10 digits
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSiblingChange = (index, field, value) => {
    const updatedSiblings = [...formData.siblings];
    updatedSiblings[index][field] = value;
    setFormData(prev => ({
      ...prev,
      siblings: updatedSiblings
    }));
  };

  const addSibling = () => {
    setFormData(prev => ({
      ...prev,
      siblings: [...prev.siblings, { name: '', age: '' }]
    }));
  };

  const removeSibling = (index) => {
    if (formData.siblings.length > 1) {
      setFormData(prev => ({
        ...prev,
        siblings: prev.siblings.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch('https://school-erp-11-mr7k.onrender.com/api/inquiry/create/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

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
        doYouHaveSiblings: false,
        siblings: [{ name: '', age: '' }],
        haveYouVisitedOurWebsite: false,
        howDoYouKnowAboutSUNVILLEKIDZ: '',
        references: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to submit inquiry. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-8">
        <h1 className="text-3xl font-bold text-center">Student Inquiry Form</h1>
        <p className="text-center mt-2 text-blue-100">SUNVILLE KIDZ School</p>
      </div>

      <div className="space-y-8">
        {/* Student Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Student Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter student's full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class *
              </label>
              <select
                name="currentClass"
                value={formData.currentClass}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.currentClass ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {classOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.currentClass && <p className="text-red-500 text-sm mt-1">{errors.currentClass}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dob ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === 'Male'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Male
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === 'Female'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Female
                </label>
              </div>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>
          </div>
        </div>

        {/* Father's Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Father's Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Father's Name *
              </label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fatherName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter father's full name"
              />
              {errors.fatherName && <p className="text-red-500 text-sm mt-1">{errors.fatherName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="fatherPhoneNo"
                value={formData.fatherPhoneNo}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fatherPhoneNo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
              />
              {errors.fatherPhoneNo && <p className="text-red-500 text-sm mt-1">{errors.fatherPhoneNo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualification
              </label>
              <input
                type="text"
                name="fatherQualification"
                value={formData.fatherQualification}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter qualification"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occupation
              </label>
              <input
                type="text"
                name="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter occupation"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="fatherEmail"
                value={formData.fatherEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address"
              />
            </div>
          </div>
        </div>

        {/* Mother's Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Mother's Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mother's Name *
              </label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.motherName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter mother's full name"
              />
              {errors.motherName && <p className="text-red-500 text-sm mt-1">{errors.motherName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="motherPhoneNo"
                value={formData.motherPhoneNo}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.motherPhoneNo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
              />
              {errors.motherPhoneNo && <p className="text-red-500 text-sm mt-1">{errors.motherPhoneNo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualification
              </label>
              <input
                type="text"
                name="motherQualification"
                value={formData.motherQualification}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter qualification"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occupation
              </label>
              <input
                type="text"
                name="motherOccupation"
                value={formData.motherOccupation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter occupation"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="motherEmail"
                value={formData.motherEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Address Information
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Residential Address *
            </label>
            <textarea
              name="residentialAddress"
              value={formData.residentialAddress}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.residentialAddress ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter complete residential address"
            />
            {errors.residentialAddress && <p className="text-red-500 text-sm mt-1">{errors.residentialAddress}</p>}
          </div>
        </div>

        {/* Siblings Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Siblings Information
          </h2>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="doYouHaveSiblings"
                checked={formData.doYouHaveSiblings}
                onChange={handleChange}
                className="mr-2"
              />
              Does the student have siblings?
            </label>
          </div>

          {formData.doYouHaveSiblings && (
            <div className="space-y-4">
              {formData.siblings.map((sibling, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sibling Name
                    </label>
                    <input
                      type="text"
                      value={sibling.name}
                      onChange={(e) => handleSiblingChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter sibling's name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      value={sibling.age}
                      onChange={(e) => handleSiblingChange(index, 'age', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter age"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={addSibling}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Add
                    </button>
                    {formData.siblings.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSibling(index)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Additional Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="haveYouVisitedOurWebsite"
                  checked={formData.haveYouVisitedOurWebsite}
                  onChange={handleChange}
                  className="mr-2"
                />
                Have you visited our website?
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How did you know about SUNVILLE KIDZ?
              </label>
              <select
                name="howDoYouKnowAboutSUNVILLEKIDZ"
                value={formData.howDoYouKnowAboutSUNVILLEKIDZ}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select how you know about SUNVILLE KIDZ</option>
                <option value="website">School Website</option>
                <option value="social_media">Social Media</option>
                <option value="referral">Referral</option>
                <option value="advertisement">Advertisement</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                References (if any)
              </label>
              <textarea
                name="references"
                value={formData.references}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Please provide any references"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            Submit Inquiry
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryForm;