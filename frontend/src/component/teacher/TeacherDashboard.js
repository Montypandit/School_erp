// //import AdminNavbar from './AdminNavbar';
// import { Link } from 'react-router-dom';
// import React, { useState } from 'react';

// // ✅ Define StatCard
// const StatCard = ({ title, value, percentage, icon, color }) => {
//   return (
//     <div style={{
//       backgroundColor: '#fff',
//       padding: '15px',
//       borderRadius: '10px',
//       boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//       flex: '1',
//       minWidth: '200px'
//     }}>
//       <div style={{ fontSize: '24px' }}>{icon}</div>
//       <h3 style={{ margin: '10px 0 5px' }}>{title}</h3>
//       <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{value}</p>
//       {percentage !== undefined && (
//         <p style={{ color: color }}>{Math.round(percentage)}%</p>
//       )}
//     </div>
//   );
// };

// // ✅ Action Button Component
// function ActionButton({ to, icon, label }) {
//   return (
//     <Link to={to} style={{
//       backgroundColor: '#ffffff',
//       padding: '15px',
//       borderRadius: '10px',
//       textAlign: 'center',
//       boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//       textDecoration: 'none',
//       color: '#333',
//       fontWeight: 'bold',
//       transition: '0.2s ease-in-out',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center'
//     }}>
//       <div style={{ fontSize: '24px' }}>{icon}</div>
//       <div style={{ marginTop: '8px' }}>{label}</div>
//     </Link>
//   );
// }

// const TeacherHome = () => {
//   // Placeholder data for stats. In a real app, you would fetch this from an API.
//   // const [stats, setStats] = useState({
//   //   totalStudents: 1250,
//   //   presentStudents: 1180,
//   //   absentStudents: 70,
//   //   totalTeachers: 75,
//   //   presentTeachers: 72,
//   // });

//   // // Calculate percentages, ensuring no division by zero
//   // const presentStudentPercentage = stats.totalStudents > 0 ? Math.round((stats.presentStudents / stats.totalStudents) * 100) : 0;
//   // const absentStudentPercentage = stats.totalStudents > 0 ? Math.round((stats.absentStudents / stats.totalStudents) * 100) : 0;
//   // const presentTeacherPercentage = stats.totalTeachers > 0 ? Math.round((stats.presentTeachers / stats.totalTeachers) * 100) : 0;

//   // // ✅ Dummy stats for testing
//   // const dummyStats = {
//   //   totalStudents: 10,
//   //   totalTeachers: 20,
//   //   presentStudents: 2,
//   //   absentStudents: 2,
//   //   presentTeachers: 4,
//   // };

//   return (
//     <div style={{
//       padding: '20px',
//       backgroundColor: '#f5f7fa',
//       minHeight: '100vh',
//     }}>
    

//       <h1 style={{ color: '#333', marginBottom: '25px' }}>Admin Dashboard</h1>

//       {/* Stats Overview */}
//       <div style={{
//         display: 'flex',
//         flexWrap: 'wrap',
//         gap: '20px',
//         marginBottom: '30px'
//       }}>
//         {/* <StatCard 
//           title="Total Students"
//           value={dummyStats.totalStudents} 
//           percentage={100}
//           icon="👥"
//           color="#4CAF50"
//         /> */}
//         {/* <StatCard 
//           title="Present Today"
//           value={`${dummyStats.presentStudents}/${dummyStats.totalStudents}`}
//           percentage={presentStudentPercentage}
//           icon="✅"
//           color="#2196F3"
//         /> */}
//         {/* <StatCard 
//           title="Absent Today"
//           value={`${dummyStats.absentStudents}/${dummyStats.totalStudents}`}
//           percentage={absentStudentPercentage}
//           icon="❌"
//           color="#F44336"
//         /> */}
//         {/* <StatCard 
//           title="Teachers Present"
//           value={`${dummyStats.presentTeachers}/${dummyStats.totalTeachers}`}
//           percentage={presentTeacherPercentage}
//           icon="👨‍🏫"
//           color="#9C27B0"
//         /> */}
//         {/* <StatCard 
//           title="Total Teachers" 
//           value={dummyStats.totalTeachers} 
//           percentage={100}
//           icon="👨‍🏫"
//           color="#4CAF50"
//         /> */}
//       </div>

//       {/* Quick Actions */}
//       <h2 style={{ color: '#444', margin: '30px 0 20px 0' }}>Quick Actions</h2>
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
//         gap: '20px',
//         marginBottom: '30px'
//       }}>
//         <ActionButton to="/teacher/attendence" icon="👩‍🏫" label="Attendence" />
//         <ActionButton to="/teacher/result" icon="👨" label="Result" />
//         <ActionButton to="/teacher/report" icon="👨" label="Report" />
        
//       </div>

//       {/* Recent Activity Section */}
//       <div style={{
//         backgroundColor: 'white',
//         borderRadius: '10px',
//         padding: '20px',
//         boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//       }}>
//         <h2 style={{ color: '#444', marginTop: 0 }}>Recent Activity</h2>
//         <p style={{ color: '#666', fontStyle: 'italic' }}>Recent system activities will appear here.</p>
//       </div>
//     </div>
//   );
// };

// export default TeacherHome;

"use client"

import React from "react"
import { Users, CheckCircle, XCircle, GraduationCap, Calendar, FileText, BarChart3 } from "lucide-react"

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-4 rounded shadow flex-1 min-w-[200px]">
    <div className="text-2xl mb-2">{icon}</div>
    <h3 className="text-gray-700 font-medium">{title}</h3>
    <p className="text-lg font-bold text-gray-900">{value}</p>
    {typeof value === "string" && value.includes("/") && (
      <p className={`text-sm font-medium ${color}`}>{Math.round((+value.split("/")[0] / +value.split("/")[1]) * 100)}%</p>
    )}
  </div>
)

const ActionButton = ({ href, icon, label }) => (
  <a
    href={href}
    className="bg-white p-4 rounded text-center shadow hover:shadow-md transition transform hover:scale-105 flex flex-col items-center min-h-[100px]"
  >
    <div className="text-2xl text-gray-600 mb-2">{icon}</div>
    <div className="text-gray-700 font-medium">{label}</div>
  </a>
)

// featch number of students and teachers from the database

const TeacherHome = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [lateCount, setLateCount] = useState(0);

  useEffect(() => {
  const fetchAttendanceStats = async () => {
    try {
      const token = sessionStorage.getItem("teacherToken");
      const today = new Date().toISOString().split("T")[0];

      const res = await fetch(`http://localhost:5000/api/final/admission/get/all-attendance?date=${today}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        let present = 0;
        let absent = 0;
        let late=0;

        data.data.forEach((record) => {
          record.students.forEach((s) => {
            if (s.status === "present") present++;
            else if (s.status === "absent") absent++;
            else if(s.status==="late")  late++;
          });
        });

        setPresentCount(present);
        setAbsentCount(absent);
        setLateCount(late);
      } else {
        console.error("Attendance fetch failed:", data.message);
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  fetchAttendanceStats();
}, []);



  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = sessionStorage.getItem("teacherToken");
        const response = await fetch(
          "http://localhost:5000/api/final/admission/get/all/admissions",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (response.ok) {
          setTotalStudents(result.data.length);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);



  const stats = {
    totalStudents, // Replace with actual student data
    totalTeachers: 20,
    presentStudents: presentCount, // Replace with actual present count
    absentStudents: absentCount, // Replace with actual absent count
    lateStudents: lateCount,
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <StatCard title="Total Students" value={stats.totalStudents} icon={<Users />} color="text-blue-600" />
        <StatCard title="Present" value={`${stats.presentStudents}/${stats.totalStudents}`} icon={<CheckCircle />} color="text-green-600" />
        <StatCard title="Absent" value={`${stats.absentStudents}/${stats.totalStudents}`} icon={<XCircle />} color="text-red-600" />
        <StatCard title="Late Students" value={`${stats.lateStudents}/${stats.totalStudents}`} icon={<GraduationCap />} color="text-purple-600" />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <ActionButton href="/teacher/attendence" icon={<Calendar />} label="Attendance" />
          <ActionButton href="/teacher/result" icon={<BarChart3 />} label="Results" />
          <ActionButton href="/teacher/report" icon={<FileText />} label="Reports" />
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Recent Activity</h2>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li>✔️ New student enrolled</li>
          <li>🕘 Attendance submitted</li>
          <li>📢 Assignment reminder sent</li>
        </ul>
      </div>
    </div>
    </div>
    </>
  )
}

export default TeacherHome;
