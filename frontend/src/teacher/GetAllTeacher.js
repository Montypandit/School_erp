// import React, { useState, useEffect } from "react";
// import AdminNavbar from "../admin/AdminNavbar";
// import { toast } from "react-toastify";
// import {
//   Eye, Edit, Users, User, Mail, Phone, Calendar, MapPin, GraduationCap, BookOpen, Hash, Search, X, Building, Award, Clock
// } from "lucide-react";


// const styles = {
//   pageContainer: {
//     paddingTop: "90px",
//     paddingLeft: "20px",
//     paddingRight: "20px",
//     paddingBottom: "20px",
//     fontFamily: "Arial, sans-serif",
//   },
//   header: {
//     textAlign: "center",
//     color: "#333",
//     marginBottom: "30px",
//     fontSize: "28px",
//     fontWeight: "bold",
//     cursor: "pointer",
//   },
//   searchBarContainer: {
//     marginBottom: "24px",
//     maxWidth: "400px",
//     marginLeft: "auto",
//     marginRight: "auto",
//     position: "relative",
//   },
//   searchInput: {
//     width: "100%",
//     padding: "10px 36px 10px 36px",
//     borderRadius: "6px",
//     border: "1px solid #ccc",
//     fontSize: "16px",
//   },
//   searchIcon: {
//     position: "absolute",
//     left: "10px",
//     top: "50%",
//     transform: "translateY(-50%)",
//     color: "#aaa",
//   },
//   clearButton: {
//     position: "absolute",
//     right: "8px",
//     top: "50%",
//     transform: "translateY(-50%)",
//     background: "none",
//     border: "none",
//     cursor: "pointer",
//     color: "#888",
//     fontSize: "18px",
//     padding: 0,
//   },
//   foundText: {
//     textAlign: "center",
//     fontSize: "14px",
//     color: "#666",
//     marginTop: "6px",
//     marginBottom: "0",
//   },
//   teacherGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
//     gap: "20px",
//   },
//   teacherCard: {
//     border: "1px solid #ddd",
//     borderRadius: "8px",
//     padding: "20px",
//     backgroundColor: "#fff",
//     boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//   },
//   teacherImage: {
//     width: "120px",
//     height: "120px",
//     borderRadius: "50%",
//     objectFit: "cover",
//     marginBottom: "15px",
//     border: "3px solid #4f46e5",
//     background: "#e0e7ff",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "2rem",
//     color: "#4f46e5",
//     fontWeight: "bold",
//   },
//   teacherName: {
//     fontSize: "20px",
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: "5px",
//     textAlign: "center",
//   },
//   teacherDetail: {
//     fontSize: "16px",
//     color: "#555",
//     marginBottom: "5px",
//     textAlign: "center",
//   },
//   badge: {
//     display: "inline-block",
//     padding: "4px 12px",
//     borderRadius: "12px",
//     fontWeight: "bold",
//     fontSize: "14px",
//     marginBottom: "10px",
//     marginRight: "8px",
//     border: "1px solid #e5e7eb",
//     background: "#f3f4f6",
//     color: "#555",
//   },
//   statusActive: {
//     background: "#e6f9ed",
//     color: "#28a745",
//     border: "1px solid #b7f0d0",
//   },
//   statusInactive: {
//     background: "#fde8e8",
//     color: "#dc3545",
//     border: "1px solid #f5bcbc",
//   },
//   loadingMessage: {
//     textAlign: "center",
//     fontSize: "18px",
//     color: "#555",
//     marginTop: "50px",
//   },
//   errorMessage: {
//     textAlign: "center",
//     fontSize: "18px",
//     color: "red",
//     marginTop: "50px",
//   },
//   dialogOverlay: {
//     position: "fixed",
//     top: 0, left: 0, right: 0, bottom: 0,
//     background: "rgba(0,0,0,0.3)",
//     zIndex: 1000,
//   },
//   dialogContent: {
//     position: "fixed",
//     top: "50%", left: "50%",
//     transform: "translate(-50%, -50%)",
//     background: "#fff",
//     borderRadius: "12px",
//     boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
//     padding: "32px",
//     maxWidth: "600px",
//     width: "95vw",
//     maxHeight: "90vh",
//     overflowY: "auto",
//     zIndex: 1001,
//   },
//   dialogClose: {
//     position: "absolute",
//     top: 12,
//     right: 16,
//     background: "none",
//     border: "none",
//     fontSize: 22,
//     cursor: "pointer",
//     color: "#888",
//   },
//   dialogSectionTitle: {
//     fontWeight: 600,
//     fontSize: 18,
//     margin: "18px 0 8px 0",
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//   },
//   dialogLabel: {
//     fontSize: 14,
//     color: "#666",
//     fontWeight: 500,
//   },
//   dialogValue: {
//     fontSize: 16,
//     color: "#222",
//     marginBottom: 6,
//   },
//   dialogRow: {
//     display: "flex",
//     gap: 24,
//     marginBottom: 10,
//   },
//   dialogCol: {
//     flex: 1,
//   },
//   dialogActions: {
//     display: "flex",
//     gap: 12,
//     marginTop: 24,
//   },
//   dialogButton: {
//     flex: 1,
//     background: "#4f46e5",
//     color: "#fff",
//     padding: "12px 0",
//     border: "none",
//     borderRadius: 6,
//     fontWeight: 600,
//     fontSize: 16,
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   },
//   dialogButtonOutline: {
//     flex: 1,
//     background: "#f3f4f6",
//     color: "#333",
//     padding: "12px 0",
//     border: "1px solid #ccc",
//     borderRadius: 6,
//     fontWeight: 600,
//     fontSize: 16,
//     cursor: "pointer",
//   },
// };

