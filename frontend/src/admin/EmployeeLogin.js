
import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar";


const EmployeeLogin = ({ onClose = () => {} }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const roles = ["Teacher", "Student",  "Principal", "Coordinator"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMessage("");
  };

  const handleRoleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.value,
    }));
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (Math.random() > 0.3) {
        setMessage("Credentials created successfully!");
        setIsSuccess(true);
        setFormData({
          email: "",
          password: "",
          role: "",
        });
      } else {
        throw new Error("Failed to create user. Please try again.");
      }
    } catch (err) {
      setMessage(err.message);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner {
          width: 12px;
          height: 12px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
      `}</style>
      <AdminNavbar/>

      <div style={{marginTop:'20px', minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div style={{ maxWidth: "450px", width: "100%", padding: "2rem", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.5rem", textAlign: "center", color: "#1f2937" }}>
            Set Employee Login Credentials
          </h3>

          {message && (
            <div style={{
              marginBottom: "1rem",
              padding: "0.75rem 1rem",
              borderRadius: "6px",
              fontSize: "0.875rem",
              fontWeight: "500",
              textAlign: "center",
              color: isSuccess ? "#166534" : "#dc2626",
              backgroundColor: isSuccess ? "#dcfce7" : "#fef2f2",
              border: `1px solid ${isSuccess ? "#bbf7d0" : "#fecaca"}`
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#374151", fontSize: "0.875rem", fontWeight: "500" }}>Email ID</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter employee's email"
                style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "1rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#374151", fontSize: "0.875rem", fontWeight: "500" }}>Password</label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "1rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#374151", fontSize: "0.875rem", fontWeight: "500" }}>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                required
                style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "1rem" }}
              >
                <option value="">-- Select Role --</option>
                {roles.map((role) => (
                  <option key={role} value={role.toLowerCase()}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "0.75rem 1.5rem",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  border: "none",
                  color: "#fff",
                  backgroundColor: loading ? "#9ca3af" : "#3b82f6",
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ marginRight: "0.5rem" }}></div>
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </button>

              <button
                type="button"
                onClick={()=>window.location.reload()}
                style={{
                  flex: 1,
                  padding: "0.75rem 1.5rem",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  border: "1px solid rgb(201, 207, 216)",
                  backgroundColor: "#f9fafb",
                  color: "#374151",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EmployeeLogin;
