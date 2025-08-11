
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Save,
  Search,
} from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TeacherNavBar from "./TeacherNavbar"; // Ensure this path is correct
// import  teacherNavBar from "./TeacherNavbar";


const AttendancePage = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all students initially
  useEffect(() => {
    const fetchAllStudentsAndAttendance = async () => {
      try {
        const token = sessionStorage.getItem("teacherToken");

        // Fetch all students
        const res = await fetch("https://school-erp-11-mr7k.onrender.com/api/final/admission/get/all/admissions", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (res.ok) {
          setStudents(data.data);

          // Fetch saved attendance for selected class and date
          if (selectedClass && selectedDate) {
            const res2 = await fetch(
              `https://school-erp-11-mr7k.onrender.com/api/final/attendance/get/attendance?class=${selectedClass}&date=${selectedDate}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const saved = await res2.json();

            if (res2.ok && saved.students.length > 0) {
              // Set attendance from DB
              const newAttendance = {};
              saved.students.forEach((s) => {
                newAttendance[s.studentId] = s.status;
              });
              setAttendance(newAttendance);
            } else {
              // No saved attendance, set default to "present"
              const defaultAttendance = {};
              data.data.forEach((student) => {
                if (
                  student.class === selectedClass &&
                  (selectedSection ? student.section === selectedSection : true)
                ) {
                  defaultAttendance[student._id] = "present";
                }

              });
              setAttendance(defaultAttendance);
            }
          }
        }
      } catch (err) {
        console.error("Error loading students or attendance", err);
      }
    };

    fetchAllStudentsAndAttendance();
  }, [selectedClass, selectedDate]);


  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };
  const handleSaveAttendance = async () => {
    setIsSaving(true);
    const token = sessionStorage.getItem("teacherToken");

    // validate selectedClass
    if (!selectedClass) {
      toast.error("❌ Please select a class before saving attendance.");
      setIsSaving(false);
      return;
    }

    const selectedStudents = filteredStudents.map((student) => ({
      studentId: student._id,
      name: student.name,
      fatherName: student.fatherName || "",
      admissionId: student.admissionId,
      status: attendance[student._id] || "absent", // fallback default
    }));

    if (selectedStudents.length === 0) {
      toast.error(" No students found for the selected class.");
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch("https://school-erp-11-mr7k.onrender.com/api/final/attendance/save/attendence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          class: selectedClass,
          date: selectedDate,
          students: selectedStudents,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(" Attendance saved successfully!");
      } else {
        toast.error(" Failed to save: " + data.message);
      }
    } catch (err) {
      toast.error(" Error while saving attendance");
      console.error(err);
    }

    setIsSaving(false);
  };



  const filteredStudents = students
    .filter((student) =>
      (selectedClass ? student.class === selectedClass : true) &&
      (selectedSection ? student.section === selectedSection : true)
    )
    .filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionId.includes(searchTerm)
    );



  const stats = {
    total: Object.keys(students).length,
    present: Object.values(attendance).filter((s) => s === "present").length,
    absent: Object.values(attendance).filter((s) => s === "absent").length,
    late: Object.values(attendance).filter((s) => s === "late").length,
  };

  return (
    // add teachernavbar
    <>
      <TeacherNavBar />
      <div className="min-h-screen bg-gray-100 p-6">

        <div className="flex items-center gap-3 mb-6">
          <a href="/teacher/home" className="text-blue-600">
            <ArrowLeft />
          </a>
          <h1 className="text-2xl font-bold">Attendance Management</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-1 font-medium">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Classes</option>
              <option value="nursery">Class Nursery</option>
              <option value="LKG">Class LKG</option>
              <option value="ukg">Class UKG</option>
              <option value="1">Class 1</option>
              <option value="2">Class 2</option>
              <option value="3">Class 3</option>
              <option value="4">Class 4</option>
              <option value="5">Class 5</option>
            </select>
          </div>

          <div>

            <label className="block mb-1 font-medium">Select Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Sections</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>

            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={<Users />} label="Total" count={stats.total} color="text-blue-500" />
          <StatCard icon={<CheckCircle />} label="Present" count={stats.present} color="text-green-500" />
          <StatCard icon={<XCircle />} label="Absent" count={stats.absent} color="text-red-500" />
          <StatCard icon={<Calendar />} label="Late" count={stats.late} color="text-yellow-500" />
        </div>

        {/* Search & Save */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute top-2.5 left-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded"
            />
          </div>
          <button
            onClick={handleSaveAttendance}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            <Save className="inline w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Attendance"}
          </button>
        </div>

        {/* Student Table */}
        <div className="overflow-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Admission ID</th>
                <th className="text-left p-3">Father's Name</th>
                <th className="text-left p-3">Class</th>
                <th className="text-left p-3">Section</th>
                <th className="text-left p-3">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{student.name}</td>
                  <td className="p-3">{student.admissionId}</td>
                  <td className="p-3">{student.fatherName}</td>
                  <td className="p-3">{student.class}</td>
                  <td className="p-3">{student.section}</td>
                  <td className="p-3 space-x-2">
                    {["present", "late", "absent"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleAttendanceChange(student._id, status)}
                        className={`px-3 py-1 rounded text-sm font-medium transition ${attendance[student._id] === status
                            ? status === "present"
                              ? "bg-green-500 text-white"
                              : status === "late"
                                ? "bg-yellow-500 text-white"
                                : "bg-red-500 text-white"
                            : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const StatCard = ({ icon, label, count, color }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <div className={`mx-auto mb-2 ${color}`}>{icon}</div>
    <p className="text-xl font-bold">{count}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

export default AttendancePage;


// import React, { useState, useEffect } from "react";
// import {
//   ArrowLeft,
//   Calendar,
//   Users,
//   CheckCircle,
//   XCircle,
//   Save,
//   Search,
// } from "lucide-react";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import TeacherNavBar from "./TeacherNavbar";

// const AttendancePage = () => {
//   const assignedClass = sessionStorage.getItem('assignedClass');
//   const assignedSection = sessionStorage.getItem('assignedSection');

//   const [selectedDate, setSelectedDate] = useState(() => {
//     const today = new Date();
//     return today.toISOString().split("T")[0];
//   });

//   const [students, setStudents] = useState([]);
//   const [attendance, setAttendance] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     const fetchAllStudentsAndAttendance = async () => {
//       try {
//         const token = sessionStorage.getItem("teacherToken");

//         const res = await fetch("https://school-erp-11-mr7k.onrender.com/api/final/admission/get/all/admissions", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await res.json();

//         if (res.ok) {
//           setStudents(data.data);

//           if (assignedClass && assignedSection && selectedDate) {
//             const res2 = await fetch(
//               `https://school-erp-11-mr7k.onrender.com/api/final/admission/get/attendance?class=${assignedClass}&section=${assignedSection}&date=${selectedDate}`,
//               {
//                 headers: {
//                   "Content-Type": "application/json",
//                   Authorization: `Bearer ${token}`,
//                 },
//               }
//             );

//             const saved = await res2.json();

//             if (res2.ok && saved.students.length > 0) {
//               const newAttendance = {};
//               saved.students.forEach((s) => {
//                 newAttendance[s.studentId] = s.status;
//               });
//               setAttendance(newAttendance);
//             } else {
//               const defaultAttendance = {};
//               data.data.forEach((student) => {
//                 if (
//                   String(student.class).toLowerCase().trim() === String(assignedClass).toLowerCase().trim() &&
//                   String(student.section).toLowerCase().trim() === String(assignedSection).toLowerCase().trim()
//                 ) {
//                   defaultAttendance[student._id] = "present";
//                 }
//               });
//               setAttendance(defaultAttendance);
//             }
//           }
//         }
//       } catch (err) {
//         console.error("Error loading students or attendance", err);
//       }
//     };

//     fetchAllStudentsAndAttendance();
//   }, [assignedClass, assignedSection, selectedDate]);

//   const handleAttendanceChange = (studentId, status) => {
//     setAttendance((prev) => ({
//       ...prev,
//       [studentId]: status,
//     }));
//   };

//   const filteredStudents = students
//     .filter(student =>
//       String(student.class).toLowerCase().trim() === String(assignedClass).toLowerCase().trim() &&
//       String(student.section).toLowerCase().trim() === String(assignedSection).toLowerCase().trim()
//     )
//     .filter(student =>
//       student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.admissionId.includes(searchTerm)
//     );

//   const handleSaveAttendance = async () => {
//     setIsSaving(true);
//     const token = sessionStorage.getItem("teacherToken");

//     if (!assignedClass || !assignedSection) {
//       toast.error("Assigned class and section not found.");
//       setIsSaving(false);
//       return;
//     }

//     const selectedStudents = filteredStudents.map((student) => ({
//       studentId: student._id,
//       name: student.name,
//       fatherName: student.fatherName || "",
//       admissionId: student.admissionId,
//       status: attendance[student._id] || "absent",
//     }));

//     if (selectedStudents.length === 0) {
//       toast.error("No students found for the assigned class and section.");
//       setIsSaving(false);
//       return;
//     }

//     try {
//       const res = await fetch("https://school-erp-11-mr7k.onrender.com/api/final/admission/save/attendence", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           class: assignedClass,
//           section: assignedSection,
//           date: selectedDate,
//           students: selectedStudents,
//         }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         toast.success("✅ Attendance saved successfully!");
//       } else {
//         toast.error("❌ Failed to save: " + data.message);
//       }
//     } catch (err) {
//       toast.error("❌ Error while saving attendance");
//       console.error(err);
//     }

//     setIsSaving(false);
//   };

//   const stats = {
//     total: filteredStudents.length,
//     present: Object.values(attendance).filter((s) => s === "present").length,
//     absent: Object.values(attendance).filter((s) => s === "absent").length,
//     late: Object.values(attendance).filter((s) => s === "late").length,
//   };

//   // Fallback if no assigned class/section
  
//   if (!assignedClass || !assignedSection) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">
//         No class or section assigned. Please contact admin or relogin.
//       </div>
//     );
//   }

//   return (
//     <>
//       <TeacherNavBar />
//       <div className="min-h-screen bg-gray-100 p-6">
//         <div className="flex items-center gap-3 mb-6">
//           <a href="/teacher/home" className="text-blue-600">
//             <ArrowLeft />
//           </a>
//           <h1 className="text-2xl font-bold">Attendance Management</h1>
//         </div>

//         <div className="mb-4 space-y-1">
//           <p><strong>Class:</strong> {assignedClass}</p>
//           <p><strong>Section:</strong> {assignedSection}</p>
//         </div>

//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Select Date</label>
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//           <StatCard icon={<Users />} label="Total" count={stats.total} color="text-blue-500" />
//           <StatCard icon={<CheckCircle />} label="Present" count={stats.present} color="text-green-500" />
//           <StatCard icon={<XCircle />} label="Absent" count={stats.absent} color="text-red-500" />
//           <StatCard icon={<Calendar />} label="Late" count={stats.late} color="text-yellow-500" />
//         </div>

//         <div className="flex flex-col md:flex-row gap-4 mb-4">
//           <div className="relative flex-1">
//             <Search className="absolute top-2.5 left-3 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search students..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border rounded"
//             />
//           </div>
//           <button
//             onClick={handleSaveAttendance}
//             disabled={isSaving}
//             className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//           >
//             <Save className="inline w-4 h-4 mr-2" />
//             {isSaving ? "Saving..." : "Save Attendance"}
//           </button>
//         </div>

//         <div className="overflow-auto">
//           <table className="min-w-full bg-white rounded shadow">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="text-left p-3">Name</th>
//                 <th className="text-left p-3">Admission ID</th>
//                 <th className="text-left p-3">Father's Name</th>
//                 <th className="text-left p-3">Attendance</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredStudents.map((student) => (
//                 <tr key={student._id} className="border-t hover:bg-gray-50">
//                   <td className="p-3">{student.name}</td>
//                   <td className="p-3">{student.admissionId}</td>
//                   <td className="p-3">{student.fatherName}</td>
//                   <td className="p-3 space-x-2">
//                     {["present", "late", "absent"].map((status) => (
//                       <button
//                         key={status}
//                         onClick={() => handleAttendanceChange(student._id, status)}
//                         className={`px-3 py-1 rounded text-sm font-medium transition ${attendance[student._id] === status
//                           ? status === "present"
//                             ? "bg-green-500 text-white"
//                             : status === "late"
//                               ? "bg-yellow-500 text-white"
//                               : "bg-red-500 text-white"
//                           : "bg-gray-200 text-gray-700"
//                           }`}
//                       >
//                         {status.charAt(0).toUpperCase() + status.slice(1)}
//                       </button>
//                     ))}
//                   </td>
//                 </tr>
//               ))}
//               {filteredStudents.length === 0 && (
//                 <tr>
//                   <td colSpan="4" className="text-center py-6 text-gray-500">
//                     No students found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//         <ToastContainer position="top-right" autoClose={3000} />
//       </div>
//     </>
//   );
// };

// const StatCard = ({ icon, label, count, color }) => (
//   <div className="bg-white p-4 rounded shadow text-center">
//     <div className={`mx-auto mb-2 ${color}`}>{icon}</div>
//     <p className="text-xl font-bold">{count}</p>
//     <p className="text-sm text-gray-500">{label}</p>
//   </div>
// );

// export default AttendancePage;
