import React, { useState } from "react";

const InquiryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    fatherName: "",
    motherName: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    previousClass: "",
    currentClass: "",
    schoolInfo: false,
    schoolVisit: false,
    aboutFees: false
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inquiryId = "INQ" + Math.floor(1000 + Math.random() * 9000);
    const dataWithId = { ...formData, inquiryId };
    
    // Here you would typically make an API call to submit the form
    // For now, we'll just show an alert
    alert("Inquiry Submitted:\n" + JSON.stringify(dataWithId, null, 2));
    
    setFormData({
      name: "",
      imageUrl: "",
      fatherName: "",
      motherName: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      email: "",
      previousClass: "",
      currentClass: "",
      schoolInfo: false,
      schoolVisit: false,
      aboutFees: false
    });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Student Inquiry Form</h2>

      <input
        name="name"
        placeholder="Student Name"
        value={formData.name}
        onChange={handleChange}
        required
        style={styles.input}
      />

      <input
        name="imageUrl"
        placeholder="Student Photo URL"
        value={formData.imageUrl}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        name="fatherName"
        placeholder="Father's Name"
        value={formData.fatherName}
        onChange={handleChange}
        required
        style={styles.input}
      />

      <input
        name="motherName"
        placeholder="Mother's Name"
        value={formData.motherName}
        onChange={handleChange}
        required
        style={styles.input}
      />

      <input
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
        required
        style={styles.input}
      />

      <input
        name="state"
        placeholder="State"
        value={formData.state}
        onChange={handleChange}
        required
        style={styles.input}
      />

      <input
        name="pincode"
        placeholder="Pincode"
        value={formData.pincode}
        onChange={handleChange}
        required
        style={styles.input}
      />

      <input
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        required
        style={styles.input}
      />

      <input
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        style={styles.input}
      />

      <select
        name="previousClass"
        value={formData.previousClass}
        onChange={handleChange}
        required
        style={styles.input}
      >
        <option value="">Previous Class</option>
        <option value="Nursery">Nursery</option>
        <option value="LKG">LKG</option>
        <option value="UKG">UKG</option>
        <option value="Class 1">Class 1</option>
        <option value="Class 2">Class 2</option>
        <option value="Class 3">Class 3</option>
        <option value="Class 4">Class 4</option>
        <option value="Class 5">Class 5</option>
        <option value="Class 6">Class 6</option>
        <option value="Class 7">Class 7</option>
        <option value="Class 8">Class 8</option>
        <option value="Class 9">Class 9</option>
        <option value="Class 10">Class 10</option>
      </select>

      <select
        name="currentClass"
        value={formData.currentClass}
        onChange={handleChange}
        required
        style={styles.input}
      >
        <option value="">Current Class Applying For</option>
        <option value="Nursery">Nursery</option>
        <option value="LKG">LKG</option>
        <option value="UKG">UKG</option>
        <option value="Class 1">Class 1</option>
        <option value="Class 2">Class 2</option>
        <option value="Class 3">Class 3</option>
        <option value="Class 4">Class 4</option>
        <option value="Class 5">Class 5</option>
        <option value="Class 6">Class 6</option>
        <option value="Class 7">Class 7</option>
        <option value="Class 8">Class 8</option>
        <option value="Class 9">Class 9</option>
        <option value="Class 10">Class 10</option>
      </select>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            name="schoolInfo"
            checked={formData.schoolInfo}
            onChange={handleChange}
          />
          Received School Information
        </label>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            name="schoolVisit"
            checked={formData.schoolVisit}
            onChange={handleChange}
          />
          School Visit Done
        </label>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            name="aboutFees"
            checked={formData.aboutFees}
            onChange={handleChange}
          />
          Inquired About Fees
        </label>
      </div>

      <button type="submit" style={styles.button}>
        Submit Inquiry
      </button>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: "600px",
    margin: "auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
};

export default InquiryForm;