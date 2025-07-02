
import { Users, Calendar, Download, Search, Eye, BarChart3 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import TeacherNavbar from './TeacherNavbar'; // Ensure this path is correct
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from 'react-toastify';
const AttendanceReportPage = () => {
  const [selectedDate, setSelectedDate] = useState('2025-07-02');
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  //  attendance data come from backend

  
// Ensure this is imported
useEffect(() => {
  const fetchAttendanceData = async () => {
    setLoading(true);

    const token = sessionStorage.getItem("teacherToken");
    if (!token) {
      console.warn("No token found. Please log in again.");
      setLoading(false);
      setAttendanceData([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/final/admission/get/all-attendance/${selectedDate}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await response.json();
      console.log("📦 Response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      setAttendanceData(result.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error.message);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  fetchAttendanceData();
}, [selectedDate]);


  // Calculate totals
  const totalStudents = attendanceData.reduce((sum, classData) => sum + classData.totalStudents, 0);
  const totalPresent = attendanceData.reduce((sum, classData) => sum + classData.presentStudents, 0);
  const totalAbsent = attendanceData.reduce((sum, classData) => sum + classData.absentStudents, 0);
  const overallAttendancePercentage = ((totalPresent / totalStudents) * 100).toFixed(1);

  // Filter data based on search
  const filteredData = attendanceData.filter(classData => 
    classData.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
const handleDownloadReport = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Attendance Report", 14, 22);
   
  // Optional: Add Date
  doc.setFontSize(12);
  doc.text(`Date: ${selectedDate}`, 14, 30);

  const tableColumn = [
    "Class",
    "Total",
    "Present",
    "Absent",
    "Attendance %",
    "Absent List",
  ];

  const tableRows = attendanceData.map((item) => [
    item.class,
    item.totalStudents,
    item.presentStudents,
    item.absentStudents,
    item.attendancePercentage + "%",
    item.absentList.join(", "),
  ]);

  doc.autoTable({
    startY: 40,
    head: [tableColumn],
    body: tableRows,
  });

  doc.save(`Attendance_Report_${selectedDate}.pdf`);

    toast.success("Report downloaded successfully!");
};

  const handleViewDetails = (className) => {
    toast.success(`Opening detailed attendance view for ${className}`);
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 95) return 'text-green-600 bg-green-100';
    if (percentage >= 90) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 95) return 'bg-green-500';
    if (percentage >= 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <>
    <TeacherNavbar/>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Report</h1>
          <p className="text-gray-600">Class-wise attendance overview and student statistics</p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Class</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by class name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleDownloadReport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Report
            </button>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
              </div>
              <Users className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Present Today</p>
                <p className="text-3xl font-bold text-green-600">{totalPresent}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Absent Today</p>
                <p className="text-3xl font-bold text-red-600">{totalAbsent}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">✗</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Overall Attendance</p>
                <p className="text-3xl font-bold text-blue-600">{overallAttendancePercentage}%</p>
              </div>
              <BarChart3 className="w-10 h-10 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Class-wise Attendance Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Class-wise Attendance Details
            </h2>
            <p className="text-gray-600 mt-1">Date: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Class</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Total Students</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Present</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Absent</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Attendance %</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Progress</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Absent Students</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((classData, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{classData.class}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-semibold text-gray-900">{classData.totalStudents}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-semibold text-green-600">{classData.presentStudents}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-semibold text-red-600">{classData.absentStudents}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAttendanceColor(classData.attendancePercentage)}`}>
                        {classData.attendancePercentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${getProgressBarColor(classData.attendancePercentage)}`}
                            style={{width: `${classData.attendancePercentage}%`}}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{classData.attendancePercentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {classData.absentList.length > 0 ? (
                          <div>
                            {classData.absentList.map((student, idx) => (
                              <div key={idx} className="mb-1">{student}</div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-green-600 font-medium">All Present</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleViewDetails(classData.class)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Total Classes</p>
                <p className="text-xl font-bold text-gray-900">{filteredData.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-xl font-bold text-gray-900">{totalStudents}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Students Present</p>
                <p className="text-xl font-bold text-green-600">{totalPresent}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Overall Attendance</p>
                <p className="text-xl font-bold text-blue-600">{overallAttendancePercentage}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AttendanceReportPage;