// function getStatusStyle(status) {
//   return status
//     ? { ...styles.badge, ...styles.statusActive }
//     : { ...styles.badge, ...styles.statusInactive };
// }

// function formatDate(dateString) {
//   if (!dateString) return "N/A";
//   return new Date(dateString).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
// }

// const GetAllTeacher = () => {
//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedTeacher, setSelectedTeacher] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const filteredTeachers = teachers.filter((teacher) => {
//     if (!searchQuery.trim()) return true;
//     const lastName = teacher.lastName || teacher.LastName || "";
//     const query = searchQuery.toLowerCase();
//     const fullName = `${teacher.firstName} ${lastName}`.toLowerCase();
//     const empId = teacher.empId?.toLowerCase() || "";
//     const teacherId = teacher.teacherId?.toLowerCase() || "";
//     const experience = teacher.experience?.toLowerCase() || "";
//     if (experience && experience.toLowerCase().includes(query)) return true;
//     const department = teacher.department?.toLowerCase() || "";
//     return (
//       fullName.includes(query) ||
//       empId.includes(query) ||
//       teacherId.includes(query) ||
//       department.includes(query) ||
//       teacher.firstName?.toLowerCase().includes(query) ||
//       lastName.toLowerCase().includes(query)
//     );
//   });

//   useEffect(() => {
//     const fetchTeachers = async () => {
//       try {
//         setLoading(true);
//         const token = sessionStorage.getItem("adminToken") ;
//         if (!token) {
//           toast.error("Please login to continue");
//           setLoading(false);
//           return;
//         }
//         const response = await fetch("https://school-erp-11-mr7k.onrender.com/api/teachers/getallteacher", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         setTeachers(data || []);
//       } catch (err) {
//         setError(err.message || "Failed to fetch teachers");
//         toast.error(err.message || "Failed to fetch teachers");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTeachers();
//   }, []);

//   const handleViewDetails = (teacher) => {
//     setSelectedTeacher(teacher);
//     setIsDialogOpen(true);
//   };

//   const handleUpdateTeacher = (teacher) => {
//     toast.info(`Redirecting to update ${teacher.firstName} ${teacher.lastName || teacher.LastName}`);
//     // Add navigation logic here if needed
//   };

