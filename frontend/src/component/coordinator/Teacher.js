import React, { useState, useEffect } from 'react';
import { Users, Calendar, Clock, BookOpen, MapPin, X, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CoordinatorNavbar from './CoordinatorNavbar';

const TeacherAllocationPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [allocationForm, setAllocationForm] = useState({
    subject: '',
    className: '',
    section: '',
    day: '',
    startTime: '',
    endTime: '',
    roomNumber: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [teacherSchedule, setTeacherSchedule] = useState([]);

  // Days of the week options
  const daysOfWeek = ['All Days','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Time slots (you can customize these)
  const timeSlots = [
    'All Time','08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const navigate = useNavigate();

  // Fetch all employees and filter teachers
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeacherSchedule = async (empId) => {
    try {
      setScheduleLoading(true);
      setTeacherSchedule([]);
      setShowScheduleModal(true);
      const storedData = sessionStorage.getItem('coordinatorToken');
      const token = storedData ? JSON.parse(storedData).token : null;
      if (!token) {
        toast.error('Please login to continue');
        navigate('/');
        return;
      }
      const res = await fetch(`https://school-erp-1-exji.onrender.com/api/teaching/schedule/get/teaching/schedule/${empId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch teaching schedule');
      }
      const schedule = await res.json();
      setTeacherSchedule(schedule);
    } catch (err) {
      setTeacherSchedule([]);
      console.log(err);
      toast.error('Error fetching schedule');
    } finally {
      setScheduleLoading(false);
    }
  }

  const fetchTeachers = async () => {
    try {
      setLoading(true);

      const storedData = sessionStorage.getItem('coordinatorToken');
      const token = storedData ? JSON.parse(storedData).token : null;
      if(!token){
        toast.error('Please login to continue');
        navigate('/');
        return;
      }
      // Assuming the API endpoint from addEmployee.js
      const response = await fetch('https://school-erp-1-exji.onrender.com/api/employees/get/all/employees', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }

      const employees = await response.json();
      console.log(employees)
      // Filter employees with role 'teacher'
      const teachersList = employees.filter(emp => emp.role.toLowerCase() === 'teacher');
      setTeachers(teachersList);
    } catch (err) {
      setError('Error fetching teachers: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAllocateClick = (teacher) => {
    setSelectedTeacher(teacher);
    setShowAllocationModal(true);
    setAllocationForm({
      subject: '',
      className: '',
      section: '',
      day: '',
      startTime: '',
      endTime: '',
      roomNumber: ''
    });
    setError('');
    setSuccess('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setAllocationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitAllocation = async () => {
    if (!selectedTeacher) return;

    try {
      setSubmitting(true);
      setError('');

      const allocationData = {
        empId: selectedTeacher.empId,
        empName: `${selectedTeacher.firstName} ${selectedTeacher.lastName}`,
        subject: allocationForm.subject,
        className: allocationForm.className,
        section: allocationForm.section,
        day: allocationForm.day,
        startTime: allocationForm.startTime,
        endTime: allocationForm.endTime,
        roomNumber: allocationForm.roomNumber
      };

      const token = sessionStorage.getItem('coordinatorToken');
      if(!token){
        toast.error('Please login to continue');
        navigate('/');
        return;
      }

      const response = await fetch('https://school-erp-1-exji.onrender.com/api/teaching/schedule/create/teaching/schedule', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(allocationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create teaching schedule');
      }

      const result = await response.json();
      setSuccess('Class allocated successfully!');
      
      // Reset form after successful submission
      setTimeout(() => {
        setShowAllocationModal(false);
        setSelectedTeacher(null);
        setSuccess('');
      }, 2000);

    } catch (err) {
      setError('Error allocating class: ' + err.message);
      console.error('Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowAllocationModal(false);
    setSelectedTeacher(null);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teachers...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
    <CoordinatorNavbar/>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                Teacher Management
              </h1>
              <p className="text-gray-600 mt-2">Manage and allocate classes to teachers</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Teachers</p>
              <p className="text-2xl font-bold text-blue-600">{teachers.length}</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && !showAllocationModal && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <div key={teacher.empId} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {teacher.firstName} {teacher.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {teacher.empId}</p>
                </div>
                {teacher.imageUrl && (
                  <img 
                    src={teacher.imageUrl} 
                    alt={`${teacher.firstName} ${teacher.lastName}`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{teacher.qualification}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Joined: {new Date(teacher.doj).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  <span className="capitalize">{teacher.role}</span>
                </div>
              </div>

              <button
                onClick={() => handleAllocateClick(teacher)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium mb-2"
              >
                <Plus className="h-4 w-4" />
                Allocate Classes
              </button>
              <button
                onClick={() => fetchTeacherSchedule(teacher.empId)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Clock className="h-4 w-4" />
                View Schedule
              </button>
            </div>
          ))}
        </div>

        {teachers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Teachers Found</h3>
            <p className="text-gray-500">No employees with teacher role found in the system.</p>
          </div>
        )}
      </div>

      {/* Allocation Modal */}
      {showAllocationModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Allocate Class to {selectedTeacher.firstName} {selectedTeacher.lastName}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject 
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={allocationForm.subject}
                    onChange={handleFormChange}
                    
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter subject name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class *
                    </label>
                    <input
                      type="text"
                      name="className"
                      value={allocationForm.className}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 10th"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section *
                    </label>
                    <input
                      type="text"
                      name="section"
                      value={allocationForm.section}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., A"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Day 
                  </label>
                  <select
                    name="day"
                    value={allocationForm.day}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Day</option>
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time 
                    </label>
                    <select
                      name="startTime"
                      value={allocationForm.startTime}
                      onChange={handleFormChange}
                      
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time 
                    </label>
                    <select
                      name="endTime"
                      value={allocationForm.endTime}
                      onChange={handleFormChange}
                     
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Number 
                  </label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={allocationForm.roomNumber}
                    onChange={handleFormChange}
                    
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., R-101"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmitAllocation}
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Allocating...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4" />
                        Allocate Class
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Teaching Schedule
                </h2>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              {scheduleLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : teacherSchedule && teacherSchedule.length > 0 ? (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-2 py-1">Subject</th>
                      <th className="px-2 py-1">Class</th>
                      <th className="px-2 py-1">Section</th>
                      <th className="px-2 py-1">Day</th>
                      <th className="px-2 py-1">Time</th>
                      <th className="px-2 py-1">Room</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherSchedule.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-2 py-1">{item.subject}</td>
                        <td className="px-2 py-1">{item.className}</td>
                        <td className="px-2 py-1">{item.section}</td>
                        <td className="px-2 py-1">{item.day}</td>
                        <td className="px-2 py-1">{item.startTime} - {item.endTime}</td>
                        <td className="px-2 py-1">{item.roomNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">No schedule found.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default TeacherAllocationPage;