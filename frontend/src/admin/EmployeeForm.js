import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import './EmployeeForm.css';

const EmployeeForm = () => {
  const navigate = useNavigate();

  const initialFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    doj: '',
    qualification: '',
    residentialAddress: '',
    permanentAddress: '',
    role: '',
    aadharNo: '',
    panNo: '',
    passportNo: '',
    salary: '',
    imageUrl: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.info('No file selected.');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('upload_preset', 'ERP_IMAGES');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/daud3283/image/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setFormData(prev => ({
          ...prev,
          imageUrl: data.secure_url,
        }));
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(data.error?.message || 'Upload failed. Check Cloudinary config.');
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      toast.error('Image upload failed. Try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['firstName', 'email', 'phone', 'role'];
    const newErrors = {};

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const token = sessionStorage.getItem('adminToken');
      if (!token) {
        toast.info('Please login to continue');
        navigate('/admin/login');
        return;
      }

      const res = await fetch('http://localhost:5000/api/employees/create/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || 'Failed to add employee');
        return;
      }

      toast.success(result.message || 'Employee added successfully');
      setFormData(initialFormData);
      setErrors({});
      setIsSubmitted(true);
    } catch (error) {
      console.error('Add employee error:', error);
      toast.error('Something went wrong. Try again.');
    }
  };
  const handleActivate = () => {
    if (!isSubmitted) {
      toast.warning('Please add employee first!');
      return;
    }

    navigate('/admin/employees');
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setErrors({});
    toast.info('Form reset.');
  };

  return (
    <div>
      <AdminNavbar />
      <div className="employee-form-container">
        <h2>Add New Employee</h2>
        <form onSubmit={handleSubmit} className="employee-form">

          {/* Basic Fields */}
          {[
            { label: 'First Name *', name: 'firstName', type: 'text', required: true },
            { label: 'Last Name', name: 'lastName', type: 'text' },
            { label: 'Email *', name: 'email', type: 'email', required: true },
            { label: 'Phone *', name: 'phone', type: 'tel', required: true },
            { label: 'Date of Birth', name: 'dob', type: 'date' },
            { label: 'Date of Joining', name: 'doj', type: 'date' },
            { label: 'Qualification', name: 'qualification', type: 'text' },
            { label: 'Aadhar Number', name: 'aadharNo', type: 'text' },
            { label: 'PAN Number', name: 'panNo', type: 'text' },
            { label: 'Passport Number', name: 'passportNo', type: 'text' },
            { label: 'Salary', name: 'salary', type: 'number' },
          ].map((field) => (
            <div className="form-group" key={field.name}>
              <label>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className={errors[field.name] ? 'error' : ''}
              />
              {errors[field.name] && <div className="error-message">{errors[field.name]}</div>}
            </div>
          ))}

          {/* Gender Dropdown */}
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Role Dropdown */}
          <div className="form-group">
            <label>Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={errors.role ? 'error' : ''}
            >
              <option value="">Select Role</option>
              <option value="teacher">Teacher</option>
              <option value="principal">Principal</option>
              <option value="coordinator">Coordinator</option>
              <option value="peon">Peon</option>
            </select>
            {errors.role && <div className="error-message">{errors.role}</div>}
          </div>

          {/* Address Fields */}
          <div className="form-group">
            <label>Residential Address</label>
            <textarea name="residentialAddress" rows="3" value={formData.residentialAddress} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label>Permanent Address</label>
            <textarea name="permanentAddress" rows="3" value={formData.permanentAddress} onChange={handleChange}></textarea>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                style={{
                  marginTop: "10px",
                  width: "120px",
                  height: "120px",
                  borderRadius: "8px",
                  objectFit: "cover"
                }}
              />
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
            {/* Left Side: Add & Cancel */}
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" className="submit-btn">Add Employee</button>
              <button
                type="button"
                onClick={handleCancel}
                className="cancel-btn"
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  border: "1px solid rgb(173, 181, 192)",
                  backgroundColor: "#f9fafb",
                  color: "#374151",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>

            {/* Right Side: Activate */}
            <div>
              <button type="button" onClick={handleActivate} className="submit-btn">Activate</button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