//   if (loading) {
//     return (
//       <>
//         <AdminNavbar />
//         <div style={styles.pageContainer}>
//           <div style={styles.loadingMessage}>
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//             <p style={{ marginTop: 16 }}>Loading teachers...</p>
//           </div>
//         </div>
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <AdminNavbar />
//         <div style={styles.pageContainer}>
//           <p style={styles.errorMessage}>Error fetching teachers: {error}</p>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <AdminNavbar />
//       <div style={styles.pageContainer}>
//         <h2 style={styles.header}>All Teachers</h2>
//         {/* Search Bar */}
//         <div style={styles.searchBarContainer}>
//           <Search size={18} style={styles.searchIcon} />
//           <input
//             type="text"
//             placeholder="Search by name, ID, or department..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             style={styles.searchInput}
//           />
//           {searchQuery && (
//             <button style={styles.clearButton} onClick={() => setSearchQuery("")} title="Clear">
//               <X size={16} />
//             </button>
//           )}
//           {searchQuery && (
//             <p style={styles.foundText}>
//               Found {filteredTeachers.length} teacher{filteredTeachers.length !== 1 ? "s" : ""} matching "{searchQuery}"
//             </p>
//           )}
//         </div>
//         {filteredTeachers.length === 0 ? (
//           <div style={styles.loadingMessage}>
//             <Users size={64} style={{ color: "#bbb", marginBottom: 12 }} />
//             <p>No teachers found.</p>
//           </div>
//         ) : (
//           <div style={styles.teacherGrid}>
//             {filteredTeachers.map((teacher) => (
//               <div key={teacher.empId || teacher.teacherId} style={styles.teacherCard}>
//                 {teacher.imageUrl ? (
//                   <img
//                     src={teacher.imageUrl}
//                     alt={`${teacher.firstName} ${teacher.lastName || teacher.LastName}`}
//                     style={styles.teacherImage}
//                   />
//                 ) : (
//                   <div style={styles.teacherImage}>
//                     {teacher.firstName?.[0] || ""}
//                     {(teacher.lastName || teacher.LastName)?.[0] || ""}
//                   </div>
//                 )}
//                 <p style={styles.teacherName}>
//                   {teacher.firstName} {teacher.lastName || teacher.LastName}
//                 </p>
//                 <p style={styles.teacherDetail}>
//                   <b>ID:</b> {teacher.empId || teacher.teacherId || "N/A"}
//                 </p>
//                 <p style={styles.teacherDetail}>
//                   <b>Department:</b> {teacher.department || "N/A"}
//                 </p>
//                 <p style={styles.teacherDetail}>
//                   <b>Experience:</b> {teacher.experience || "N/A"}
//                 </p>
//                 <span style={getStatusStyle(teacher.status ?? false)}>
//                   {teacher.status ? "Active" : "Inactive"}
//                 </span>
//                 <button
//                   onClick={() => handleViewDetails(teacher)}
//                   style={{
//                     marginTop: "10px",
//                     padding: "8px 16px",
//                     backgroundColor: "#4f46e5",
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: "5px",
//                     cursor: "pointer",
//                     fontWeight: "bold",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 8,
//                   }}
//                 >
//                   <Eye size={16} /> View Details
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Teacher Details Dialog */}
//         {isDialogOpen && selectedTeacher && (
//           <>
//             <div style={styles.dialogOverlay} onClick={() => setIsDialogOpen(false)} />
//             <div style={styles.dialogContent}>
//               <button style={styles.dialogClose} onClick={() => setIsDialogOpen(false)} title="Close">
//                 &times;
//               </button>
//               <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
//                 <User size={24} />
//                 <span style={{ fontWeight: 700, fontSize: 22 }}>Teacher Details</span>
//               </div>
//               <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24 }}>
//                 {selectedTeacher.imageUrl ? (
//                   <img
//                     src={selectedTeacher.imageUrl}
//                     alt={`${selectedTeacher.firstName} ${selectedTeacher.lastName || selectedTeacher.LastName}`}
//                     style={{ width: 100, height: 100, borderRadius: "50%", border: "3px solid #4f46e5", objectFit: "cover" }}
//                   />
//                 ) : (
//                   <div style={{ ...styles.teacherImage, width: 100, height: 100, fontSize: 36 }}>
//                     {selectedTeacher.firstName?.[0] || ""}
//                     {(selectedTeacher.lastName || selectedTeacher.LastName)?.[0] || ""}
//                   </div>
//                 )}
//                 <div>
//                   <div style={{ fontWeight: 600, fontSize: 20 }}>
//                     {selectedTeacher.firstName} {selectedTeacher.lastName || selectedTeacher.LastName}
//                   </div>
//                   <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
//                     <span style={getStatusStyle(selectedTeacher.status ?? false)}>
//                       {selectedTeacher.status ? "Active" : "Inactive"}
//                     </span>
//                     <span style={styles.badge}>{selectedTeacher.department || "No Department"}</span>
//                     <span style={styles.badge}>{selectedTeacher.gender || "N/A"}</span>
//                   </div>
//                 </div>
//               </div>
//               <hr style={{ margin: "18px 0" }} />

