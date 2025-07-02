import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, MessageSquare, CheckCircle, XCircle, Plus, Search, Filter } from 'lucide-react';

const PTMManagement = () => {
  const [students, setStudents] = useState([]);
  const [ptmMeetings, setPtmMeetings] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [activeTab, setActiveTab] = useState('students');

  // Sample student data
  const sampleStudents = [
    {
      admissionId: 'ADM001',
      name: 'Rahul Sharma',
      class: '10-A',
      rollNo: '15',
      parentName: 'Rajesh Sharma',
      parentPhone: '+91-9876543210',
      email: 'rajesh.sharma@email.com'
    },
    {
      admissionId: 'ADM002',
      name: 'Priya Singh',
      class: '10-A',
      rollNo: '22',
      parentName: 'Suresh Singh',
      parentPhone: '+91-9876543211',
      email: 'suresh.singh@email.com'
    },
    {
      admissionId: 'ADM003',
      name: 'Amit Kumar',
      class: '9-B',
      rollNo: '08',
      parentName: 'Vikash Kumar',
      parentPhone: '+91-9876543212',
      email: 'vikash.kumar@email.com'
    },
    {
      admissionId: 'ADM004',
      name: 'Anita Gupta',
      class: '10-B',
      rollNo: '11',
      parentName: 'Ramesh Gupta',
      parentPhone: '+91-9876543213',
      email: 'ramesh.gupta@email.com'
    }
  ];

  const [scheduleForm, setScheduleForm] = useState({
    title: '',
    description: '',
    scheduleDate: '',
    scheduleTime: '',
    venue: '',
    remarks: ''
  });

  useEffect(() => {
    setStudents(sampleStudents);
    // Load existing PTM meetings from localStorage (simulating database)
    const savedMeetings = JSON.parse(localStorage.getItem('ptmMeetings') || '[]');
    setPtmMeetings(savedMeetings);
  }, []);

  const handleSchedulePTM = (student) => {
    setSelectedStudent(student);
    setScheduleForm({
      title: `PTM - ${student.name}`,
      description: `Parent-Teacher Meeting for ${student.name} (${student.class})`,
      scheduleDate: '',
      scheduleTime: '',
      venue: 'School Conference Room',
      remarks: ''
    });
    setShowScheduleModal(true);
  };

  const handleFormSubmit = () => {
    // Basic validation
    if (!scheduleForm.title || !scheduleForm.description || !scheduleForm.scheduleDate || !scheduleForm.scheduleTime) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newMeeting = {
      meetingId: `PTM${Date.now()}`,
      admissionId: selectedStudent.admissionId,
      studentName: selectedStudent.name,
      parentName: selectedStudent.parentName,
      parentPhone: selectedStudent.parentPhone,
      ...scheduleForm,
      attendBy: 'Teacher',
      attendiesPhoneNo: selectedStudent.parentPhone,
      attendiesFeedback: '',
      meetingStatus: 'Scheduled',
      createdAt: new Date().toISOString()
    };

    const updatedMeetings = [...ptmMeetings, newMeeting];
    setPtmMeetings(updatedMeetings);
    localStorage.setItem('ptmMeetings', JSON.stringify(updatedMeetings));

    // Simulate WhatsApp message sending
    sendWhatsAppMessage(selectedStudent, scheduleForm);
    
    setShowScheduleModal(false);
    setSelectedStudent(null);
    alert('PTM scheduled successfully! WhatsApp message sent to parent.');
  };

  const sendWhatsAppMessage = (student, meeting) => {
    const message = `
Dear ${student.parentName},

A Parent-Teacher Meeting has been scheduled for your child ${student.name}.

📅 Date: ${new Date(meeting.scheduleDate).toLocaleDateString()}
🕐 Time: ${meeting.scheduleTime}
📍 Venue: ${meeting.venue}
📝 Purpose: ${meeting.description}

Please confirm your attendance by replying to this message.

Thank you,
School Administration
    `.trim();

    const whatsappUrl = `https://wa.me/${student.parentPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.admissionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !filterClass || student.class === filterClass;
    return matchesSearch && matchesClass;
  });

  const uniqueClasses = [...new Set(students.map(s => s.class))];

  const updateMeetingStatus = (meetingId, newStatus, feedback = '') => {
    const updatedMeetings = ptmMeetings.map(meeting => 
      meeting.meetingId === meetingId 
        ? { ...meeting, meetingStatus: newStatus, attendiesFeedback: feedback }
        : meeting
    );
    setPtmMeetings(updatedMeetings);
    localStorage.setItem('ptmMeetings', JSON.stringify(updatedMeetings));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PTM Management System</h1>
          <p className="text-gray-600">Schedule and manage Parent-Teacher Meetings</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('students')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'students'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <User className="inline-block w-4 h-4 mr-2" />
                Students
              </button>
              <button
                onClick={() => setActiveTab('meetings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'meetings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Calendar className="inline-block w-4 h-4 mr-2" />
                Scheduled Meetings
              </button>
            </nav>
          </div>
        </div>

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-lg shadow-sm">
            {/* Search and Filter */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Classes</option>
                    {uniqueClasses.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Students List */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.admissionId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">ID: {student.admissionId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {student.class}
                        </span>
                        <div className="text-sm text-gray-500 mt-1">Roll: {student.rollNo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student.parentName}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {student.parentPhone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleSchedulePTM(student)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Schedule PTM
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Meetings Tab */}
        {activeTab === 'meetings' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Scheduled PTM Meetings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meeting Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ptmMeetings.map((meeting) => (
                    <tr key={meeting.meetingId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{meeting.title}</div>
                          <div className="text-sm text-gray-500">{meeting.description}</div>
                          <div className="text-xs text-gray-400 mt-1">ID: {meeting.meetingId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{meeting.studentName}</div>
                          <div className="text-sm text-gray-500">{meeting.parentName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(meeting.scheduleDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          {meeting.scheduleTime}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{meeting.venue}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          meeting.meetingStatus === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : meeting.meetingStatus === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {meeting.meetingStatus === 'Completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {meeting.meetingStatus === 'Cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                          {meeting.meetingStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {meeting.meetingStatus === 'Scheduled' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateMeetingStatus(meeting.meetingId, 'Completed', 'Meeting completed successfully')}
                              className="text-green-600 hover:text-green-900 text-sm"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => updateMeetingStatus(meeting.meetingId, 'Cancelled')}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {ptmMeetings.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No PTM meetings scheduled yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Schedule PTM Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">Schedule PTM</h3>
                <p className="text-sm text-gray-600">
                  For {selectedStudent?.name} ({selectedStudent?.class})
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={scheduleForm.title}
                    onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={scheduleForm.description}
                    onChange={(e) => setScheduleForm({...scheduleForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={scheduleForm.scheduleDate}
                      onChange={(e) => setScheduleForm({...scheduleForm, scheduleDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={scheduleForm.scheduleTime}
                      onChange={(e) => setScheduleForm({...scheduleForm, scheduleTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                  <input
                    type="text"
                    value={scheduleForm.venue}
                    onChange={(e) => setScheduleForm({...scheduleForm, venue: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                  <textarea
                    value={scheduleForm.remarks}
                    onChange={(e) => setScheduleForm({...scheduleForm, remarks: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleFormSubmit}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <MessageSquare className="w-4 h-4 mr-1 inline-block" />
                    Schedule & Send WhatsApp
                  </button>
                </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PTMManagement;