"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./AdmissionForm.css"
import { toast } from 'react-toastify'
import CoordinatorNavbar from '../CoordinatorNavbar'

export default function AdmissionForm() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    class: "",
    dob: "",
    childImageUrl: "",
    fatherImageUrl: "",
    motherImageUrl: "",
    fatherName: "",
    fatherQualification: "",
    fatherOccupation: "",
    fatherMobile: "",
    motherName: "",
    motherQualification: "",
    motherOccupation: "",
    motherMobile: "",
    email: "",
    residentialAddress: "",
    emergencyContactPhoneNo: "",
    landLine: "",
    transportFacility: "",
    emergencyContactName: "",
    emergencyMobile: "",
    doctorName: "",
    doctorPhoneNo: "",
    medicalCondition: "",
    copyOfBirthCertificate: false,
    copyOfIdProof: false,
    photosOfStudent: false,
    date: "",
  })



  const { inquiryId, admissionId } = useParams(); // Get inquiryId and admissionId from URL
  const navigate = useNavigate();

  const [photos, setPhotos] = useState({
    child: { file: null, url: null },
    father: { file: null, url: null },
    mother: { file: null, url: null },
  })

  // Fetch inquiry data on component mount if inquiryId is present
  useEffect(() => {
    const fetchInquiryData = async () => {
      if (!inquiryId) return;

      try {
        const startData = sessionStorage.getItem('coordinatorToken'); // Assuming coordinator token is used
        const token = startData ? JSON.parse(startData).token : null; // Parse token from session storage
        if (!token) {
          toast.info('Please login to continue');
          navigate('/coordinator/login');
          return;
        }

        const res = await fetch(`https://school-erp-11-mr7k.onrender.com/api/inquiry/get/inquiry/${inquiryId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          toast.error('Failed to fetch inquiry details.');
          throw new Error('Failed to fetch inquiry details');
        }

        const data = await res.json();
        console.log(data);
        setFormData(prev => ({
          ...prev,
          name: data.name || "",
          gender: data.gender || "",
          class: data.currentClass || "",
          dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : "",
          fatherName: data.fatherName || "",
          fatherQualification: data.fatherQualification || "",
          fatherOccupation: data.fatherOccupation || "",
          fatherMobile: data.fatherPhoneNo || "",
          fatherEmail: data.fatherEmail || "",
          motherName: data.motherName || "",
          motherQualification: data.motherQualification || "",
          motherOccupation: data.motherOccupation || "",
          motherMobile: data.motherPhoneNo || "",
          motherEmail: data.motherEmail || "",
          email: data.fatherEmail || "",
          residentialAddress: data.residentialAddress || "",
          emergencyContactPhoneNo: data.fatherPhoneNo || "",
          haveYouVisitedOurWebsite: data.haveYouVisitedOurWebsite || false,
          howDoYouKnowAboutSUNVILLEKIDZ: data.howDoYouKnowAboutSUNVILLEKIDZ || "",
          references: data.references || "",
        }));
      } catch (error) {
        console.error("Error fetching inquiry data:", error);
        toast.error("Error loading inquiry data: " + error.message);
      }
    };

    fetchInquiryData();
  }, [inquiryId, navigate]);

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState("idle")

  const childPhotoRef = useRef(null)
  const fatherPhotoRef = useRef(null)
  const motherPhotoRef = useRef(null)

  const handleInputChange = (e) => {
    const { name, value, type } = e.target

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: e.target.checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }



  const handleImageChange = async (photoType, file) => {
    if (file && file.type.startsWith("image/")) {
      // Clear photo error if it exists before upload attempt
      if (errors[`${photoType}Photo`]) {
        setErrors((prev) => ({ ...prev, [`${photoType}Photo`]: "" }));
      }

      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('upload_preset', 'ERP_IMAGES'); // Your Cloudinary upload preset

      try {
        const res = await fetch(
          'https://api.cloudinary.com/v1_1/daud3283/image/upload', // Your Cloudinary cloud name and upload endpoint
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

          setSubmitStatus("idle"); // Clear any previous submission status
          toast.success(`${photoType} photo uploaded successfully!`);
        } else {
          toast.error(data.error?.message || `Failed to upload ${photoType} photo. Please check preset/cloud name.`);
        }
      } catch (error) {
        toast.error(`Image upload failed for ${photoType}. Please try again.`);
        console.error('Cloudinary upload error:', error);
      }
    } else {
      alert("Please select a valid image file")
    }
  }

  const removePhoto = (photoType) => {
    setPhotos((prev) => ({
      ...prev,
      [photoType]: { file: null, url: null },
    }))

    // Also clear the image URL from formData
    const imageUrlField = `${photoType}ImageUrl`;
    setFormData((prev) => ({
      ...prev,
      [imageUrlField]: ""
    }));
  }

  const validateForm = () => {
    const newErrors = {}

    // Required field validation
    if (!formData.name.trim()) newErrors.name = "Student name is required"
    if (!formData.gender) newErrors.gender = "Gender is required"
    if (!formData.class.trim()) newErrors.class = "Class is required"
    if (!formData.dob) newErrors.dob = "Date of birth is required"
    if (!formData.fatherName.trim()) newErrors.fatherName = "Father name is required"
    if (!formData.motherName.trim()) newErrors.motherName = "Mother name is required"
    if (!formData.fatherMobile.trim()) newErrors.fatherMobile = "Father mobile is required"
    if (!formData.residentialAddress.trim()) newErrors.residentialAddress = "Address is required"
    if (!formData.emergencyContactPhoneNo.trim()) newErrors.emergencyContactPhoneNo = "Contact mobile is required"


    

    // Mobile number validation
    const mobileRegex = /^[0-9]{10}$/
    if (formData.fatherMobile && !mobileRegex.test(formData.fatherMobile)) {
      newErrors.fatherMobile = "Please enter a valid 10-digit mobile number"
    }
    if (formData.motherMobile && !mobileRegex.test(formData.motherMobile)) {
      newErrors.motherMobile = "Please enter a valid 10-digit mobile number"
    }
    if (formData.emergencyContactPhoneNo && !mobileRegex.test(formData.emergencyContactPhoneNo)) {
      newErrors.emergencyContactPhoneNo = "Please enter a valid 10-digit mobile number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setSubmitStatus("error")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create form data with photos
      const submissionData = {
        ...formData,
        inquiryId: inquiryId, // Add inquiryId to submission
        admissionId: admissionId, // Add admissionId to submission
        childImageUrl: photos.child.url,
        fatherImageUrl: photos.father.url,
        motherImageUrl: photos.mother.url,
        applicationId: `ADM${Date.now()}`,
      };

      const startData = sessionStorage.getItem('coordinatorToken');
      const token = startData ? JSON.parse(startData).token : null; // Parse token from session storage 
      const res = await fetch('https://school-erp-11-mr7k.onrender.com/api/final/admission/create/admission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submissionData)
      })

      if (!res.ok) {
        toast.error('Failed to save data');
        throw new Error('Failed to save data');
      }
      setSubmitStatus("success")

      // Reset form after successful submission
      setTimeout(() => {
        setSubmitStatus("idle")
      }, 5000)

      navigate(`/coordinator/admission/fees/${submissionData.admissionId}`)
    } catch (error) {
      console.error("Submission error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div>
      <CoordinatorNavbar />
      <div className="admission-form-container">
        <div className="form-header">
          <div className="logo-section">
            <div className="school-logo">
              <div className="logo-circle">
                <div className="logo-content">SUNVILLE</div>
              </div>
            </div>
          </div>
          <div className="school-name">
            <div className="sunville-text">
              <span className="letter s">S</span>
              <span className="letter u">U</span>
              <span className="letter n">N</span>
              <span className="letter v">V</span>
              <span className="letter i">I</span>
              <span className="letter l">L</span>
              <span className="letter l2">L</span>
              <span className="letter e">E</span>
              <span className="kidz">KIDZ</span>
            </div>
            <div className="admission-title">ADMISSION FORM</div>
          </div>
          <div className="child-photo">
            <div className="photo-upload-container">
              {photos.child.url ? (
                <div className="photo-preview">
                  <img src={photos.child.url || "/placeholder.svg"} alt="Child" className="uploaded-photo" />
                  <button type="button" className="remove-photo-btn" onClick={() => removePhoto("child")}>
                    ×
                  </button>
                </div>
              ) : (
                <div className="photo-placeholder clickable" onClick={() => childPhotoRef.current?.click()}>
                  <div className="upload-icon">📷</div>
                  <div className="upload-text">
                    Click to upload
                    <br />
                    Child's Photo
                  </div>
                </div>
              )}
              <input
                ref={childPhotoRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={(e) => e.target.files?.[0] && handleImageChange("child", e.target.files[0])}
                className="photo-input"
              />
              {errors.childPhoto && <div className="error-message">{errors.childPhoto}</div>}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="admission-form">
          <div className="student-details">
            <div className="name-section">
              <label>
                Name : <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`name-input ${errors.name ? "error" : ""}`}
                placeholder="Enter student's full name"
                style={{ textTransform: "uppercase" }}
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            <div className="basic-info">
              <div className="gender-section">
                <label>
                  Gender : <span className="required">*</span>
                </label>
                <div className="gender-options">
                  {(formData.gender).toLocaleUpperCase()}
                </div>
                {errors.gender && <div className="error-message">{errors.gender}</div>}
              </div>
              <div className="class-section">
                <label>
                  Class <span className="required">*</span>
                </label>
                <select style={{ border: '1px solid black', padding: '2px' }} name="class" onChange={handleInputChange} >
                  <option value={formData.class}> {formData.class}</option>
                  <option value="Pre Nursery">Pre Nursery</option>
                  <option value="Nursery">Nursery</option>
                  <option value="LKG">LKG</option>
                  <option value="UKG">UKG</option>
                </select>

                {errors.class && <div className="error-message">{errors.class}</div>}
              </div>
              <div className="dob-section">
                <label>
                  Date of Birth <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className={`dob-input ${errors.dob ? "error" : ""}`}
                />
                {errors.dob && <div className="error-message">{errors.dob}</div>}
              </div>
            </div>
          </div>

          <div className="parents-section">
            <h3>PARENT'S DETAILS :</h3>
            <div className="parents-photos">
              <div className="parent-photo">
                <div className="photo-upload-container">
                  {photos.father.url ? (
                    <div className="photo-preview">
                      <img src={photos.father.url || "/placeholder.svg"} alt="Father" className="uploaded-photo" />
                      <button type="button" className="remove-photo-btn" onClick={() => removePhoto("father")}>
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="photo-placeholder clickable" onClick={() => fatherPhotoRef.current?.click()}>
                      <div className="upload-icon">📷</div>
                      <div className="upload-text">
                        Click to upload
                        <br />
                        Father's Photo
                      </div>
                    </div>
                  )}
                  <input
                    ref={fatherPhotoRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => e.target.files?.[0] && handleImageChange("father", e.target.files[0])}
                    className="photo-input"
                  />
                  {errors.fatherPhoto && <div className="error-message">{errors.fatherPhoto}</div>}
                </div>
              </div>
              <div className="parent-photo">
                <div className="photo-upload-container">
                  {photos.mother.url ? (
                    <div className="photo-preview">
                      <img src={photos.mother.url || "/placeholder.svg"} alt="Mother" className="uploaded-photo" />
                      <button type="button" className="remove-photo-btn" onClick={() => removePhoto("mother")}>
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="photo-placeholder clickable" onClick={() => motherPhotoRef.current?.click()}>
                      <div className="upload-icon">📷</div>
                      <div className="upload-text">
                        Click to upload
                        <br />
                        Mother's Photo
                      </div>
                    </div>
                  )}
                  <input
                    ref={motherPhotoRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => e.target.files?.[0] && handleImageChange("mother", e.target.files[0])}
                    className="photo-input"
                  />
                  {errors.motherPhoto && <div className="error-message">{errors.motherPhoto}</div>}
                </div>
              </div>
            </div>

            <div className="parents-details">
              <div className="father-details">
                <h4>Father's Details</h4>
                <div className="detail-row">
                  <label>
                    Name : <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    className={errors.fatherName ? "error" : ""}
                    placeholder="Enter father's full name"
                  />
                  {errors.fatherName && <div className="error-message">{errors.fatherName}</div>}
                </div>
                <div className="detail-row">
                  <label>Qualification :</label>
                  <input
                    type="text"
                    name="fatherQualification"
                    value={formData.fatherQualification}
                    onChange={handleInputChange}
                    placeholder="e.g., B.Tech, MBA"
                  />
                </div>
                <div className="detail-row">
                  <label>Occupation :</label>
                  <input
                    type="text"
                    name="fatherOccupation"
                    value={formData.fatherOccupation}
                    onChange={handleInputChange}
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div className="detail-row">
                  <label>
                    Mobile No. : <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="fatherMobile"
                    value={formData.fatherMobile}
                    onChange={handleInputChange}
                    className={errors.fatherMobile ? "error" : ""}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                  {errors.fatherMobile && <div className="error-message">{errors.fatherMobile}</div>}
                </div>
              </div>

              <div className="mother-details">
                <h4>Mother's Details</h4>
                <div className="detail-row">
                  <label>
                    Name : <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    className={errors.motherName ? "error" : ""}
                    placeholder="Enter mother's full name"
                  />
                  {errors.motherName && <div className="error-message">{errors.motherName}</div>}
                </div>
                <div className="detail-row">
                  <label>Qualification :</label>
                  <input
                    type="text"
                    name="motherQualification"
                    value={formData.motherQualification}
                    onChange={handleInputChange}
                    placeholder="e.g., B.A, M.A"
                  />
                </div>
                <div className="detail-row">
                  <label>Occupation :</label>
                  <input
                    type="text"
                    name="motherOccupation"
                    value={formData.motherOccupation}
                    onChange={handleInputChange}
                    placeholder="e.g., Teacher, Homemaker"
                  />
                </div>
                <div className="detail-row">
                  <label>
                    Mobile No. : <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="motherMobile"
                    value={formData.motherMobile}
                    onChange={handleInputChange}
                    className={errors.motherMobile ? "error" : ""}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                  {errors.motherMobile && <div className="error-message">{errors.motherMobile}</div>}
                </div>
              </div>
            </div>

            <div className="email-section">
              <label>
                Email :
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`email-input ${errors.email ? "error" : ""}`}
                placeholder="Enter email address"
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="address-section">
              <label>
                Residential Address : <span className="required">*</span>
              </label>
              <textarea
                name="residentialAddress"
                value={formData.residentialAddress}
                onChange={handleInputChange}
                className={`address-input ${errors.residentialAddress ? "error" : ""}`}
                rows={3}
                placeholder="Enter complete residential address"
              />
              {errors.residentialAddress && <div className="error-message">{errors.residentialAddress}</div>}
            </div>

            <div className="contact-section">
              <div className="contact-row">
                <label>
                  Contact Number : Mobile No : <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="emergencyContactPhoneNo"
                  value={formData.emergencyContactPhoneNo}
                  onChange={handleInputChange}
                  className={`contact-input ${errors.emergencyContactPhoneNo ? "error" : ""}`}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                />
                <label>Land Line No. :</label>
                <input
                  type="tel"
                  name="landLine"
                  value={formData.landLine}
                  onChange={handleInputChange}
                  className="contact-input"
                  placeholder="Land line number"
                />
              </div>
              {errors.emergencyContactPhoneNo && <div className="error-message">{errors.emergencyContactPhoneNo}</div>}
            </div>

            <div className="transport-section">
              <label>Transport Facility Required</label>
              <div className="transport-options">
                <label>
                  <input
                    type="radio"
                    name="transportFacility"
                    value="Yes"
                    checked={formData.transportFacility === "Yes"}
                    onChange={handleInputChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="transportFacility"
                    value="No"
                    checked={formData.transportFacility === "No"}
                    onChange={handleInputChange}
                  />
                  No
                </label>
              </div>
            </div>
          </div>

          <div className="emergency-section">
            <h4>In case of Emergency Contact</h4>
            <div className="emergency-row">
              <label>Name</label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleInputChange}
                className="emergency-name"
                placeholder="Emergency contact name"
              />
              <label>Mobile No. :</label>
              <input
                type="tel"
                name="emergencyMobile"
                value={formData.emergencyMobile}
                onChange={handleInputChange}
                className="emergency-mobile"
                placeholder="Emergency contact number"
              />
            </div>
          </div>

          <div className="medical-section">
            <h4>MEDICAL INFORMATION :</h4>
            <div className="medical-row">
              <label>Doctor Name :</label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleInputChange}
                className="doctor-name"
                placeholder="Family doctor name"
              />
              <label>Contact No. :</label>
              <input
                type="tel"
                name="doctorPhoneNo"
                value={formData.doctorPhoneNo}
                onChange={handleInputChange}
                className="doctor-contact"
                placeholder="Doctor's contact number"
              />
            </div>
            <div className="medical-conditions">
              <label>Details of Medical Conditions or allergies (if any)</label>
              <textarea
                name="medicalCondition"
                value={formData.medicalCondition}
                onChange={handleInputChange}
                className="medical-input"
                rows={2}
                placeholder="Please mention any medical conditions, allergies, or special care requirements"
              />
            </div>
          </div>

          <div className="documents-section">
            <h4>DOCUMENTS SUBMITTED :</h4>
            <div className="documents-list">
              <label>
                <input
                  type="checkbox"
                  name="copyOfBirthCertificate"
                  checked={formData.copyOfBirthCertificate}
                  onChange={handleInputChange}
                />
                Copy of Birth Certificate
              </label>
              <label>
                <input
                  type="checkbox"
                  name="copyOfIdProof"
                  checked={formData.copyOfIdProof}
                  onChange={handleInputChange}
                />
                Copy of ID Proof of Parents
              </label>
              <label>
                <input
                  type="checkbox"
                  name="photosOfStudent"
                  checked={formData.photosOfStudent}
                  onChange={handleInputChange}
                />
                5 Passport Size Photographs of the Child and Parents
              </label>
            </div>
          </div>

          <div className="agreement-section">
            <p>I have read the school prospectus and agree to abide by the school rules.</p>
          </div>

          <div className="signature-section">
            <div className="signature-row">
              <div className="signature-field">
                <label>Parent/Guardian
                  <div className="">{formData.fatherName} </div>
                </label>
              </div>
            </div>
          </div>

          <div className="office-section">
            <div className="office-details">
              <div className="office-row">
                <label>Date of Admission :</label>
                <input type="date" className="office-input" />
                <label>Date of Joining :</label>
                <input type="date" className="office-input" />

              </div>
            </div>
          </div>

          {/* Submit Status Messages */}
          {submitStatus === "success" && (
            <div className="status-message success">
              ✅ Application submitted successfully! Application ID: ADM{Date.now()}
            </div>
          )}

          {submitStatus === "error" && (
            <div className="status-message error">
              ❌ Please fill in all required fields and upload all photos before submitting.
            </div>
          )}

          <div className="submit-section">
            <button type="submit" className={`submit-btn ${isSubmitting ? "submitting" : ""}`} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Submitting Application...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
            {/* Print Button */}
            {/* <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
              <button
                type="button"
                className="print-btn"
                onClick={() => window.print()}
                style={{ padding: "6px 18px", fontWeight: "bold", background: "#f5f5f5", border: "1px solid #aaa", borderRadius: "4px", cursor: "pointer" }}
              >
                🖨️ Print
              </button>
            </div> */}
          </div>

        </form>
      </div>
    </div>
  )
}