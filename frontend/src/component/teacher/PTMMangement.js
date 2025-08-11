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
  const [currTeacherClasses, setCurrTeacherClasses] = useState([])
  const [empId, setEmpId] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentStudentForUpdate, setCurrentStudentForUpdate] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
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
    const token = sessionStorage.getItem('teacherToken');
    if (!token) {
      toast.info('Please login to continue');
      navigate('/');
      return;
    }
    const fetchPTMMeetings = async () => {
      try {

        const res = await fetch('https://school-erp-11-mr7k.onrender.com/api/ptm/get/all/ptm', {
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

    const fetchEmpId = async () => {
      try {
        const email = sessionStorage.getItem('email');
        if (!email) {
          console.error("Email not found in session storage.");
          return;
        }
        const res = await fetch(`https://school-erp-11-mr7k.onrender.com/api/employees/get/employee/email/${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (!res.ok) {
          throw new Error('Failed to fetch empId');
        }

        const data = await res.json();
        setEmpId(data.empId);
      } catch (err) {
        console.log(err);
      }
    }

    const fetchStudents = async () => {
      try {
        const token = sessionStorage.getItem('teacherToken');
        if (!token) {
          toast.info('Please login to continue');
          navigate('/');
          return;
        }

        const res = await fetch('https://school-erp-11-mr7k.onrender.com/api/final/admission/get/all/admissions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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
    fetchEmpId();
    fetchPTMMeetings();
  }, [navigate]);

  useEffect(() => {
    if (!empId) {
      return;
    }

    const fetchCurrTeacherClasses = async () => {
      try {
        const token = sessionStorage.getItem('teacherToken');
        const res = await fetch(`https://school-erp-11-mr7k.onrender.com/api/teaching/schedule/get/teaching/schedule/${empId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch teacher classes');
        }

        const data = await res.json();
        setCurrTeacherClasses(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCurrTeacherClasses();
  }, [empId]);

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
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedStudents(newSelectAll ? filteredStudents : []);
  };

  const handleBulkSchedulePTM = () => {
    if (selectedStudents.length === 0) {
      toast.info('Please select at least one student');
      return;
    }
    if (!filterClass || !filterSection) {
      toast.error('Please select a class and section before scheduling for multiple students.');
      return;
    }
    
    setScheduleForm({
      title: `PTM for ${filterClass} - ${filterSection}`,
      description: `Parent-Teacher Meeting for selected students in ${filterClass} - ${filterSection}`,
      scheduleDate: '',
      scheduleTime: '',
      venue: 'School Conference Room',
      remarks: ''
    });
    setShowScheduleModal(true);
  };

  const handleFormSubmit = async () => {
    if (!scheduleForm.title || !scheduleForm.scheduleDate || !scheduleForm.scheduleTime) {
      toast.info('Please fill in all required fields: Title, Date, and Time.');
      return;
    }

    const isBulk = !selectedStudent;
    const studentsToSchedule = selectedStudent ? [selectedStudent] : selectedStudents;
    if (studentsToSchedule.length === 0) {
      toast.error('No students selected for PTM.');
      return;
    }

    const firstStudent = studentsToSchedule[0]; // Still needed for single student case

    const payload = {
      ...scheduleForm,
      scheduledDate: `${scheduleForm.scheduleDate}T${scheduleForm.scheduleTime}:00`,
      class: isBulk ? filterClass : firstStudent.class,
      section: isBulk ? filterSection : firstStudent.section,
      students: studentsToSchedule.map(s => ({
        admissionId: s.admissionId,
        name: s.name
      }))
    };

    try {
      const token = sessionStorage.getItem('teacherToken');
      const res = await fetch('https://school-erp-11-mr7k.onrender.com/api/ptm/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to schedule PTM');
      }

      toast.success('PTM scheduled successfully!');
      setPtmMeetings(prev => [...prev, data.data]);

      // Send WhatsApp messages - updated logic
      if (isBulk) {
        const message = `
Dear Parents,

A Parent-Teacher Meeting has been scheduled for students of class ${filterClass} - ${filterSection}.

Date: ${new Date(scheduleForm.scheduleDate).toLocaleDateString()}
Time: ${scheduleForm.scheduleTime}
Venue: ${scheduleForm.venue}
Purpose: ${scheduleForm.description}

Please be present.

Thank you,
School Administration
        `.trim();
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        toast.info('Please select the class group in WhatsApp to send the message.');
      } else {
        sendWhatsAppMessage(selectedStudent, scheduleForm);
      }

      // Reset state
      setShowScheduleModal(false);
      setSelectedStudent(null);
      setSelectedStudents([]);
      setSelectAll(false);

    } catch (error) {
      toast.error(error.message || 'An error occurred while scheduling PTM.');
      console.error(error);
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

Please be present.

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

  const handleOpenUpdateModal = (meeting, student, status) => {
    const now = new Date();
    const scheduledDateTime = new Date(meeting.scheduledDate);

    if (status === 'completed' && now < scheduledDateTime) {
      toast.info("You cannot complete a PTM before its scheduled time.");
      return;
    }

    // This check is a safeguard. The UI should already prevent this.
    if (student.status === 'pending' && now > scheduledDateTime) {
      toast.error("This meeting has expired and cannot be updated.");
      return;
    }

    setCurrentStudentForUpdate({ ptmId: meeting._id, student, status });
    if (status === 'completed') {
      setFeedbackText(student.feedback || '');
      setShowFeedbackModal(true);
    } else if (status === 'rejected') {
      setRejectionReason(student.rejectionReason || '');
      setShowFeedbackModal(true); // Re-using the same modal structure
    }
  };

  const handleUpdateStudentStatus = async () => {
    if (!currentStudentForUpdate) return;

    const { ptmId, student, status } = currentStudentForUpdate;
    const payload = { status };

    if (status === 'completed') {
      payload.feedback = feedbackText;
    } else if (status === 'rejected') {
      payload.rejectionReason = rejectionReason;
    }

    try {
      const token = sessionStorage.getItem('teacherToken');
      const res = await fetch(`https://school-erp-11-mr7k.onrender.com/api/ptm/update/ptm/status/${ptmId}/${student.admissionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update status');
      }

      toast.success('Student PTM status updated successfully!');
      
      // Update local state
      setPtmMeetings(prevMeetings => prevMeetings.map(meeting => 
        meeting._id === ptmId ? data.data : meeting
      ));

      // Close modal and reset state
      setShowFeedbackModal(false);
      setCurrentStudentForUpdate(null);
      setFeedbackText('');
      setRejectionReason('');
    } catch (error) {
      toast.error(error.message || 'An error occurred while updating status.');
    }
  };
  // Filter students based on class and section
  const filteredStudents = students.filter(student => {
    const matchesClass = !filterClass || student.class === filterClass;
    const matchesSection = !filterSection || student.section === filterSection;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.admissionId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSection && matchesSearch;
  });

  const renderStudentList = () => {
    // Use a Map to get unique class names while preserving original casing and trimming whitespace.
    const uniqueTeacherClassesMap = new Map();
    currTeacherClasses.forEach(item => {
      if (item.className) {
        const normalized = item.className.trim().toLowerCase();
        if (!uniqueTeacherClassesMap.has(normalized)) {
          uniqueTeacherClassesMap.set(normalized, item.className.trim());
        }
      }
    });
    const uniqueTeacherClasses = Array.from(uniqueTeacherClassesMap.values());

    const uniqueTeacherSectionsMap = new Map();
    if (filterClass) {
      currTeacherClasses.filter(item => item.className === filterClass).forEach(item => {
        if (item.section) {
          const normalized = item.section.trim().toLowerCase();
          if (!uniqueTeacherSectionsMap.has(normalized)) {
            uniqueTeacherSectionsMap.set(normalized, item.section.trim());
          }
        }
      });
    }
    const uniqueTeacherSections = Array.from(uniqueTeacherSectionsMap.values());

    return (
      <div className="overflow-x-auto">
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Filters and Select All */}
          <div className="flex-1 min-w-[150px]">
            <select
              value={filterClass}
              onChange={(e) => {
                setFilterClass(e.target.value);
                setFilterSection('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Classes</option>
              {uniqueTeacherClasses.map((className) => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={!filterClass}
            >
              <option value="">All Sections</option>
              {uniqueTeacherSections.map((section) => (
                <option key={section} value={section}>
                  {section}
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

  const renderMeetingsList = () => {
    return (
      <div className="space-y-6">
        {ptmMeetings.map((meeting) => {
          const now = new Date();
          const scheduledDateTime = new Date(meeting.scheduledDate);
          const isExpired = now > scheduledDateTime;

          return (
            <div key={meeting._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="border-b pb-4 mb-4">
                <h3 className="text-xl font-bold text-gray-800">{meeting.title}</h3>
                <p className="text-sm text-gray-500">Class: {meeting.class} - {meeting.section}</p>
                <p className="text-sm text-gray-500">Date: {new Date(meeting.scheduledDate).toLocaleString()}</p>
              </div>
              <ul className="space-y-3">
                {meeting.students.map((student) => {
                  const isPendingAndExpired = student.status === 'pending' && isExpired;
                  return (
                    <li key={student.admissionId} className="flex flex-wrap items-start justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex-1 min-w-[200px]">
                        <p className="font-semibold text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">ID: {student.admissionId}</p>
                        {student.status === 'completed' && student.feedback && (
                          <p className="text-xs text-gray-600 mt-1 italic">Feedback: {student.feedback}</p>
                        )}
                        {student.status === 'rejected' && student.rejectionReason && (
                          <p className="text-xs text-gray-600 mt-1 italic">Reason: {student.rejectionReason}</p>
                        )}
                      </div>
                      <div className="flex-1 min-w-[100px] text-center md:text-left">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          isPendingAndExpired ? 'bg-gray-200 text-gray-700' :
                          student.status === 'completed' ? 'bg-green-100 text-green-800' :
                          student.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {isPendingAndExpired ? 'Expired' : student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2 md:mt-0 min-w-[150px] justify-end">
                        {student.status === 'pending' && !isExpired ? (
                          <>
                            <button
                              onClick={() => handleOpenUpdateModal(meeting, student, 'completed')}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 flex items-center gap-1"
                            >
                              <CheckCircle size={14} /> Complete
                            </button>
                            <button
                              onClick={() => handleOpenUpdateModal(meeting, student, 'rejected')}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 flex items-center gap-1"
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
        {ptmMeetings.length === 0 && <p className="text-center text-gray-500">No scheduled meetings found.</p>}
      </div>
    );
  };

  return (
    <div>
      <TeacherNavbar/>
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">PTM Management</h1>
              <div className="flex items-center space-x-4">
                <div className="flex border-b">
                  <button onClick={() => setActiveTab('students')} className={`px-4 py-2 font-medium ${activeTab === 'students' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Students</button>
                  <button onClick={() => setActiveTab('meetings')} className={`px-4 py-2 font-medium ${activeTab === 'meetings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Scheduled Meetings</button>
                </div>
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
            {activeTab === 'meetings' && renderMeetingsList()}
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

      {/* Feedback/Rejection Modal */}
      {showFeedbackModal && currentStudentForUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Update Status for {currentStudentForUpdate.student.name}
            </h2>
            {currentStudentForUpdate.status === 'completed' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">Feedback</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="4"
                  placeholder="Enter feedback for the student..."
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="4"
                  placeholder="Enter reason for rejection..."
                />
              </div>
            )}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStudentStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PTMManagement;