


import { Users, Calendar, Download, Search, Eye, BarChart3, X, UserCheck, UserX } from 'lucide-react';

import React, { useState, useEffect } from 'react';
import TeacherNavbar from './AdminNavbar'; // Ensure this path is correct
import * as XLSX from "xlsx";

import { toast } from 'react-toastify';
const AttendanceReportPage = () => {
  const [selectedDate, setSelectedDate] = useState('2025-07-02');
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedClassDetails, setSelectedClassDetails] = useState(null);


  // Ensure this is imported
  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);

      const storedData = sessionStorage.getItem("adminToken");
      const token = storedData ? JSON.parse(storedData).token : null;
      if (!token) {
        console.warn("No token found. Please log in again.");
        setLoading(false);
        setAttendanceData([]);
        return;
      }

      try {
        const response = await fetch(`https://school-erp-1-exji.onrender.com/api/final/attendance/get/all-attendance/${selectedDate}`, {
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
        //console.error("Error fetching attendance data:", error.message);
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
    || classData.section.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleDownloadReport = () => {
    const tableRows = attendanceData.map((item) => ({
      Class: `${item.class}-${item.section}`,
      Total_Students: item.totalStudents,
      Present: item.presentStudents,
      Absent: item.absentStudents,
      Attendance_Percentage: `${item.attendancePercentage}%`,
      Absent_Students: item.absentList.join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(tableRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");

    XLSX.writeFile(workbook, `Attendance_Report_${selectedDate}.xlsx`);

    toast.success("Excel report downloaded successfully!");
  };

  const handleViewDetails = (className,sectionName) => {
    const selectedClassData = attendanceData.find( item => item.class === className && item.section === sectionName );

    if (!selectedClassData) {
      toast.error("Class data not found!");
      return;
    }

    setSelectedClassDetails(selectedClassData);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClassDetails(null);
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 95) return 'bg-green-500';
    if (percentage >= 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  const getAttendanceColor = (percentage) => {
    if (percentage >= 95) return 'text-green-600 bg-green-100';
    if (percentage >= 90) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const ViewDetailsModal = () => {
    if (!showModal || !selectedClassDetails) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedClassDetails.class} - Attendance Details
              </h2>
              <p className="text-gray-600 mt-1">
                Date: {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Students</p>
                    <p className="text-2xl font-bold text-blue-800">{selectedClassDetails.totalStudents}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Present</p>
                    <p className="text-2xl font-bold text-green-800">{selectedClassDetails.presentStudents}</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-medium">Absent</p>
                    <p className="text-2xl font-bold text-red-800">{selectedClassDetails.absentStudents}</p>
                  </div>
                  <UserX className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Attendance Percentage */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Attendance Percentage</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAttendanceColor(selectedClassDetails.attendancePercentage)}`}>
                  {selectedClassDetails.attendancePercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${getProgressBarColor(selectedClassDetails.attendancePercentage)} transition-all duration-300`}
                  style={{ width: `${selectedClassDetails.attendancePercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Absent Students List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UserX className="w-5 h-5" />
                Absent Students
              </h3>

              {selectedClassDetails.absentList.length > 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedClassDetails.absentList.map((student, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white p-3 rounded-lg border border-red-100">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <UserX className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="text-gray-800 font-medium">{student}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <UserCheck className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-green-800 mb-2">Perfect Attendance!</h4>
                  <p className="text-green-600">All students are present in this class today.</p>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Attendance Rate:</span>
                  <span className="ml-2 font-medium">{selectedClassDetails.attendancePercentage}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Students Present:</span>
                  <span className="ml-2 font-medium">{selectedClassDetails.presentStudents}/{selectedClassDetails.totalStudents}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Download individual class report
                const row = {
                  Class: selectedClassDetails.class,
                  Section: selectedClassDetails.section,
                  Date: selectedDate,
                  Total_Students: selectedClassDetails.totalStudents,
                  Present: selectedClassDetails.presentStudents,
                  Absent: selectedClassDetails.absentStudents,
                  Attendance_Percentage: `${selectedClassDetails.attendancePercentage}%`,
                  Absent_Students: selectedClassDetails.absentList.join(", "),
                };

                const worksheet = XLSX.utils.json_to_sheet([row]);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Class Attendance");

                const filename = `${selectedClassDetails.class}_${selectedClassDetails.section}_Attendance_${selectedDate}.xlsx`;

                XLSX.writeFile(workbook, filename);

                toast.success("Class Excel report downloaded successfully!");
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Class Report
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <TeacherNavbar />
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
                Class & Section-wise Attendance Details
              </h2>
              <p className="text-gray-600 mt-1">Date: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Class</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Section</th>
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
                        <div className="font-medium text-gray-900">{classData.section}</div>
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
                              style={{ width: `${classData.attendancePercentage}%` }}
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
                          onClick={() => handleViewDetails(classData.class,classData.section)}
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
      <ViewDetailsModal />
    </>
  );
};

export default AttendanceReportPage;



// import React, { useState, useEffect } from 'react';
// import { Users, Calendar, Download, Search, Eye, BarChart3, X, UserCheck, UserX } from 'lucide-react';
// import TeacherNavbar from './AdminNavbar'; // Adjust path if needed
// import * as XLSX from 'xlsx';
// import { toast } from 'react-toastify';

// const AttendanceReportPage = () => {
//   // State variables
//   const [selectedDate, setSelectedDate] = useState('2025-07-02');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedClassDetails, setSelectedClassDetails] = useState(null);

//   // Fetch attendance data when selectedDate changes
//   useEffect(() => {
//     const fetchAttendanceData = async () => {
//       setLoading(true);

//       // Extract token properly (if stored as JSON, adjust accordingly)
//       let token = sessionStorage.getItem('adminToken');
//       if (!token) {
//         toast.warn('Please log in to continue.');
//         setLoading(false);
//         setAttendanceData([]);
//         return;
//       }
//       // If token is stored as JSON string, parse and get the token string
//       try {
//         const parsedToken = JSON.parse(token);
//         token = parsedToken.token || token;
//       } catch {
//         // token is probably a plain string already
//       }

//       try {
//         const response = await fetch(`https://school-erp-1-exji.onrender.com/api/final/attendance/get/all-attendance/${selectedDate}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.status === 401) {
//           toast.error('Unauthorized. Please login again.');
//           setAttendanceData([]);
//           setLoading(false);
//           return;
//         }

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || 'Failed to fetch attendance data');
//         }

//         const result = await response.json();
//         setAttendanceData(result.data || []);
//       } catch (error) {
//         toast.error(error.message || 'Error fetching attendance data');
//         setAttendanceData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAttendanceData();
//   }, [selectedDate]);

//   // Calculate totals and overall attendance
//   const totalStudents = attendanceData.reduce((sum, cls) => sum + cls.totalStudents, 0);
//   const totalPresent = attendanceData.reduce((sum, cls) => sum + cls.presentStudents, 0);
//   const totalAbsent = attendanceData.reduce((sum, cls) => sum + cls.absentStudents, 0);
//   const overallAttendancePercentage = totalStudents > 0 ? ((totalPresent / totalStudents) * 100).toFixed(1) : '0.0';

//   // Filter data by class or section based on searchTerm
//   const filteredData = attendanceData.filter(
//     (cls) =>
//       cls.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       cls.section.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Download full attendance report as Excel
//   const handleDownloadReport = () => {
//     if (!attendanceData.length) {
//       toast.info('No data available to download');
//       return;
//     }
//     const tableRows = attendanceData.map((item) => ({
//       Class: `${item.class}-${item.section}`,
//       Total_Students: item.totalStudents,
//       Present: item.presentStudents,
//       Absent: item.absentStudents,
//       Attendance_Percentage: `${item.attendancePercentage}%`,
//       Absent_Students: item.absentList.join(', '),
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(tableRows);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');
//     XLSX.writeFile(workbook, `Attendance_Report_${selectedDate}.xlsx`);
//     toast.success('Excel report downloaded successfully!');
//   };

//   // Show modal with detailed class attendance
//   const handleViewDetails = (className, sectionName) => {
//     const selectedClassData = attendanceData.find(
//       (item) => item.class === className && item.section === sectionName
//     );
//     if (!selectedClassData) {
//       toast.error('Class data not found!');
//       return;
//     }
//     setSelectedClassDetails(selectedClassData);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedClassDetails(null);
//   };

//   // Helper functions for coloring attendance indicators
//   const getProgressBarColor = (percentage) => {
//     if (percentage >= 95) return 'bg-green-500';
//     if (percentage >= 90) return 'bg-yellow-500';
//     return 'bg-red-500';
//   };
//   const getAttendanceColor = (percentage) => {
//     if (percentage >= 95) return 'text-green-600 bg-green-100';
//     if (percentage >= 90) return 'text-yellow-600 bg-yellow-100';
//     return 'text-red-600 bg-red-100';
//   };

//   // Modal component
//   const ViewDetailsModal = () => {
//     if (!showModal || !selectedClassDetails) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//           {/* Modal Header */}
//           <div className="flex items-center justify-between p-6 border-b border-gray-200">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900">
//                 {selectedClassDetails.class} - Attendance Details
//               </h2>
//               <p className="text-gray-600 mt-1">
//                 Date:{' '}
//                 {new Date(selectedDate).toLocaleDateString('en-US', {
//                   weekday: 'long',
//                   year: 'numeric',
//                   month: 'long',
//                   day: 'numeric',
//                 })}
//               </p>
//             </div>
//             <button
//               onClick={closeModal}
//               className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           {/* Modal Content */}
//           <div className="p-6">
//             {/* Statistics Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-blue-600 text-sm font-medium">Total Students</p>
//                     <p className="text-2xl font-bold text-blue-800">{selectedClassDetails.totalStudents}</p>
//                   </div>
//                   <Users className="w-8 h-8 text-blue-600" />
//                 </div>
//               </div>

//               <div className="bg-green-50 p-4 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-green-600 text-sm font-medium">Present</p>
//                     <p className="text-2xl font-bold text-green-800">{selectedClassDetails.presentStudents}</p>
//                   </div>
//                   <UserCheck className="w-8 h-8 text-green-600" />
//                 </div>
//               </div>

//               <div className="bg-red-50 p-4 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-red-600 text-sm font-medium">Absent</p>
//                     <p className="text-2xl font-bold text-red-800">{selectedClassDetails.absentStudents}</p>
//                   </div>
//                   <UserX className="w-8 h-8 text-red-600" />
//                 </div>
//               </div>
//             </div>

//             {/* Attendance Percentage */}
//             <div className="bg-gray-50 p-4 rounded-lg mb-6">
//               <div className="flex items-center justify-between mb-2">
//                 <h3 className="text-lg font-semibold text-gray-900">Attendance Percentage</h3>
//                 <span
//                   className={`px-3 py-1 rounded-full text-sm font-medium ${getAttendanceColor(
//                     selectedClassDetails.attendancePercentage
//                   )}`}
//                 >
//                   {selectedClassDetails.attendancePercentage}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-4">
//                 <div
//                   className={`h-4 rounded-full ${getProgressBarColor(selectedClassDetails.attendancePercentage)} transition-all duration-300`}
//                   style={{ width: `${selectedClassDetails.attendancePercentage}%` }}
//                 />
//               </div>
//             </div>

//             {/* Absent Students List */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                 <UserX className="w-5 h-5" />
//                 Absent Students
//               </h3>

//               {selectedClassDetails.absentList.length > 0 ? (
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//                     {selectedClassDetails.absentList.map((student, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center gap-2 bg-white p-3 rounded-lg border border-red-100"
//                       >
//                         <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
//                           <UserX className="w-4 h-4 text-red-600" />
//                         </div>
//                         <span className="text-gray-800 font-medium">{student}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
//                   <UserCheck className="w-12 h-12 text-green-600 mx-auto mb-3" />
//                   <h4 className="text-lg font-semibold text-green-800 mb-2">Perfect Attendance!</h4>
//                   <p className="text-green-600">All students are present in this class today.</p>
//                 </div>
//               )}
//             </div>

//             {/* Additional Summary */}
//             <div className="mt-6 bg-gray-50 p-4 rounded-lg">
//               <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <span className="text-gray-600">Attendance Rate:</span>
//                   <span className="ml-2 font-medium">{selectedClassDetails.attendancePercentage}%</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Students Present:</span>
//                   <span className="ml-2 font-medium">
//                     {selectedClassDetails.presentStudents}/{selectedClassDetails.totalStudents}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Modal Footer */}
//           <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
//             <button
//               onClick={closeModal}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               Close
//             </button>
//             <button
//               onClick={() => {
//                 // Download individual class attendance as Excel
//                 const row = {
//                   Class: selectedClassDetails.class,
//                   Section: selectedClassDetails.section,
//                   Date: selectedDate,
//                   Total_Students: selectedClassDetails.totalStudents,
//                   Present: selectedClassDetails.presentStudents,
//                   Absent: selectedClassDetails.absentStudents,
//                   Attendance_Percentage: `${selectedClassDetails.attendancePercentage}%`,
//                   Absent_Students: selectedClassDetails.absentList.join(', '),
//                 };

//                 const worksheet = XLSX.utils.json_to_sheet([row]);
//                 const workbook = XLSX.utils.book_new();
//                 XLSX.utils.book_append_sheet(workbook, worksheet, 'Class Attendance');

//                 const filename = `${selectedClassDetails.class}_${selectedClassDetails.section}_Attendance_${selectedDate}.xlsx`;

//                 XLSX.writeFile(workbook, filename);

//                 toast.success('Class Excel report downloaded successfully!');
//               }}
//               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
//             >
//               <Download className="w-4 h-4" />
//               Download Class Report
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <TeacherNavbar />
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Report</h1>
//             <p className="text-gray-600">Class-wise attendance overview and student statistics</p>
//           </div>

//           {/* Filters */}
//           <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <div className="flex flex-col md:flex-row gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
//                   <input
//                     type="date"
//                     value={selectedDate}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                     className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Search Class</label>
//                   <div className="relative">
//                     <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//                     <input
//                       type="text"
//                       placeholder="Search by class or section..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={handleDownloadReport}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
//               >
//                 <Download className="w-4 h-4" />
//                 Download Report
//               </button>
//             </div>
//           </div>

//           {/* Overall Statistics */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-600 text-sm">Total Students</p>
//                   <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
//                 </div>
//                 <Users className="w-10 h-10 text-blue-500" />
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-600 text-sm">Present Today</p>
//                   <p className="text-3xl font-bold text-green-600">{totalPresent}</p>
//                 </div>
//                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                   <span className="text-green-600 font-bold">✓</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-600 text-sm">Absent Today</p>
//                   <p className="text-3xl font-bold text-red-600">{totalAbsent}</p>
//                 </div>
//                 <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//                   <span className="text-red-600 font-bold">✗</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-600 text-sm">Overall Attendance</p>
//                   <p className="text-3xl font-bold text-blue-600">{overallAttendancePercentage}%</p>
//                 </div>
//                 <BarChart3 className="w-10 h-10 text-blue-500" />
//               </div>
//             </div>
//           </div>

//           {/* Class-wise Attendance Table */}
//           <div className="bg-white rounded-lg shadow-md">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
//                 <Calendar className="w-5 h-5" />
//                 Class & Section-wise Attendance Details
//               </h2>
//               <p className="text-gray-600 mt-1">
//                 Date: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
//               </p>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Class</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Section</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Total Students</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Present</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Absent</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Attendance %</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Progress</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Absent Students</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredData.map((classData, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 font-medium text-gray-900">{classData.class}</td>
//                       <td className="px-6 py-4 font-medium text-gray-900">{classData.section}</td>
//                       <td className="px-6 py-4 text-lg font-semibold text-gray-900">{classData.totalStudents}</td>
//                       <td className="px-6 py-4 text-lg font-semibold text-green-600">{classData.presentStudents}</td>
//                       <td className="px-6 py-4 text-lg font-semibold text-red-600">{classData.absentStudents}</td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAttendanceColor(
//                             classData.attendancePercentage
//                           )}`}
//                         >
//                           {classData.attendancePercentage}%
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 flex items-center gap-3">
//                         <div className="w-20 bg-gray-200 rounded-full h-3">
//                           <div
//                             className={`h-3 rounded-full ${getProgressBarColor(classData.attendancePercentage)}`}
//                             style={{ width: `${classData.attendancePercentage}%` }}
//                           />
//                         </div>
//                         <span className="text-sm text-gray-600">{classData.attendancePercentage}%</span>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         {classData.absentList.length > 0 ? (
//                           classData.absentList.map((student, idx) => (
//                             <div key={idx} className="mb-1">
//                               {student}
//                             </div>
//                           ))
//                         ) : (
//                           <span className="text-green-600 font-medium">All Present</span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         <button
//                           onClick={() => handleViewDetails(classData.class, classData.section)}
//                           className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
//                           title="View Details"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Summary Footer */}
//             <div className="p-6 bg-gray-50 border-t border-gray-200">
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
//                 <div>
//                   <p className="text-sm text-gray-600">Total Classes</p>
//                   <p className="text-xl font-bold text-gray-900">{filteredData.length}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Total Students</p>
//                   <p className="text-xl font-bold text-gray-900">{totalStudents}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Students Present</p>
//                   <p className="text-xl font-bold text-green-600">{totalPresent}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Overall Attendance</p>
//                   <p className="text-xl font-bold text-blue-600">{overallAttendancePercentage}%</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       <ViewDetailsModal />
//     </>
//   );
// };

// export default AttendanceReportPage;