//               {/* Personal Information */}
//               <div>
//                 <div style={styles.dialogSectionTitle}>
//                   <User size={18} /> Personal Information
//                 </div>
//                 <div style={styles.dialogRow}>
//                   <div style={styles.dialogCol}>
//                     <div>
//                       <span style={styles.dialogLabel}>Employee ID</span>
//                       <div style={styles.dialogValue}>
//                         <Hash size={14} style={{ marginRight: 4 }} />
//                         {selectedTeacher.empId || selectedTeacher.teacherId || "N/A"}
//                       </div>
//                     </div>
//                     <div>
//                       <span style={styles.dialogLabel}>Date of Birth</span>
//                       <div style={styles.dialogValue}>
//                         <Calendar size={14} style={{ marginRight: 4 }} />
//                         {formatDate(selectedTeacher.dateOfBirth || "")}
//                       </div>
//                     </div>
//                     <div>
//                       <span style={styles.dialogLabel}>Blood Group</span>
//                       <div style={styles.dialogValue}>{selectedTeacher.bloodGroup || "N/A"}</div>
//                     </div>
//                     <div>
//                       <span style={styles.dialogLabel}>Address</span>
//                       <div style={styles.dialogValue}>
//                         <MapPin size={14} style={{ marginRight: 4 }} />
//                         {selectedTeacher.address || "N/A"}
//                       </div>
//                     </div>
//                   </div>
//                   <div style={styles.dialogCol}>
//                     <div>
//                       <span style={styles.dialogLabel}>Phone Number</span>
//                       <div style={styles.dialogValue}>
//                         <Phone size={14} style={{ marginRight: 4 }} />
//                         {selectedTeacher.phone || "N/A"}
//                       </div>
//                     </div>
//                     <div>
//                       <span style={styles.dialogLabel}>Email</span>
//                       <div style={styles.dialogValue}>
//                         <Mail size={14} style={{ marginRight: 4 }} />
//                         {selectedTeacher.email || "N/A"}
//                       </div>
//                     </div>
//                     <div>
//                       <span style={styles.dialogLabel}>Emergency Contact</span>
//                       <div style={styles.dialogValue}>
//                         <Phone size={14} style={{ marginRight: 4 }} />
//                         {selectedTeacher.emergencyContact || "N/A"}
//                       </div>
//                     </div>
//                     <div>
//                       <span style={styles.dialogLabel}>Date of Joining</span>
//                       <div style={styles.dialogValue}>
//                         <Calendar size={14} style={{ marginRight: 4 }} />
//                         {formatDate(selectedTeacher.dateOfJoining || "")}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <hr style={{ margin: "18px 0" }} />

