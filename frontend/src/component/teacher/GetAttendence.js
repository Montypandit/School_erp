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

const AttendancePage = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch students from backend when class is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return;

      try {
        const token = sessionStorage.getItem("teacherToken");
        const res = await fetch(`http://localhost:5000/api/students/students/byClass/${selectedClass}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,

          },
        });

        const data = await res.json();
        if (res.ok) {
          setStudents(data);
          const initial = {};
          data.forEach((student) => {
            initial[student._id] = "present";
          });
          setAttendance(initial);
        } else {
          console.error("Error:", data.message);
        }
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    fetchStudents();
  }, [selectedClass]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);

    const token = sessionStorage.getItem("teacherToken");

    const attendanceRecords = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      status,
    }));

    try {
      const res = await fetch("http://localhost:5000/api/attendance/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          classId: selectedClass,
          date: selectedDate,
          attendanceRecords,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Attendance saved successfully!");
      } else {
        alert("❌ Failed to save: " + data.message);
      }
    } catch (err) {
      alert("❌ Error while saving attendance");
      console.error(err);
    }

    setIsSaving(false);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.includes(searchTerm)
  );

  const stats = {
    total: Object.keys(attendance).length,
    present: Object.values(attendance).filter((s) => s === "present").length,
    absent: Object.values(attendance).filter((s) => s === "absent").length,
    late: Object.values(attendance).filter((s) => s === "late").length,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <a href="/teacher/home" className="text-blue-600">
          <ArrowLeft />
        </a>
        <h1 className="text-2xl font-bold">Attendance Management</h1>
      </div>

      {/* Class and Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-1 font-medium">Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Choose a class...</option>
            {/* Replace with dynamic class data if needed */}
            <option value="1">Class 1</option>
            <option value="2">Class 2</option>
            <option value="3">Class 3</option>
            <option value="4">Class 4</option>
            <option value="5">Class 5</option>
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

      {selectedClass && (
        <>
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

          {/* Student List */}
          <div className="bg-white rounded shadow p-4 space-y-4">
            {filteredStudents.map((student) => (
              <div
                key={student._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100"
              >
                <div>
                  <h3 className="font-medium">{student.name}</h3>
                  <p className="text-sm text-gray-500">Roll No: {student.rollNumber}</p>
                </div>
                <div className="flex gap-2">
                  {["present", "late", "absent"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleAttendanceChange(student._id, status)}
                      className={`px-4 py-1 rounded text-sm font-medium transition ${
                        attendance[student._id] === status
                          ? status === "present"
                            ? "bg-green-500 text-white"
                            : status === "late"
                            ? "bg-yellow-500 text-white"
                            : "bg-red-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-opacity-75"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {filteredStudents.length === 0 && (
              <p className="text-center text-gray-500 py-8">No students found</p>
            )}
          </div>
        </>
      )}

      {!selectedClass && (
        <div className="bg-white p-10 text-center rounded shadow">
          <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Please select a class to begin attendance</p>
        </div>
      )}
    </div>
  );
};

// Simple stat card component
const StatCard = ({ icon, label, count, color }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <div className={`mx-auto mb-2 ${color}`}>{icon}</div>
    <p className="text-xl font-bold">{count}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

export default AttendancePage;
