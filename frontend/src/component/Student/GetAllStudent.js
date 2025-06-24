import React, { useState, useEffect } from "react";
import AdminNavbar from "../../admin/AdminNavbar";
import { toast } from "react-toastify";
import {
  Eye, Edit, Users, User, Mail, Phone, Calendar, MapPin, GraduationCap, BookOpen, Hash, Search, X, Building, Award, Clock
} from "lucide-react";


const styles = {
  pageContainer: {
    paddingTop: "90px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingBottom: "20px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    color: "#333",
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  searchBarContainer: {
    marginBottom: "24px",
    maxWidth: "400px",
    marginLeft: "auto",
    marginRight: "auto",
    position: "relative",
  },
  searchInput: {
    width: "100%",
    padding: "10px 36px 10px 36px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  searchIcon: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#aaa",
  },
  clearButton: {
    position: "absolute",
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#888",
    fontSize: "18px",
    padding: 0,
  },
  foundText: {
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
    marginTop: "6px",
    marginBottom: "0",
  },
  teacherGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  teacherCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  teacherImage: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "15px",
    border: "3px solid #4f46e5",
    background: "#e0e7ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    color: "#4f46e5",
    fontWeight: "bold",
  },
  teacherName: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "5px",
    textAlign: "center",
  },
  teacherDetail: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "5px",
    textAlign: "center",
  },
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "10px",
    marginRight: "8px",
    border: "1px solid #e5e7eb",
    background: "#f3f4f6",
    color: "#555",
  },
  statusActive: {
    background: "#e6f9ed",
    color: "#28a745",
    border: "1px solid #b7f0d0",
  },
  statusInactive: {
    background: "#fde8e8",
    color: "#dc3545",
    border: "1px solid #f5bcbc",
  },
  loadingMessage: {
    textAlign: "center",
    fontSize: "18px",
    color: "#555",
    marginTop: "50px",
  },
  errorMessage: {
    textAlign: "center",
    fontSize: "18px",
    color: "red",
    marginTop: "50px",
  },
  dialogOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.3)",
    zIndex: 1000,
  },
  dialogContent: {
    position: "fixed",
    top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    padding: "32px",
    maxWidth: "600px",
    width: "95vw",
    maxHeight: "90vh",
    overflowY: "auto",
    zIndex: 1001,
  },
  dialogClose: {
    position: "absolute",
    top: 12,
    right: 16,
    background: "none",
    border: "none",
    fontSize: 22,
    cursor: "pointer",
    color: "#888",
  },
  dialogSectionTitle: {
    fontWeight: 600,
    fontSize: 18,
    margin: "18px 0 8px 0",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  dialogLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: 500,
  },
  dialogValue: {
    fontSize: 16,
    color: "#222",
    marginBottom: 6,
  },
  dialogRow: {
    display: "flex",
    gap: 24,
    marginBottom: 10,
  },
  dialogCol: {
    flex: 1,
  },
  dialogActions: {
    display: "flex",
    gap: 12,
    marginTop: 24,
  },
  dialogButton: {
    flex: 1,
    background: "#4f46e5",
    color: "#fff",
    padding: "12px 0",
    border: "none",
    borderRadius: 6,
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  dialogButtonOutline: {
    flex: 1,
    background: "#f3f4f6",
    color: "#333",
    padding: "12px 0",
    border: "1px solid #ccc",
    borderRadius: 6,
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
  },
};

