
import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";


const EmployeeLogin = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { email } = useParams();
  const [formData, setFormData] = useState({
    email: email,
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMessage("");
  };


  const navigate = useNavigate();

  const removeUserAccess = async () => {
    const token = sessionStorage.getItem('adminToken');
    if (!token) {
      toast.error('Please login as admin to continue');
      navigate('/');
      return;
    }

    try {
      const res = await fetch(`https://school-erp-11-mr7k.onrender.com/api/auth/delete/user/${email}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if(!res.ok){
      throw new Error('Something went wrong')
    }

    const data = res.json();
    toast.success(data.message);
    navigate('/admin/employees')
    
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }

    


  }

  useEffect(() => {
    const fetchEmployeeRole = async () => {
      const token = sessionStorage.getItem('adminToken');
      if (!token) {
        toast.error('Please login as admin to continue');
        navigate('/');
        return;
      }

      try {
        const resp = await fetch(`https://school-erp-11-mr7k.onrender.com/api/employees/get/employee/email/${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!resp.ok) {
          throw new Error('Failed to fetch employee details. Please try again later.');
        }

        const data = await resp.json();

        if (data.role) {
          setFormData(prev => ({
            ...prev,
            role: data.role
          }));
        } else {
          toast.error('Could not determine employee role.');
        }
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      }
    };
    fetchEmployeeRole();
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const token = sessionStorage.getItem('adminToken');
      if (!token) {
        toast.error('Please login as admin to continue');
        navigate('/');
        return;
      }
      const res = await fetch('https://school-erp-11-mr7k.onrender.com/api/auth/create/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create user. Please try again later.');
      }
      const data = await res.json();
      setMessage(data.message);
      toast.success(data.message || "User created successfully!");
      setIsSuccess(true);
      setFormData({
        email: "",
        password: "",
        role: "",
      });



    } catch (err) {
      toast.error(err.message);
      setMessage(err.message);
      setIsSuccess(false);
      console.log(err)
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
      <AdminNavbar />

      <div style={{ marginTop: '20px', minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
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
                disabled
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
              <input
                type="role"
                name="role"
                value={formData.role}
                disabled
                required
                placeholder="Enter employee's role"
                style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "1rem" }}
              />
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
                onClick={() => window.location.reload()}
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
              <button
                type="button"

                style={{
                  flex: 1,
                  padding: "0.75rem 1.5rem",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  border: "1px solid rgb(201, 207, 216)",
                  backgroundColor: "#f51414ff",
                  color: "#374151",
                  cursor: "pointer"
                }}

                onClick={() => removeUserAccess()}

              >
                Remove Access
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EmployeeLogin;