//               {/* Professional Information */}
//               <div>
//                 <div style={styles.dialogSectionTitle}>
//                   <GraduationCap size={18} /> Professional Information
//                 </div>
//                 <div style={styles.dialogRow}>
//                   <div style={styles.dialogCol}>
//                     <div>
//                       <span style={styles.dialogLabel}>Department</span>
//                       <div style={styles.dialogValue}>
//                         <Building size={14} style={{ marginRight: 4 }} />
//                         {selectedTeacher.department || "N/A"}
//                       </div>
//                     </div>
//                     <div>
//                       <span style={styles.dialogLabel}>Qualification</span>
//                       <div style={styles.dialogValue}>
//                         <Award size={14} style={{ marginRight: 4 }} />
//                         {selectedTeacher.qualification || "N/A"}
//                       </div>
//                     </div>
//                   </div>
//                   <div style={styles.dialogCol}>
//                     <div>
//                       <span style={styles.dialogLabel}>Experience</span>
//                       <div style={styles.dialogValue}>
//                         <Clock size={14} style={{ marginRight: 4 }} />
//                         {selectedTeacher.experience || "N/A"}
//                       </div>
//                     </div>
//                     <div>
//                       <span style={styles.dialogLabel}>Specialization</span>
//                       <div style={styles.dialogValue}>
//                         <BookOpen size={14} style={{ marginRight: 4 }} />
//                         {selectedTeacher.specialization || "N/A"}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {selectedTeacher.salary && (
//                 <>
//                   <hr style={{ margin: "18px 0" }} />
//                   <div>
//                     <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Salary Information</div>
//                     <div>
//                       <span style={styles.dialogLabel}>Monthly Salary</span>
//                       <div style={{ ...styles.dialogValue, fontWeight: 700, fontSize: 18 }}>
//                         ₹{selectedTeacher.salary?.toLocaleString()}
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               )}
//               <hr style={{ margin: "18px 0" }} />
//               <div style={styles.dialogActions}>
//                 <button
//                   style={styles.dialogButton}
//                   onClick={() => handleUpdateTeacher(selectedTeacher)}
//                 >
//                   <Edit size={16} style={{ marginRight: 6 }} />
//                   Update Teacher
//                 </button>
//                 <button
//                   style={styles.dialogButtonOutline}
//                   onClick={() => setIsDialogOpen(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </>
//   );
// };

