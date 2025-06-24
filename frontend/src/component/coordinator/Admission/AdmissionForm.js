"use client"

import { useState, useRef } from "react"
import "./admission-form.css"

export default function AdmissionForm() {
  const [formData, setFormData] = useState({
    studentName: "",
    gender: "",
    class: "",
    dateOfBirth: "",
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
    contactMobile: "",
    landLine: "",
    transportRequired: "",
    emergencyName: "",
    emergencyMobile: "",
    doctorName: "",
    doctorContact: "",
    medicalConditions: "",
    documents: {
      birthCertificate: false,
      idProof: false,
      photographs: false,
    },
    date: "",
    signature: "",
  })

  const [photos, setPhotos] = useState({
    child: { file: null, url: null },
    father: { file: null, url: null },
    mother: { file: null, url: null },
  })

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
      const checkbox = e.target
      if (name.startsWith("documents.")) {
        const docName = name.split(".")[1]
        setFormData((prev) => ({
          ...prev,
          documents: {
            ...prev.documents,
            [docName]: checkbox.checked,
          },
        }))
      } else {
        setFormData((prev) => ({ ...prev, [name]: checkbox.checked }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handlePhotoUpload = (photoType, file) => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      setPhotos((prev) => ({
        ...prev,
        [photoType]: { file, url },
      }))

      // Clear photo error if exists
      if (errors[`${photoType}Photo`]) {
        setErrors((prev) => ({ ...prev, [`${photoType}Photo`]: "" }))
      }
    } else {
      alert("Please select a valid image file")
    }
  }

  const removePhoto = (photoType) => {
    if (photos[photoType].url) {
      URL.revokeObjectURL(photos[photoType].url)
    }
    setPhotos((prev) => ({
      ...prev,
      [photoType]: { file: null, url: null },
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    // Required field validation
    if (!formData.studentName.trim()) newErrors.studentName = "Student name is required"
    if (!formData.gender) newErrors.gender = "Gender is required"
    if (!formData.class.trim()) newErrors.class = "Class is required"
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
    if (!formData.fatherName.trim()) newErrors.fatherName = "Father name is required"
    if (!formData.motherName.trim()) newErrors.motherName = "Mother name is required"
    if (!formData.fatherMobile.trim()) newErrors.fatherMobile = "Father mobile is required"
    if (!formData.motherMobile.trim()) newErrors.motherMobile = "Mother mobile is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.residentialAddress.trim()) newErrors.residentialAddress = "Address is required"
    if (!formData.contactMobile.trim()) newErrors.contactMobile = "Contact mobile is required"

    // Photo validation
    if (!photos.child.file) newErrors.childPhoto = "Child photo is required"
    if (!photos.father.file) newErrors.fatherPhoto = "Father photo is required"
    if (!photos.mother.file) newErrors.motherPhoto = "Mother photo is required"

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Mobile number validation
    const mobileRegex = /^[0-9]{10}$/
    if (formData.fatherMobile && !mobileRegex.test(formData.fatherMobile)) {
      newErrors.fatherMobile = "Please enter a valid 10-digit mobile number"
    }
    if (formData.motherMobile && !mobileRegex.test(formData.motherMobile)) {
      newErrors.motherMobile = "Please enter a valid 10-digit mobile number"
    }
    if (formData.contactMobile && !mobileRegex.test(formData.contactMobile)) {
      newErrors.contactMobile = "Please enter a valid 10-digit mobile number"
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
        photos: {
          child: photos.child.url,
          father: photos.father.url,
          mother: photos.mother.url,
        },
        submittedAt: new Date().toISOString(),
        applicationId: `ADM${Date.now()}`,
      }

      console.log("Form submitted successfully:", submissionData)
      setSubmitStatus("success")

      // Reset form after successful submission
      setTimeout(() => {
        setSubmitStatus("idle")
      }, 3000)
    } catch (error) {
      console.error("Submission error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getProgressPercentage = () => {
    const totalFields = 15 // Approximate number of required fields
    const filledFields = Object.values(formData).filter((value) =>
      typeof value === "string" ? value.trim() !== "" : value !== "",
    ).length
    const uploadedPhotos = Object.values(photos).filter((photo) => photo.file !== null).length

    return Math.round(((filledFields + uploadedPhotos) / (totalFields + 3)) * 100)
  }

  return (
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
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handlePhotoUpload("child", e.target.files[0])}
              className="photo-input"
            />
            {errors.childPhoto && <div className="error-message">{errors.childPhoto}</div>}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${getProgressPercentage()}%` }}></div>
        </div>
        <div className="progress-text">{getProgressPercentage()}% Complete</div>
      </div>

      <form onSubmit={handleSubmit} className="admission-form">
        <div className="student-details">
          <div className="name-section">
            <label>
              Name (In Block Letters) : <span className="required">*</span>
            </label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleInputChange}
              className={`name-input ${errors.studentName ? "error" : ""}`}
              placeholder="Enter student's full name"
              style={{ textTransform: "uppercase" }}
            />
            {errors.studentName && <div className="error-message">{errors.studentName}</div>}
          </div>

          <div className="basic-info">
            <div className="gender-section">
              <label>
                Gender : <span className="required">*</span>
              </label>
              <div className="gender-options">
                <label className={errors.gender ? "error" : ""}>
                  <input type="radio" name="gender" value="Male" onChange={handleInputChange} />
                  Male
                </label>
                <label className={errors.gender ? "error" : ""}>
                  <input type="radio" name="gender" value="Female" onChange={handleInputChange} />
                  Female
                </label>
              </div>
              {errors.gender && <div className="error-message">{errors.gender}</div>}
            </div>
            <div className="class-section">
              <label>
                Class <span className="required">*</span>
              </label>
              <input
                type="text"
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                className={`class-input ${errors.class ? "error" : ""}`}
                placeholder="e.g., Nursery, LKG, UKG"
              />
              {errors.class && <div className="error-message">{errors.class}</div>}
            </div>
            <div className="dob-section">
              <label>
                Date of Birth <span className="required">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={`dob-input ${errors.dateOfBirth ? "error" : ""}`}
              />
              {errors.dateOfBirth && <div className="error-message">{errors.dateOfBirth}</div>}
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
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handlePhotoUpload("father", e.target.files[0])}
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
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handlePhotoUpload("mother", e.target.files[0])}
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
              Email : <span className="required">*</span>
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
                name="contactMobile"
                value={formData.contactMobile}
                onChange={handleInputChange}
                className={`contact-input ${errors.contactMobile ? "error" : ""}`}
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
            {errors.contactMobile && <div className="error-message">{errors.contactMobile}</div>}
          </div>

          <div className="transport-section">
            <label>Transport Facility Required</label>
            <div className="transport-options">
              <label>
                <input type="radio" name="transportRequired" value="Yes" onChange={handleInputChange} />
                Yes
              </label>
              <label>
                <input type="radio" name="transportRequired" value="No" onChange={handleInputChange} />
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
              name="emergencyName"
              value={formData.emergencyName}
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
              name="doctorContact"
              value={formData.doctorContact}
              onChange={handleInputChange}
              className="doctor-contact"
              placeholder="Doctor's contact number"
            />
          </div>
          <div className="medical-conditions">
            <label>Details of Medical Conditions or allergies (if any)</label>
            <textarea
              name="medicalConditions"
              value={formData.medicalConditions}
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
              <input type="checkbox" name="documents.birthCertificate" onChange={handleInputChange} />
              Copy of Birth Certificate
            </label>
            <label>
              <input type="checkbox" name="documents.idProof" onChange={handleInputChange} />
              Copy of ID Proof of Parents
            </label>
            <label>
              <input type="checkbox" name="documents.photographs" onChange={handleInputChange} />5 Passport Size
              Photographs of the Child and Parents
            </label>
          </div>
        </div>

        <div className="agreement-section">
          <p>I have read the school prospectus and agree to abide by the school rules.</p>
        </div>

        <div className="signature-section">
          <div className="signature-row">
            <div className="date-field">
              <label>Date :</label>
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
            </div>
            <div className="signature-field">
              <label>Signature of Parent/Guardian</label>
              <div className="signature-line"></div>
            </div>
          </div>
        </div>

        <div className="office-section">
          <h4>FOR OFFICE USE ONLY</h4>
          <div className="office-details">
            <div className="office-row">
              <label>Date of Admission :</label>
              <input type="date" className="office-input" />
              <label>Admission Number :</label>
              <input type="text" className="office-input" />
            </div>
            <div className="office-row">
              <label>Date of Joining :</label>
              <input type="date" className="office-input" />
              <label>Signature of Principal :</label>
              <div className="principal-signature"></div>
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
        </div>
      </form>
    </div>
  )
}
