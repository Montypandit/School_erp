import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CoordinatorNavbar from './CoordinatorNavbar';
import AdminNavbar from '../../admin/AdminNavbar';


const getToken = () => {
  return (
    sessionStorage.getItem('adminToken') ||
    sessionStorage.getItem('coordinatorToken')
  );
};


const UpdateStudentInfo = () => {
  const { admissionId } = useParams();
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState('');

  const [formData, setFormData] = useState({
    applicationId: '',
    admissionId: '',
    inquiryId: '',
    rollNo: '',
    name: '',
    class: '',
    dob: '',
    gender: '',
    childImageUrl: '',
    fatherImageUrl: '',
    motherImageUrl: '',
    fatherName: '',
    fatherQualification: '',
    fatherOccupation: '',
    fatherMobile: '',
    landLineNo: '',
    motherName: '',
    motherQualification: '',
    motherOccupation: '',
    motherMobile: '',
    email: '',
    residentialAddress: '',
    transportFacility: 'No',
    emergencyContactName: '',
    emergencyContactPhoneNo: '',
    doctorName: '',
    doctorPhoneNo: '',
    medicalCondition: '',
    copyOfBirthCertificate: false,
    copyOfIdProof: false,
    photosOfStudent: false,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [photos, setPhotos] = useState({
    child: { file: null, url: '' },
    father: { file: null, url: '' },
    mother: { file: null, url: '' },
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("idle");

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const storedData = getToken();
        const token = storedData ? JSON.parse(storedData).token : null;
        if (!token) {
          toast.info('Please login to continue');
          navigate('/');
          return;
        }

        const roleResponse = await fetch(`https://school-erp-1-exji.onrender.com/api/auth/get/user/role?email=${encodeURIComponent(sessionStorage.getItem('email'))}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!roleResponse.ok) {
          throw new Error('Failed to fetch user role');
        }

        const roleData = await roleResponse.json();
        setUserRole(roleData.role);

        if (!roleResponse.ok) {
          throw new Error('Failed to fetch employee data');
        }

        const res = await fetch(`https://school-erp-1-exji.onrender.com/api/final/admission/get/student/${admissionId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch student data');
        }

        const data = await res.json();
        const student = data.data;

        const formattedDob = student.dob ? new Date(student.dob).toISOString().split('T')[0] : '';

        setFormData({
          applicationId: student.applicationId || '',
          admissionId: student.admissionId || '',
          inquiryId: student.inquiryId || '',
          rollNo: student.rollNo || '',
          name: student.name || '',
          class: student.class || '',
          dob: formattedDob,
          gender: (student.gender || '').toLowerCase(),
          childImageUrl: student.childImageUrl || '',
          fatherImageUrl: student.fatherImageUrl || '',
          motherImageUrl: student.motherImageUrl || '',
          fatherName: student.fatherName || '',
          fatherQualification: student.fatherQualification || '',
          fatherOccupation: student.fatherOccupation || '',
          fatherMobile: student.fatherMobile || '',
          landLineNo: student.landLineNo || '',
          motherName: student.motherName || '',
          motherQualification: student.motherQualification || '',
          motherOccupation: student.motherOccupation || '',
          motherMobile: student.motherMobile || '',
          email: student.email || '',
          residentialAddress: student.residentialAddress || '',
          transportFacility: student.transportFacility || 'No',
          emergencyContactName: student.emergencyContactName || '',
          emergencyContactPhoneNo: student.emergencyContactPhoneNo || '',
          doctorName: student.doctorName || '',
          doctorPhoneNo: student.doctorPhoneNo || '',
          medicalCondition: student.medicalCondition || '',
          copyOfBirthCertificate: student.copyOfBirthCertificate || false,
          copyOfIdProof: student.copyOfIdProof || false,
          photosOfStudent: student.photosOfStudent || false,
        });

      } catch (error) {
        console.error('Error fetching student data:', error);
        toast.error(error.message || 'Could not load student data.');
        navigate('/coordinator/students');
      } finally {
        setLoading(false);
      }
    };

    if (admissionId) {
      fetchStudentData();
    }
  }, [admissionId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Cloudinary upload handler
  const handleImageChange = async (photoType, file) => {
    if (file && file.type.startsWith("image/")) {
      if (errors[`${photoType}Photo`]) {
        setErrors((prev) => ({ ...prev, [`${photoType}Photo`]: "" }));
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
          setPhotos((prev) => ({
            ...prev,
            [photoType]: { file, url: data.secure_url },
          }));

          // Update formData with the image URL
          const imageUrlField = `${photoType}ImageUrl`;
          setFormData((prev) => ({
            ...prev,
            [imageUrlField]: data.secure_url
          }));

          setSubmitStatus("idle");
          toast.success(`${photoType} photo uploaded successfully!`);
        } else {
          toast.error(data.error?.message || `Failed to upload ${photoType} photo. Please check preset/cloud name.`);
        }
      } catch (error) {
        toast.error(`Image upload failed for ${photoType}. Please try again.`);
        console.error('Cloudinary upload error:', error);
      }
    } else {
      alert("Please select a valid image file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const coordinatorToken = sessionStorage.getItem('coordinatorToken');
      const adminToken = sessionStorage.getItem('adminToken');
      
      const token = (coordinatorToken || adminToken) ?  JSON.parse(coordinatorToken || adminToken).token : null;
      let updatedFormData = { ...formData };

      if (photos.child.file) {
        updatedFormData.childImageUrl = photos.child.url;
      }
      if (photos.father.file) {
        updatedFormData.fatherImageUrl = photos.father.url;
      }
      if (photos.mother.file) {
        updatedFormData.motherImageUrl = photos.mother.url;
      }

      const res = await fetch(`https://school-erp-1-exji.onrender.comapi/final/admission/update/admission/${admissionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedFormData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update student information.');
      }

      toast.success('Student information updated successfully!');
      // Conditionally navigate based on which token is available
      if (adminToken) {
        navigate('/admin/allstudents');
      } else {
        navigate('/students/page');
      }

    } catch (error) {
      console.error('Error updating student:', error);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  const formStyles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    paper: {
      backgroundColor: '#fff',
      padding: '40px',
      marginTop: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '32px',
      color: '#1976d2',
      marginBottom: '10px',
      fontWeight: 'bold'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '20px',
      marginTop: '30px',
      color: '#333',
      borderBottom: '2px solid #1976d2',
      paddingBottom: '10px'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '5px',
      color: '#555'
    },
    input: {
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.3s'
    },
    inputDisabled: {
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      backgroundColor: '#f5f5f5',
      color: '#666',
      cursor: 'not-allowed'
    },
    textarea: {
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      resize: 'vertical',
      minHeight: '80px'
    },
    select: {
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: '#fff'
    },
    imageGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '20px'
    },
    imageCard: {
      border: '2px dashed #ddd',
      borderRadius: '8px',
      padding: '15px',
      textAlign: 'center',
      transition: 'border-color 0.3s'
    },
    imagePreview: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '4px',
      marginBottom: '10px'
    },
    uploadButton: {
      padding: '8px 16px',
      backgroundColor: '#1976d2',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    checkboxGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '20px'
    },
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    checkbox: {
      width: '18px',
      height: '18px'
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '15px',
      marginTop: '30px'
    },
    button: {
      padding: '12px 24px',
      fontSize: '16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    primaryButton: {
      backgroundColor: '#1976d2',
      color: '#fff'
    },
    secondaryButton: {
      backgroundColor: '#fff',
      color: '#1976d2',
      border: '1px solid #1976d2'
    }
  };

  return (
    <>
        { userRole === 'coordinator' ? <CoordinatorNavbar /> : userRole === 'admin' ? <AdminNavbar/> : 'User Role Not found'}
      <div style={formStyles.container}>
        <div style={formStyles.paper}>
          <form onSubmit={handleSubmit}>
            <h1 style={formStyles.title}>Update Student Information</h1>

            {/* Basic Information */}
            <h2 style={formStyles.sectionTitle}>Basic Information</h2>
            <div style={formStyles.formGrid}>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Application ID</label>
                <input
                  type="text"
                  name="applicationId"
                  value={formData.applicationId}
                  style={formStyles.inputDisabled}
                  disabled
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Admission ID</label>
                <input
                  type="text"
                  name="admissionId"
                  value={formData.admissionId}
                  style={formStyles.inputDisabled}
                  disabled
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Inquiry ID *</label>
                <input
                  type="text"
                  name="inquiryId"
                  value={formData.inquiryId}
                  onChange={handleChange}
                  style={formStyles.inputDisabled}
                  required
                  disabled
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Roll Number</label>
                <input
                  type="text"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleChange}
                  style={formStyles.input}
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Student Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={formStyles.input}
                  required
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Class *</label>
                <input
                  type="text"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  style={formStyles.input}
                  required
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  style={formStyles.input}
                  required
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={formStyles.select}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Photo Upload Section */}
            <h2 style={formStyles.sectionTitle}>Photos</h2>
            <div style={formStyles.imageGrid}>
              <div style={formStyles.imageCard}>
                <h3>Child Photo</h3>
                {formData.childImageUrl ? (
                  <img
                    src={formData.childImageUrl}
                    alt="Child"
                    style={formStyles.imagePreview}
                  />
                ) : (
                  <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                    No image uploaded
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange('child', e.target.files[0])}
                  style={{ display: 'none' }}
                  id="child-upload"
                />
                <label htmlFor="child-upload">
                  <button type="button" style={formStyles.uploadButton} onClick={() => document.getElementById('child-upload').click()}>
                    Upload Child Photo
                  </button>
                </label>
              </div>

              <div style={formStyles.imageCard}>
                <h3>Father Photo</h3>
                {formData.fatherImageUrl ? (
                  <img
                    src={formData.fatherImageUrl}
                    alt="Father"
                    style={formStyles.imagePreview}
                  />
                ) : (
                  <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                    No image uploaded
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange('father', e.target.files[0])}
                  style={{ display: 'none' }}
                  id="father-upload"
                />
                <label htmlFor="father-upload">
                  <button type="button" style={formStyles.uploadButton} onClick={() => document.getElementById('father-upload').click()}>
                    Upload Father Photo
                  </button>
                </label>
              </div>

              <div style={formStyles.imageCard}>
                <h3>Mother Photo</h3>
                {formData.motherImageUrl ? (
                  <img
                    src={formData.motherImageUrl}
                    alt="Mother"
                    style={formStyles.imagePreview}
                  />
                ) : (
                  <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                    No image uploaded
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange('mother', e.target.files[0])}
                  style={{ display: 'none' }}
                  id="mother-upload"
                />
                <label htmlFor="mother-upload">
                  <button type="button" style={formStyles.uploadButton} onClick={() => document.getElementById('mother-upload').click()}>
                    Upload Mother Photo
                  </button>
                </label>
              </div>
            </div>

            {/* Father Information */}
            <h2 style={formStyles.sectionTitle}>Father Information</h2>
            <div style={formStyles.formGrid}>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Father's Name *</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  style={formStyles.input}
                  required
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Father's Qualification</label>
                <input
                  type="text"
                  name="fatherQualification"
                  value={formData.fatherQualification}
                  onChange={handleChange}
                  style={formStyles.input}
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Father's Occupation</label>
                <input
                  type="text"
                  name="fatherOccupation"
                  value={formData.fatherOccupation}
                  onChange={handleChange}
                  style={formStyles.input}
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Father's Mobile</label>
                <input
                  type="tel"
                  name="fatherMobile"
                  value={formData.fatherMobile}
                  onChange={handleChange}
                  style={formStyles.input}
                />
              </div>
            </div>

            {/* Mother Information */}
            <h2 style={formStyles.sectionTitle}>Mother Information</h2>
            <div style={formStyles.formGrid}>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Mother's Name *</label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  style={formStyles.input}
                  required
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Mother's Qualification</label>
                <input
                  type="text"
                  name="motherQualification"
                  value={formData.motherQualification}
                  onChange={handleChange}
                  style={formStyles.input}
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Mother's Occupation</label>
                <input
                  type="text"
                  name="motherOccupation"
                  value={formData.motherOccupation}
                  onChange={handleChange}
                  style={formStyles.input}
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Mother's Mobile</label>
                <input
                  type="tel"
                  name="motherMobile"
                  value={formData.motherMobile}
                  onChange={handleChange}
                  style={formStyles.input}
                />
              </div>
            </div>

            {/* Contact Information */}
            <h2 style={formStyles.sectionTitle}>Contact Information</h2>
            <div style={formStyles.formGrid}>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={formStyles.input}
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Landline Number</label>
                <input
                  type="tel"
                  name="landLineNo"
                  value={formData.landLineNo}
                  onChange={handleChange}
                  style={formStyles.input}
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Transport Facility</label>
                <select
                  name="transportFacility"
                  value={formData.transportFacility}
                  onChange={handleChange}
                  style={formStyles.select}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>Residential Address</label>
              <textarea
                name="residentialAddress"
                value={formData.residentialAddress}
                onChange={handleChange}
                style={formStyles.textarea}
              />
            </div>

            {/* Emergency Contact */}
            <h2 style={formStyles.sectionTitle}>Emergency Contact</h2>
            <div style={formStyles.formGrid}>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Emergency Contact Name</label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  style={formStyles.input}
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Emergency Contact Phone</label>
                <input
                  type="tel"
                  name="emergencyContactPhoneNo"
                  value={formData.emergencyContactPhoneNo}
                  onChange={handleChange}
                  style={formStyles.input}
                />
              </div>
            </div>

            {/* Medical Information */}
            <h2 style={formStyles.sectionTitle}>Medical Information</h2>
            <div style={formStyles.formGrid}>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Doctor Name</label>
                <input
                  type="text"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleChange}
                  style={formStyles.input}
                />
              </div>
              <div style={formStyles.formGroup}>
                <label style={formStyles.label}>Doctor Phone Number</label>
                <input
                  type="tel"
                  name="doctorPhoneNo"
                  value={formData.doctorPhoneNo}
                  onChange={handleChange}
                  style={formStyles.input}
                />
              </div>
            </div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>Medical Condition</label>
              <textarea
                name="medicalCondition"
                value={formData.medicalCondition}
                onChange={handleChange}
                style={formStyles.textarea}
              />
            </div>

            {/* Document Checklist */}
            <h2 style={formStyles.sectionTitle}>Document Checklist</h2>
            <div style={formStyles.checkboxGrid}>
              <div style={formStyles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="copyOfBirthCertificate"
                  checked={formData.copyOfBirthCertificate}
                  onChange={handleChange}
                  style={formStyles.checkbox}
                />
                <label>Copy of Birth Certificate</label>
              </div>
              <div style={formStyles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="copyOfIdProof"
                  checked={formData.copyOfIdProof}
                  onChange={handleChange}
                  style={formStyles.checkbox}
                />
                <label>Copy of ID Proof</label>
              </div>
              <div style={formStyles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="photosOfStudent"
                  checked={formData.photosOfStudent}
                  onChange={handleChange}
                  style={formStyles.checkbox}
                />
                <label>Photos of Student</label>
              </div>
            </div>

            <div style={formStyles.buttonGroup}>
              <button
                type="button"
                style={{ ...formStyles.button, ...formStyles.secondaryButton }}
                onClick={() => {
                  if (sessionStorage.getItem('adminToken')) {
                    navigate('/admin/allstudents');
                  } else {
                    navigate('/students/page');
                  }
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ ...formStyles.button, ...formStyles.primaryButton }}
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Update Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateStudentInfo;