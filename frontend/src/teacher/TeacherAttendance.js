import React, { useState, useEffect } from 'react';
import { Clock, Users, Calendar, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const TeacherAttendanceSystem = () => {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState('Present');
  const [inTime, setInTime] = useState('');
  const [outTime, setOutTime] = useState('');
  const [remarks, setRemarks] = useState('');

  // Sample data - replace with actual API calls
  const [teachers] = useState([
    {
      teacherId: 'T001',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      phone: '+1-555-0123',
      department: 'Mathematics',
      designation: 'Head of Department',
      profilePhotoUrl: null
    },
    {
      teacherId: 'T002',
      name: 'Mr. David Smith',
      email: 'david.smith@school.edu',
      phone: '+1-555-0124',
      department: 'English',
      designation: 'Senior Teacher',
      profilePhotoUrl: null
    },
    {
      teacherId: 'T003',
      name: 'Ms. Emily Davis',
      email: 'emily.davis@school.edu',
      phone: '+1-555-0125',
      department: 'Science',
      designation: 'Teacher',
      profilePhotoUrl: null
    },
    {
      teacherId: 'T004',
      name: 'Prof. Michael Brown',
      email: 'michael.brown@school.edu',
      phone: '+1-555-0126',
      department: 'History',
      designation: 'Professor',
      profilePhotoUrl: null
    }
  ]);

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [summary, setSummary] = useState({
    date: currentDate,
    totalTeachers: 4,
    presentCount: 0,
    absentCount: 0,
    leaveCount: 0,
    halfDayCount: 0
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate summary based on attendance records
  useEffect(() => {
    const todayRecords = attendanceRecords.filter(record => record.date === currentDate);
    const presentCount = todayRecords.filter(record => record.status === 'Present').length;
    const absentCount = todayRecords.filter(record => record.status === 'Absent').length;
    const leaveCount = todayRecords.filter(record => record.status === 'Leave').length;
    const halfDayCount = todayRecords.filter(record => record.status === 'Half Day').length;

    setSummary({
      date: currentDate,
      totalTeachers: teachers.length,
      presentCount,
      absentCount,
      leaveCount,
      halfDayCount
    });
  }, [attendanceRecords, currentDate, teachers.length]);

  const handleMarkAttendance = () => {
    if (!selectedTeacher) {
      alert('Please select a teacher first');
      return;
    }

    const existingRecord = attendanceRecords.find(
      record => record.teacherId === selectedTeacher.teacherId && record.date === currentDate
    );

    if (existingRecord) {
      alert('Attendance already marked for this teacher today');
      return;
    }

    const newRecord = {
      attendanceId: `ATT_${Date.now()}`,
      teacherId: selectedTeacher.teacherId,
      date: currentDate,
      status: attendanceStatus,
      inTime: inTime || (attendanceStatus === 'Present' ? new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''),
      outTime: outTime || '',
      remarks: remarks,
      recordedBy: 'ADMIN_001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAttendanceRecords([...attendanceRecords, newRecord]);
    
    // Reset form
    setSelectedTeacher(null);
    setAttendanceStatus('Present');
    setInTime('');
    setOutTime('');
    setRemarks('');
    
    alert('Attendance marked successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'text-green-600 bg-green-100';
      case 'Absent': return 'text-red-600 bg-red-100';
      case 'Leave': return 'text-yellow-600 bg-yellow-100';
      case 'Half Day': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present': return <CheckCircle className="w-4 h-4" />;
      case 'Absent': return <XCircle className="w-4 h-4" />;
      case 'Leave': return <AlertCircle className="w-4 h-4" />;
      case 'Half Day': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const todayRecords = attendanceRecords.filter(record => record.date === currentDate);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Teacher Attendance System</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(currentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{currentTime}</span>
                </div>
              </div>
            </div>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Total Teachers</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalTeachers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-2xl font-bold text-green-600">{summary.presentCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-red-600">{summary.absentCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Leave/Half Day</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.leaveCount + summary.halfDayCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mark Attendance Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mark Attendance</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Teacher</label>
                <select
                  value={selectedTeacher?.teacherId || ''}
                  onChange={(e) => {
                    const teacher = teachers.find(t => t.teacherId === e.target.value);
                    setSelectedTeacher(teacher || null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a teacher...</option>
                  {teachers.map(teacher => (
                    <option key={teacher.teacherId} value={teacher.teacherId}>
                      {teacher.name} - {teacher.department}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTeacher && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedTeacher.name}</p>
                      <p className="text-sm text-gray-600">{selectedTeacher.designation}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Department: {selectedTeacher.department}</p>
                    <p>Email: {selectedTeacher.email}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={attendanceStatus}
                  onChange={(e) => setAttendanceStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Leave">Leave</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">In Time</label>
                  <input
                    type="time"
                    value={inTime}
                    onChange={(e) => setInTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Out Time</label>
                  <input
                    type="time"
                    value={outTime}
                    onChange={(e) => setOutTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  placeholder="Any additional notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleMarkAttendance}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Mark Attendance
              </button>
            </div>
          </div>

          {/* Today's Attendance */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Attendance</h2>
            
            <div className="space-y-3">
              {todayRecords.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No attendance records for today</p>
              ) : (
                todayRecords.map(record => {
                  const teacher = teachers.find(t => t.teacherId === record.teacherId);
                  return (
                    <div key={record.attendanceId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{teacher?.name}</p>
                            <p className="text-sm text-gray-600">{teacher?.department}</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)}
                          {record.status}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {record.inTime && (
                          <span>In: {record.inTime}</span>
                        )}
                        {record.outTime && (
                          <span>Out: {record.outTime}</span>
                        )}
                      </div>
                      {record.remarks && (
                        <p className="text-sm text-gray-600 mt-2">{record.remarks}</p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendanceSystem;