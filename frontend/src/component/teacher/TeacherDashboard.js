import React, { useEffect, useState } from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  GraduationCap,
  Calendar,
  FileText,
  BarChart3,
  BookOpen,
} from "lucide-react";
import TeacherNavbar from "./TeacherNavbar"; // ✅ Make sure path is correct
import { toast } from "react-toastify";

// ✅ Stat card component
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-4 rounded shadow flex-1 min-w-[200px]">
    <div className="text-2xl mb-2">{icon}</div>
    <h3 className="text-gray-700 font-medium">{title}</h3>
    <p className="text-lg font-bold text-gray-900">{value}</p>
    {typeof value === "string" && value.includes("/") && (
      <p className={`text-sm font-medium ${color}`}>
        {Math.round((+value.split("/")[0] / +value.split("/")[1]) * 100)}%
      </p>
    )}
  </div>
);

// ✅ Action button
const ActionButton = ({ href, icon, label }) => (
  <a
    href={href}
    className="bg-white p-4 rounded text-center shadow hover:shadow-md transition transform hover:scale-105 flex flex-col items-center min-h-[100px]"
  >
    <div className="text-2xl text-gray-600 mb-2">{icon}</div>
    <div className="text-gray-700 font-medium">{label}</div>
  </a>
);

const TeacherHome = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [lateCount, setLateCount] = useState(0);

  // ✅ Fetch attendance stats
  useEffect(() => {
    const fetchAttendanceStats = async () => {
      try {
        const token = sessionStorage.getItem("teacherToken");
        const today = new Date().toISOString().split("T")[0];

        const res = await fetch(
          `http://localhost:5000/api/final/admission/get/all-attendance?date=${today}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          let present = 0;
          let absent = 0;
          let late = 0;

          data.data.forEach((record) => {
            record.students.forEach((s) => {
              if (s.status === "present") present++;
              else if (s.status === "absent") absent++;
              else if (s.status === "late") late++;
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

  // ✅ Fetch total students
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = sessionStorage.getItem("teacherToken");
        if(!token){
          toast.info('Please login to continue');
          window.location.href = '/'
          return;
        }
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
    totalStudents,
    totalTeachers: 20,
    presentStudents: presentCount,
    absentStudents: absentCount,
    lateStudents: lateCount,
    presentTeachers: 18, // Optional
  };

  return (
    <>
      <TeacherNavbar /> {/* ✅ Navbar at top */}

      <div className="min-h-screen bg-gray-50 p-4 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Section */}
        <div className="flex flex-wrap gap-4">
          <StatCard title="Total Students" value={stats.totalStudents} icon={<Users />} color="text-blue-600" />
          <StatCard title="Present" value={`${stats.presentStudents}/${stats.totalStudents}`} icon={<CheckCircle />} color="text-green-600" />
          <StatCard title="Absent" value={`${stats.absentStudents}/${stats.totalStudents}`} icon={<XCircle />} color="text-red-600" />
          <StatCard title="Late Students" value={`${stats.lateStudents}/${stats.totalStudents}`} icon={<GraduationCap />} color="text-yellow-600" />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <ActionButton href="/teacher/attendence" icon={<Calendar />} label="Attendance" />
            <ActionButton href="/teacher/results" icon={<BarChart3 />} label="Results" />
            <ActionButton href="/teacher/report" icon={<FileText />} label="Reports" />
            <ActionButton href="/teacher/homework" icon={<BookOpen />} label="Homework" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Recent Activity</h2>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>✔️ New student enrolled</li>
            <li>🕘 Attendance submitted</li>
            <li>📢 Assignment reminder sent</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default TeacherHome;