function getStatusStyle(status) {
  return status
    ? { ...styles.badge, ...styles.statusActive }
    : { ...styles.badge, ...styles.statusInactive };
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const GetAllStudent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter((student) => {
    if (!searchQuery.trim()) return true;
    const lastName = student.lastName || student.LastName || "";
    const query = searchQuery.toLowerCase();
    const fullName = `${student.firstName} ${lastName}`.toLowerCase();
    const empId = student.empId?.toLowerCase() || "";
    const studentId = student.studentId?.toLowerCase() || "";
    const experience = student.experience?.toLowerCase() || "";
    if (experience && experience.toLowerCase().includes(query)) return true;
    const department = student.department?.toLowerCase() || "";
    return (
      fullName.includes(query) ||
      empId.includes(query) ||
      studentId.includes(query) ||
      department.includes(query) ||
      student.firstName?.toLowerCase().includes(query) ||
      lastName.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("adminToken") ;
        if (!token) {
          toast.error("Please login to continue");
          setLoading(false);
          return;
        }
        const response = await fetch("http://localhost:5000/api/students/getallstudent", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStudents(data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch students");
        toast.error(err.message || "Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };

  const handleUpdateStudent = (student) => {
    toast.info(`Redirecting to update ${student.firstName} ${student.lastName || student.LastName}`);
    // Add navigation logic here if needed
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div style={styles.pageContainer}>
          <div style={styles.loadingMessage}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p style={{ marginTop: 16 }}>Loading students...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminNavbar />
        <div style={styles.pageContainer}>
          <p style={styles.errorMessage}>Error fetching students: {error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div style={styles.pageContainer}>
        <h2 style={styles.header}>All Students</h2>
        {/* Search Bar */}
        <div style={styles.searchBarContainer}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, ID, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          {searchQuery && (
            <button style={styles.clearButton} onClick={() => setSearchQuery("")} title="Clear">
              <X size={16} />
            </button>
          )}
          {searchQuery && (
            <p style={styles.foundText}>
              Found {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""} matching "{searchQuery}"
            </p>
          )}
        </div>
        {filteredStudents.length === 0 ? (
          <div style={styles.loadingMessage}>
            <Users size={64} style={{ color: "#bbb", marginBottom: 12 }} />
            <p>No students found.</p>
          </div>
        ) : (
          <div style={styles.teacherGrid}>
            {filteredStudents.map((student) => (
              <div key={student.empId || student.studentId} style={styles.teacherCard}>
                {student.imageUrl ? (
                  <img
                    src={student.imageUrl}
                    alt={`${student.firstName} ${student.lastName || student.LastName}`}
                    style={styles.teacherImage}
                  />
                ) : (
                  <div style={styles.teacherImage}>
                    {student.firstName?.[0] || ""}
                    {(student.lastName || student.LastName)?.[0] || ""}
                  </div>
                )}
                <p style={styles.teacherName}>
                  {student.firstName} {student.lastName || student.LastName}
                </p>
                <p style={styles.teacherDetail}>
                  <b>ID:</b> {student.studentId || "N/A"}
                </p>
                <p style={styles.teacherDetail}>
                  <b>Department:</b> {student.department || "N/A"}
                </p>
                <p style={styles.teacherDetail}>
                  <b>Experience:</b> {student.experience || "N/A"}
                </p>
                <span style={getStatusStyle(student.status ?? false)}>
                  {student.status ? "Active" : "Inactive"}
                </span>
                <button
                  onClick={() => handleViewDetails( student)}
                  style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    backgroundColor: "#4f46e5",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Eye size={16} /> View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Student Details Dialog */}
        {isDialogOpen && selectedStudent && (
          <>
            <div style={styles.dialogOverlay} onClick={() => setIsDialogOpen(false)} />
            <div style={styles.dialogContent}>
              <button style={styles.dialogClose} onClick={() => setIsDialogOpen(false)} title="Close">
                &times;
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <User size={24} />
                <span style={{ fontWeight: 700, fontSize: 22 }}>Student Details</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24 }}>
                {selectedStudent.imageUrl ? (
                  <img
                    src={selectedStudent.imageUrl}
                    alt={`${selectedStudent.firstName} ${selectedStudent.lastName || selectedStudent.LastName}`}
                    style={{ width: 100, height: 100, borderRadius: "50%", border: "3px solid #4f46e5", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ ...styles.teacherImage, width: 100, height: 100, fontSize: 36 }}>
                    {selectedStudent.firstName?.[0] || ""}
                    {(selectedStudent.lastName || selectedStudent.LastName)?.[0] || ""}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 600, fontSize: 20 }}>
                    {selectedStudent.firstName} {selectedStudent.lastName || selectedStudent.LastName}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <span style={getStatusStyle(selectedStudent.status ?? false)}>
                      {selectedStudent.status ? "Active" : "Inactive"}
                    </span>
                    <span style={styles.badge}>{selectedStudent.class || "No Class"}</span>
                    <span style={styles.badge}>{selectedStudent.gender || "N/A"}</span>
                  </div>
                </div>
              </div>
              <hr style={{ margin: "18px 0" }} />

              {/* Personal Information */}
              <div>
                <div style={styles.dialogSectionTitle}>
                  <User size={18} /> Personal Information
                </div>
                <div style={styles.dialogRow}>
                  <div style={styles.dialogCol}>
                    <div>
                      <span style={styles.dialogLabel}>Student ID</span>
                      <div style={styles.dialogValue}>
                        <Hash size={14} style={{ marginRight: 4 }} />
                        {selectedStudent.studentId || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span style={styles.dialogLabel}>Date of Birth</span>
                      <div style={styles.dialogValue}>
                        <Calendar size={14} style={{ marginRight: 4 }} />
                        {formatDate(selectedStudent.dateOfBirth || "")}
                      </div>
                    </div>
                    <div>
                      <span style={styles.dialogLabel}>Blood Group</span>
                      <div style={styles.dialogValue}>{selectedStudent.bloodGroup || "N/A"}</div>
                    </div>
                    <div>
                      <span style={styles.dialogLabel}>Address</span>
                      <div style={styles.dialogValue}>
                        <MapPin size={14} style={{ marginRight: 4 }} />
                        {selectedStudent.address || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div style={styles.dialogCol}>
                    <div>
                      <span style={styles.dialogLabel}>Phone Number</span>
                      <div style={styles.dialogValue}>
                        <Phone size={14} style={{ marginRight: 4 }} />
                        {selectedStudent.phone || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span style={styles.dialogLabel}>Email</span>
                      <div style={styles.dialogValue}>
                        <Mail size={14} style={{ marginRight: 4 }} />
                        {selectedStudent.email || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span style={styles.dialogLabel}>Emergency Contact</span>
                      <div style={styles.dialogValue}>
                        <Phone size={14} style={{ marginRight: 4 }} />
                        {selectedStudent.emergencyContact || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span style={styles.dialogLabel}>Date of Joining</span>
                      <div style={styles.dialogValue}>
                        <Calendar size={14} style={{ marginRight: 4 }} />
                        {formatDate(selectedStudent.dateOfJoining || "")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr style={{ margin: "18px 0" }} />

              {/* Professional Information */}
              <div>
                <div style={styles.dialogSectionTitle}>
                  <GraduationCap size={18} /> Professional Information
                </div>
                <div style={styles.dialogRow}>
                  <div style={styles.dialogCol}>
                    <div>
                      <span style={styles.dialogLabel}>Department</span>
                      <div style={styles.dialogValue}>
                        <Building size={14} style={{ marginRight: 4 }} />
                        {selectedStudent.department || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span style={styles.dialogLabel}>Qualification</span>
                      <div style={styles.dialogValue}>
                        <Award size={14} style={{ marginRight: 4 }} />
                        {selectedStudent.qualification || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div style={styles.dialogCol}>
                    <div>
                      <span style={styles.dialogLabel}>Experience</span>
                      <div style={styles.dialogValue}>
                        <Clock size={14} style={{ marginRight: 4 }} />
                        {selectedStudent.experience || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span style={styles.dialogLabel}>Specialization</span>
                      <div style={styles.dialogValue}>
                        <BookOpen size={14} style={{ marginRight: 4 }} />
                        {selectedStudent.specialization || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {selectedStudent.salary && (
                <>
                  <hr style={{ margin: "18px 0" }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Salary Information</div>
                    <div>
                      <span style={styles.dialogLabel}>Monthly Salary</span>
                      <div style={{ ...styles.dialogValue, fontWeight: 700, fontSize: 18 }}>
                        ₹{selectedStudent.salary?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </>
              )}
              <hr style={{ margin: "18px 0" }} />
              <div style={styles.dialogActions}>
                <button
                  style={styles.dialogButton}
                  onClick={() => handleUpdateStudent(selectedStudent)}
                >
                  <Edit size={16} style={{ marginRight: 6 }} />
                  Update Student
                </button>
                <button
                  style={styles.dialogButtonOutline}
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GetAllStudent;