// export default GetAllTeacher;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // for redirecting on 401
import AdminNavbar from "../admin/AdminNavbar";
import { toast } from "react-toastify";
import {
  Eye, Edit, Users, User, Mail, Phone, Calendar, MapPin,
  GraduationCap, BookOpen, Hash, Search, X, Building, Award, Clock
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

const GetAllTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredTeachers = teachers.filter((teacher) => {
    if (!searchQuery.trim()) return true;
    const lastName = teacher.lastName || teacher.LastName || "";
    const query = searchQuery.toLowerCase();
    const fullName = `${teacher.firstName} ${lastName}`.toLowerCase();
    const empId = teacher.empId?.toLowerCase() || "";
    const teacherId = teacher.teacherId?.toLowerCase() || "";
    const experience = teacher.experience?.toLowerCase() || "";
    const department = teacher.department?.toLowerCase() || "";
    return (
      fullName.includes(query) ||
      empId.includes(query) ||
      teacherId.includes(query) ||
      department.includes(query) ||
      teacher.firstName?.toLowerCase().includes(query) ||
      lastName.toLowerCase().includes(query) ||
      (experience && experience.includes(query))
    );
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const startData = sessionStorage.getItem("adminToken");
        const token = startData ? JSON.parse(startData).token : null;
        if (!token) {
          toast.error("Please login to continue");
          navigate("/login");
          return;
        }

        const response = await fetch("https://school-erp-11-mr7k.onrender.com/api/teachers/getallteacher", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          toast.error("Unauthorized! Please login again.");
          sessionStorage.removeItem("adminToken");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTeachers(data || []);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to fetch teachers");
        toast.error(err.message || "Failed to fetch teachers");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [navigate]);

  const handleViewDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setIsDialogOpen(true);
  };

  const handleUpdateTeacher = (teacher) => {
    toast.info(`Redirecting to update ${teacher.firstName} ${teacher.lastName || teacher.LastName || ""}`);
    // Implement navigation logic for update page if needed
    // Example: navigate(`/teachers/update/${teacher.empId || teacher.teacherId}`)
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div style={styles.pageContainer}>
          <div style={styles.loadingMessage}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p style={{ marginTop: 16 }}>Loading teachers...</p>
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
          <p style={styles.errorMessage}>Error fetching teachers: {error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div style={styles.pageContainer}>
        <h2 style={styles.header}>All Teachers</h2>

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
            <button
              style={styles.clearButton}
              onClick={() => setSearchQuery("")}
              title="Clear"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
          {searchQuery && (
            <p style={styles.foundText}>
              Found {filteredTeachers.length} teacher{filteredTeachers.length !== 1 ? "s" : ""} matching "{searchQuery}"
            </p>
          )}
        </div>

        {filteredTeachers.length === 0 ? (
          <div style={styles.loadingMessage}>
            <Users size={64} style={{ color: "#bbb", marginBottom: 12 }} />
            <p>No teachers found.</p>
          </div>
        ) : (
          <div style={styles.teacherGrid}>
            {filteredTeachers.map((teacher) => (
              <div key={teacher.empId || teacher.teacherId} style={styles.teacherCard}>
                {teacher.imageUrl ? (
                  <img
                    src={teacher.imageUrl}
                    alt={`${teacher.firstName} ${teacher.lastName || teacher.LastName}`}
                    style={styles.teacherImage}
                  />
                ) : (
                  <div style={styles.teacherImage}>
                    {teacher.firstName?.[0] || ""}
                    {(teacher.lastName || teacher.LastName)?.[0] || ""}
                  </div>
                )}
                <p style={styles.teacherName}>
                  {teacher.firstName} {teacher.lastName || teacher.LastName}
                </p>
                <p style={styles.teacherDetail}>
                  <b>ID:</b> {teacher.empId || teacher.teacherId || "N/A"}
                </p>
                <p style={styles.teacherDetail}>
                  <b>Department:</b> {teacher.department || "N/A"}
                </p>
                <p style={styles.teacherDetail}>
                  <b>Experience:</b> {teacher.experience || "N/A"}
                </p>
                <span style={getStatusStyle(teacher.status ?? false)}>
                  {teacher.status ? "Active" : "Inactive"}
                </span>
                <button
                  onClick={() => handleViewDetails(teacher)}
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

        {isDialogOpen && selectedTeacher && (
          <>
            <div
              style={styles.dialogOverlay}
              onClick={() => setIsDialogOpen(false)}
              aria-label="Close details dialog"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Escape" && setIsDialogOpen(false)}
            />
            <div style={styles.dialogContent} role="dialog" aria-modal="true">
              <button
                style={styles.dialogClose}
                onClick={() => setIsDialogOpen(false)}
                title="Close"
                aria-label="Close dialog"
              >
                &times;
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <User size={24} />
                <span style={{ fontWeight: 700, fontSize: 22 }}>Teacher Details</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24 }}>
                {selectedTeacher.imageUrl ? (
                  <img
                    src={selectedTeacher.imageUrl}
                    alt={`${selectedTeacher.firstName} ${selectedTeacher.lastName || selectedTeacher.LastName}`}
                    style={{ width: 100, height: 100, borderRadius: "50%", border: "3px solid #4f46e5", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ ...styles.teacherImage, width: 100, height: 100, fontSize: 36 }}>
                    {selectedTeacher.firstName?.[0] || ""}
                    {(selectedTeacher.lastName || selectedTeacher.LastName)?.[0] || ""}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 600, fontSize: 20 }}>
                    {selectedTeacher.firstName} {selectedTeacher.lastName || selectedTeacher.LastName}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <span style={getStatusStyle(selectedTeacher.status ?? false)}>
                      {selectedTeacher.status ? "Active" : "Inactive"}
                    </span>
                    <span style={styles.badge}>{selectedTeacher.department || "No Department"}</span>
                    <span style={styles.badge}>{selectedTeacher.gender || "N/A"}</span>
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
                      <span style={styles.dialogLabel}>Employee ID</span>
                      <div style={styles.dialogValue}>
                        <Hash size={14} style={{ marginRight: 4 }} />
                        {selectedTeacher.empId || selectedTeacher.teacherId || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span style={styles.dialogLabel}>Date of Birth</span>
                      <div style={styles.dialogValue}>
                        <Calendar size={14} style={{ marginRight: 4 }} />
                        {formatDate(selectedTeacher.dateOfBirth || "")}
                      </div>
                    </div>
                    <div>
                      <span style={styles.dialogLabel}>Blood Group</span>
                      <div style={styles.dialogValue}>{selectedTeacher.bloodGroup || "N/A"}</div>
                    </div>
                    <div>
                      <span style={styles.dialogLabel}>Address</span>
                      <div style={styles.dialogValue}>
                        <MapPin size={14} style={{ marginRight: 4 }} />
                        {selectedTeacher.address || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div style={styles.dialogCol}>
                    <div>
                      <span style={styles.dialogLabel}>Mobile Number</span>
                      <div style={styles.dialogValue}>
                        <Phone size={14} style={{ marginRight: 4 }} />
                        {selectedTeacher.mobileNo || selectedTeacher.phone || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span style={styles.dialogLabel}>Email</span>
                      <div style={styles.dialogValue}>
                        <Mail size={14} style={{ marginRight: 4 }} />
                        {selectedTeacher.email || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span style={styles.dialogLabel}>Joining Date</span>
                      <div style={styles.dialogValue}>
                        <Calendar size={14} style={{ marginRight: 4 }} />
                        {formatDate(selectedTeacher.joiningDate || "")}
                      </div>
                    </div>
                    <div>
                      <span style={styles.dialogLabel}>Qualification</span>
                      <div style={styles.dialogValue}>
                        <GraduationCap size={14} style={{ marginRight: 4 }} />
                        {selectedTeacher.qualification || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr style={{ margin: "18px 0" }} />

              {/* Additional Info */}
              <div>
                <div style={styles.dialogSectionTitle}>
                  <Award size={18} /> Additional Information
                </div>
                <div style={styles.dialogRow}>
                  <div style={styles.dialogCol}>
                    <div>
                      <span style={styles.dialogLabel}>Experience</span>
                      <div style={styles.dialogValue}>{selectedTeacher.experience || "N/A"}</div>
                    </div>
                    <div>
                      <span style={styles.dialogLabel}>Department</span>
                      <div style={styles.dialogValue}>{selectedTeacher.department || "N/A"}</div>
                    </div>
                    <div>
                      <span style={styles.dialogLabel}>Designation</span>
                      <div style={styles.dialogValue}>{selectedTeacher.designation || "N/A"}</div>
                    </div>
                  </div>
                  <div style={styles.dialogCol}>
                    <div>
                      <span style={styles.dialogLabel}>Working Hours</span>
                      <div style={styles.dialogValue}>{selectedTeacher.workingHours || "N/A"}</div>
                    </div>
                    <div>
                      <span style={styles.dialogLabel}>Building</span>
                      <div style={styles.dialogValue}>{selectedTeacher.building || "N/A"}</div>
                    </div>
                    <div>
                      <span style={styles.dialogLabel}>Section</span>
                      <div style={styles.dialogValue}>{selectedTeacher.section || "N/A"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.dialogActions}>
                <button
                  style={styles.dialogButtonOutline}
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </button>
                <button
                  style={styles.dialogButton}
                  onClick={() => {
                    setIsDialogOpen(false);
                    handleUpdateTeacher(selectedTeacher);
                  }}
                >
                  <Edit size={16} /> Update Teacher
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GetAllTeacher;
