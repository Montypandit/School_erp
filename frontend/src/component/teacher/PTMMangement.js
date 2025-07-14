import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, MessageSquare, CheckCircle, XCircle, Plus, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TeacherNavbar from './TeacherNavbar'

const PTMManagement = () => {
  const [students, setStudents] = useState([]);
  const [ptmMeetings, setPtmMeetings] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [activeTab, setActiveTab] = useState('students');

  const [scheduleForm, setScheduleForm] = useState({
    title: '',
    description: '',
    scheduleDate: '',
    scheduleTime: '',
    venue: '',
    remarks: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPTMMeetings = async () => {
      try {
        const token = sessionStorage.getItem('teacherToken');
        if (!token) {
          toast.info('Please login to continue');
          navigate('/');
          return;
        }

        const res = await fetch('http://localhost:5000/api/ptm/get/all/ptm/schedules', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch PTM meetings');
        }
        const data = await res.json();
        setPtmMeetings(data.data);
      } catch (error) {
        toast.error('Failed to fetch PTM meetings. Please try again later');
        console.error(error);
      }
    };

    const fetchStudents = async () => {
      try {
        const token = sessionStorage.getItem('teacherToken');
        if (!token) {
          toast.info('Please login to continue');
          navigate('/');
          return;
        }

        const res = await fetch('http://localhost:5000/api/final/admission/get/all/admissions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application.json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await res.json();
        setStudents(data.data);
      } catch (error) {
        console.error('Error fechintg data', error);
        toast.error('Failed to fetch students. Please try again later');
      }
    }


    fetchStudents();
    fetchPTMMeetings();
  }, [navigate]);

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

  const handleStudentSelect = (student) => {
    setSelectedStudents(prev => {
      if (prev.includes(student)) {
        return prev.filter(s => s !== student);
      }
      return [...prev, student];
    });
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedStudents(selectAll ? [] : students);
  };

  const handleBulkSchedulePTM = () => {
    if (selectedStudents.length === 0) {
      toast.info('Please select at least one student');
      return;
    }
    
    setScheduleForm({
      title: 'PTM - Bulk Schedule',
      description: 'Parent-Teacher Meeting for multiple students',
      scheduleDate: '',
      scheduleTime: '',
      venue: 'School Conference Room',
      remarks: ''
    });
    setShowScheduleModal(true);
  };

  const handleFormSubmit = async () => {
    if (!scheduleForm.title || !scheduleForm.description || !scheduleForm.scheduleDate || !scheduleForm.scheduleTime) {
      toast.info('Please fill in all required fields');
      return;
    }

    if (selectedStudent) {
      const newMeeting = {
        meetingId: `PTM${Date.now()}`,
        admissionId: selectedStudent.admissionId,
        studentName: selectedStudent.name,
        parentName: selectedStudent.fatherName,
        parentPhone: selectedStudent.fatherMobile,
        ...scheduleForm,
        attendBy: 'Teacher',
        attendiesPhoneNo: selectedStudent.parentPhone,
        attendiesFeedback: '',
        meetingStatus: 'Scheduled',
      };

      try {
        const token = sessionStorage.getItem('teacherToken');
        if (!token) {
          toast.info('Please login to continue');
          navigate('/');
          return;
        }
        const res = await fetch('http://localhost:5000/api/ptm/create/ptm/schedule', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newMeeting)
        });

        if (!res.ok) {
          throw new Error('Failed to schedule PTM meeting');
        }

        const data = await res.json();
        toast.success(data.message);

        const updatedMeetings = [...ptmMeetings, newMeeting];
        setPtmMeetings(updatedMeetings);

        sendWhatsAppMessage(selectedStudent, scheduleForm);

        setShowScheduleModal(false);
        setSelectedStudent(null);
        toast.success('PTM scheduled successfully! WhatsApp message sent to parent.');
      } catch (error) {
        toast.error('Failed to schedule PTM meeting. Please try again later');
        console.error(error);
      }
    } else {
      const newMeetings = selectedStudents.map(student => ({
        meetingId: `PTM${Date.now()}${student.admissionId}`,
        admissionId: student.admissionId,
        studentName: student.name,
        parentName: student.fatherName,
        parentPhone: student.fatherMobile,
        ...scheduleForm,
        attendBy: 'Teacher',
        attendiesPhoneNo: student.parentPhone,
        attendiesFeedback: '',
        meetingStatus: 'Scheduled',
      }));

      try {
        const token = sessionStorage.getItem('teacherToken');
        if (!token) {
          toast.info('Please login to continue');
          navigate('/');
          return;
        }

        const res = await fetch('http://localhost:5000/api/ptm/create/bulk/ptm/schedules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newMeetings)
        });

        if (!res.ok) {
          throw new Error('Failed to schedule PTM meetings');
        }

        const data = await res.json();
        toast.success(data.message);

        setPtmMeetings(prev => [...prev, ...newMeetings]);

        selectedStudents.forEach(student => {
          sendWhatsAppMessage(student, scheduleForm);
        });

        setSelectedStudents([]);
        setSelectAll(false);

        setShowScheduleModal(false);
        toast.success('PTMs scheduled successfully! WhatsApp messages sent to parents.');
      } catch (error) {
        toast.error('Failed to schedule PTM meetings. Please try again later');
        console.error(error);
      }
    }
  };

  const sendWhatsAppMessage = (student, meeting) => {
    const message = `
Dear ${student.parentName},

A Parent-Teacher Meeting has been scheduled for your child ${student.name}.

Date: ${new Date(meeting.scheduleDate).toLocaleDateString()}
Time: ${meeting.scheduleTime}
Venue: ${meeting.venue}
Purpose: ${meeting.description}

Please confirm your attendance by replying to this message.

Thank you,
School Administration
    `.trim();

    let cleanNumber = student.fatherMobile.replace(/[^0-9]/g, '');
    if (cleanNumber.length === 10) {
      cleanNumber = '91' + cleanNumber;
    }
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
  };

  // Define valid sections based on StudentAllocation schema
  const VALID_SECTIONS = ['A', 'B', 'C', 'D'];

  // Get unique classes and sections from students
  const uniqueClasses = [...new Set(students.map(s => s.class))];
  
  // Get unique sections for the selected class
  const uniqueSections = filterClass 
    ? [...new Set(students.filter(s => s.class === filterClass).map(s => s.section))]
    : [];

  // Filter students based on class and section
  const filteredStudents = students.filter(student => {
    const matchesClass = !filterClass || student.class === filterClass;
    const matchesSection = !filterSection || student.section === filterSection;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.admissionId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSection && matchesSearch;
  });

  const renderStudentList = () => {
    return (
      <div className="overflow-x-auto">
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Filters and Select All */}
          <div className="flex-1 max-w-[180px]">
            <select
              value={filterClass}
              onChange={(e) => {
                setFilterClass(e.target.value);
                setFilterSection('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Classes</option>
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 max-w-[180px]">
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={!filterClass}
            >
              <option value="">All Sections</option>
              {VALID_SECTIONS.map((sec) => (
                <option 
                  key={sec} 
                  value={sec}
                  disabled={!uniqueSections.includes(sec)}
                >
                  {sec}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span>Select All</span>
          </div>
          
          {/* Schedule PTM button on the right */}
          <div className="flex-1 text-right">
            <button
              onClick={handleBulkSchedulePTM}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={selectedStudents.length === 0}
            >
              Schedule PTM for Selected
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.admissionId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student)}
                    onChange={() => handleStudentSelect(student)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </td>
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {student.section}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{student.fatherName}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {student.fatherMobile}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleSchedulePTM(student)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Schedule Individually
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const updateMeetingStatus = async (meetingId, newStatus) => {
    try{
      const token = sessionStorage.getItem('teacherToken');
      if(!token){
        toast.info('Please login to continue');
        navigate('/');
        return;
      };

      const res =await fetch(`http://localhost:5000/api/ptm/update/${meetingId}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json',
          'Authorization': `Bearer ${token}`
        },
        body:JSON.stringify({
          meetingStatus:newStatus
        })
      });

      if(!res.ok){
        throw new Error('Failed to update PTM meeting status');
      }

      const data = res.json();
      toast.success('Successfully updated PTM meeting status');
    } catch(error){
      console.error('Error updating PTM meeting status',error);
      toast.error('Failed to update PTM meeting status. Please try again later');
    }
  };

  return (
    <div>
      <TeacherNavbar/>
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">PTM Management</h1>
              <div className="flex space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Search className="absolute right-2 top-2.5 text-gray-400" />
                </div>
              </div>
            </div>

            {activeTab === 'students' && renderStudentList()}
            
            {/* PTM Meetings List */}
            {activeTab === 'meetings' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meeting ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ptmMeetings.map((meeting) => (
                      <tr key={meeting.meetingId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{meeting.meetingId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{meeting.studentName}</div>
                          <div className="text-sm text-gray-500">{meeting.class}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {new Date(meeting.scheduleDate).toLocaleDateString()} {meeting.scheduleTime}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            meeting.meetingStatus === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                            meeting.meetingStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {meeting.meetingStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => updateMeetingStatus(meeting.meetingId, 'Completed')}
                            className="text-green-600 hover:text-green-900 mr-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateMeetingStatus(meeting.meetingId, 'Cancelled')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Schedule PTM</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={scheduleForm.title}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={scheduleForm.description}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={scheduleForm.scheduleDate}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, scheduleDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    value={scheduleForm.scheduleTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, scheduleTime: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Venue</label>
                  <input
                    type="text"
                    value={scheduleForm.venue}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, venue: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Remarks</label>
                  <textarea
                    value={scheduleForm.remarks}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, remarks: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    setSelectedStudent(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFormSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PTMManagement;