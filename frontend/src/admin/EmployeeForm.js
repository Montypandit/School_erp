import React, { useState } from 'react';
import './EmployeeForm.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AdUnits } from '@mui/icons-material';
import AdminNavbar from './AdminNavbar'


const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    doj: '',
    qualification: '',
    residentalAddress: '',
    permanentAddress: '',
    role: '',
    aadharNo: '',
    panNo: '',
    passportNo: '',
    salary: '',
    imageUrl: ''
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});


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
            const res = await fetch(
                'https://api.cloudinary.com/v1_1/daud3283/image/upload', 
                {
                    method: 'POST',
                    body: uploadFormData,
                }
            );
            const data = await res.json();
            if (data.secure_url) {
                setFormData((prevData) => ({
                    ...prevData,
                    imageUrl: data.secure_url,
                }));
                toast.success('Image uploaded successfully!');
            } else {
                toast.error(data.error?.message || 'Failed to upload image. Please check preset/cloud name.');
            }
        } catch (error) {
            toast.error('Image upload failed. Please try again.');
            console.error('Cloudinary upload error:', error);
        } finally {
            // setLoading(false); // Optional: manage loading state for upload
        }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const token = sessionStorage.getItem('adminToken');
      if(!token){
        toast.info('Please login to continue');
        navigate('admin/login');
        return;
      }
      const res = await fetch('http://localhost:5000/api/employees/create/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });


      if (!res.ok) {
        const errorData = await res.json();
        console.error('Server error:', errorData);
        toast.error(errorData.message || 'Failed to add employee');
        throw new Error('Failed to add employee');

      }
      toast.success('Employee added successfully');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: '',
        dob: '',
        doj: '',
        qualification: '',
        residentalAddress: '',
        permanentAddress: '',
        role: '',
        aadharNo: '',
        panNo: '',
        passportNo: '',
        salary: '',
        imageUrl: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error('Error adding employee. Please try again.');
    }
  };

  return (
    <div>
    <AdminNavbar/>
    <div className="employee-form-container">
      <h2>Add New Employee</h2>
      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? 'error' : ''}
          />
          {errors.firstName && <div className="error-message">{errors.firstName}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <div className="error-message">{errors.phone}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="doj">Date of Joining</label>
          <input
            type="date"
            id="doj"
            name="doj"
            value={formData.doj}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="qualification">Qualification</label>
          <input
            type="text"
            id="qualification"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="residentialAddress">Residential Address</label>
          <textarea
            id="residentialAddress"
            name="residentialAddress"
            value={formData.residentialAddress}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="permanentAddress">Permanent Address</label>
          <textarea
            id="permanentAddress"
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role *</label>
          <select
            id="role"
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

        <div className="form-group">
          <label htmlFor="aadharNo">Aadhar Number</label>
          <input
            type="text"
            id="aadharNo"
            name="aadharNo"
            value={formData.aadharNo}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="panNo">PAN Number</label>
          <input
            type="text"
            id="panNo"
            name="panNo"
            value={formData.panNo}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="passportNo">Passport Number</label>
          <input
            type="text"
            id="passportNo"
            name="passportNo"
            value={formData.passportNo}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="salary">Salary</label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUpload">Upload Image</label>
          <input
            type="file"
            id="imageUpload"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />

          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Uploaded preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>

        <button type="submit" onClick={handleSubmit} className="submit-btn">Add Employee</button>
      </form>
    </div>
    </div>
  );
};

export default EmployeeForm;