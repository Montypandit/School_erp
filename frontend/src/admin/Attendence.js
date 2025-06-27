import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  GraduationCap,
  Filter,
  Download,
  Search,
  Users,
  BookOpen,
  TrendingUp,
} from "lucide-react";

export default function AttendanceDashboard() {
  const [selectedClass, setSelectedClass] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("2024-01-15");
  const [classes, setClasses] = useState([]);
  const [teacherAttendance, setTeacherAttendance] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");

    const fetchData = async () => {
      try {
        const teacherRes = await fetch("http://localhost:5000/api/attendance/teachers", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const studentRes = await fetch("http://localhost:5000/api/attendance/students", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const classRes = await fetch("http://localhost:5000/api/classes", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const teacherData = await teacherRes.json();
        const studentData = await studentRes.json();
        const classData = await classRes.json();

        setTeacherAttendance(teacherData);
        setStudentAttendance(studentData);
        setClasses(classData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [selectedDate]);

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded text-sm font-medium";
    switch (status) {
      case "Present":
        return <span className={`${base} bg-green-100 text-green-800`}>Present</span>;
      case "Absent":
        return <span className={`${base} bg-red-100 text-red-800`}>Absent</span>;
      case "Late":
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>Late</span>;
      default:
        return <span className={`${base} bg-gray-200 text-gray-800`}>{status}</span>;
    }
  };

  const filteredTeachers = teacherAttendance.filter((teacher) => {
    const matchesDate = teacher.date === selectedDate;
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDate && matchesSearch;
  });

  const filteredStudents = studentAttendance.filter((student) => {
    const matchesClass = selectedClass === "all" || student.classId === selectedClass;
    const matchesDate = student.date === selectedDate;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.rollNo.includes(searchTerm);
    return matchesClass && matchesDate && matchesSearch;
  });

  const totalTeachers = filteredTeachers.length;
  const presentTeachers = filteredTeachers.filter((t) => t.status === "Present").length;
  const totalStudents = filteredStudents.length;
  const presentStudents = filteredStudents.filter((s) => s.status === "Present").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
            <p className="text-gray-600">Track and manage attendance</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                className="w-full border px-3 py-2 rounded"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="all">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or roll..."
                  className="pl-10 w-full border px-3 py-2 rounded"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedClass("all");
                }}
                className="w-full border px-3 py-2 rounded hover:bg-gray-100"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Classes</p>
            <h3 className="text-xl font-semibold">{classes.length}</h3>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Teacher Attendance</p>
            <h3 className="text-xl font-semibold">{presentTeachers}/{totalTeachers}</h3>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Student Attendance</p>
            <h3 className="text-xl font-semibold">{presentStudents}/{totalStudents}</h3>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Overall Rate</p>
            <h3 className="text-xl font-semibold">
              {totalTeachers + totalStudents > 0
                ? Math.round(((presentTeachers + presentStudents) / (totalTeachers + totalStudents)) * 100)
                : 0}%
            </h3>
          </div>
        </div>

        {/* Attendance Tables */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Teacher Attendance</h2>
            <table className="w-full text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Check-in Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="border-t">
                    <td className="p-2 border font-medium">{teacher.name}</td>
                    <td className="p-2 border">{getStatusBadge(teacher.status)}</td>
                    <td className="p-2 border">{teacher.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTeachers.length === 0 && (
              <p className="text-center text-gray-500 py-4">No teachers found</p>
            )}
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Student Attendance</h2>
            <table className="w-full text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Roll No.</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Class</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Check-in Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-t">
                    <td className="p-2 border font-medium">{student.rollNo}</td>
                    <td className="p-2 border">{student.name}</td>
                    <td className="p-2 border">{classes.find((c) => c.id === student.classId)?.name || ""}</td>
                    <td className="p-2 border">{getStatusBadge(student.status)}</td>
                    <td className="p-2 border">{student.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <p className="text-center text-gray-500 py-4">No students found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
