import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Phone, MessageSquare, FileText, Plus, Edit, Trash2, Search, Filter, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const PTMManagement = () => {
  const [ptmMeetings, setPtmMeetings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    admissionId: '',
    meetingId: '',
    title: '',
    description: '',
    scheduleDate: '',
    scheduleTime: '',
    venue: '',
    remarks: '',
    attendBy: '',
    attendiesPhoneNo: '',
    attendiesFeedback: '',
    meetingStatus: 'Scheduled'
  });

  // Sample data for demonstration
  useEffect(() => {
    const sampleData = [
      {
        _id: '1',
        admissionId: 'ADM001',
        meetingId: 'PTM001',
        title: 'Academic Progress Discussion',
        description: 'Discuss student academic performance and behavioral assessment',
        scheduleDate: new Date('2025-07-05'),
        scheduleTime: '10:00 AM',
        venue: 'Room 201',
        remarks: 'Parent requested discussion about mathematics performance',
        attendBy: 'John Smith (Father)',
        attendiesPhoneNo: '+91-9876543210',
        attendiesFeedback: 'Very informative session',
        meetingStatus: 'Completed',
        createdAt: new Date('2025-06-20')
      },
      {
        _id: '2',
        admissionId: 'ADM002',
        meetingId: 'PTM002',
        title: 'Behavioral Counseling',
        description: 'Address behavioral concerns and create improvement plan',
        scheduleDate: new Date('2025-07-10'),
        scheduleTime: '2:30 PM',
        venue: 'Counselor Office',
        remarks: 'Teacher recommended counseling session',
        attendBy: 'Mary Johnson (Mother)',
        attendiesPhoneNo: '+91-9876543211',
        attendiesFeedback: '',
        meetingStatus: 'Scheduled',
        createdAt: new Date('2025-06-25')
      }
    ];
    setPtmMeetings(sampleData);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.admissionId || !formData.meetingId || !formData.title || !formData.description || 
        !formData.scheduleDate || !formData.scheduleTime || !formData.attendBy || !formData.attendiesFeedback) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (editingMeeting) {
      // Update existing meeting
      setPtmMeetings(prev => 
        prev.map(meeting => 
          meeting._id === editingMeeting._id 
            ? { ...meeting, ...formData, scheduleDate: new Date(formData.scheduleDate) }
            : meeting
        )
      );
    } else {
      // Add new meeting
      const newMeeting = {
        ...formData,
        _id: Date.now().toString(),
        scheduleDate: new Date(formData.scheduleDate),
        createdAt: new Date()
      };
      setPtmMeetings(prev => [...prev, newMeeting]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      admissionId: '',
      meetingId: '',
      title: '',
      description: '',
      scheduleDate: '',
      scheduleTime: '',
      venue: '',
      remarks: '',
      attendBy: '',
      attendiesPhoneNo: '',
      attendiesFeedback: '',
      meetingStatus: 'Scheduled'
    });
    setShowForm(false);
    setEditingMeeting(null);
  };

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setFormData({
      ...meeting,
      scheduleDate: meeting.scheduleDate.toISOString().split('T')[0]
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this PTM meeting?')) {
      setPtmMeetings(prev => prev.filter(meeting => meeting._id !== id));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'Scheduled':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredMeetings = ptmMeetings.filter(meeting => {
    const matchesSearch = meeting.admissionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.attendBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || meeting.meetingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PTM Management</h1>
              <p className="text-gray-600 mt-1">Manage Parent-Teacher Meetings</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Schedule PTM
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by admission ID, title, or attendee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Rescheduled">Rescheduled</option>
              </select>
            </div>
          </div>
        </div>

        {/* PTM Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingMeeting ? 'Edit PTM Meeting' : 'Schedule New PTM Meeting'}
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Admission ID *
                      </label>
                      <input
                        type="text"
                        name="admissionId"
                        value={formData.admissionId}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meeting ID *
                      </label>
                      <input
                        type="text"
                        name="meetingId"
                        value={formData.meetingId}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Schedule Date *
                      </label>
                      <input
                        type="date"
                        name="scheduleDate"
                        value={formData.scheduleDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Schedule Time *
                      </label>
                      <input
                        type="text"
                        name="scheduleTime"
                        value={formData.scheduleTime}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., 10:00 AM"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Venue
                      </label>
                      <input
                        type="text"
                        name="venue"
                        value={formData.venue}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meeting Status *
                      </label>
                      <select
                        name="meetingStatus"
                        value={formData.meetingStatus}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Rescheduled">Rescheduled</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attend By *
                    </label>
                    <input
                      type="text"
                      name="attendBy"
                      value={formData.attendBy}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., John Smith (Father)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attendee Phone Number
                    </label>
                    <input
                      type="text"
                      name="attendiesPhoneNo"
                      value={formData.attendiesPhoneNo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remarks
                    </label>
                    <textarea
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attendee Feedback *
                    </label>
                    <textarea
                      name="attendiesFeedback"
                      value={formData.attendiesFeedback}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      {editingMeeting ? 'Update Meeting' : 'Schedule Meeting'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PTM List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">PTM Meetings</h2>
            
            {filteredMeetings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No PTM meetings found</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredMeetings.map((meeting) => (
                  <div key={meeting._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(meeting.meetingStatus)}
                          <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            meeting.meetingStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                            meeting.meetingStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {meeting.meetingStatus}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{meeting.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(meeting)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(meeting._id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">ID:</span>
                        <span className="font-medium">{meeting.admissionId}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{meeting.scheduleDate.toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{meeting.scheduleTime}</span>
                      </div>
                      
                      {meeting.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Venue:</span>
                          <span className="font-medium">{meeting.venue}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Attendee:</span>
                        <span className="font-medium">{meeting.attendBy}</span>
                      </div>
                      
                      {meeting.attendiesPhoneNo && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{meeting.attendiesPhoneNo}</span>
                        </div>
                      )}
                    </div>
                    
                    {meeting.remarks && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Remarks:</span>
                            <p className="text-sm text-gray-600 mt-1">{meeting.remarks}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {meeting.attendiesFeedback && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-blue-400 mt-0.5" />
                          <div>
                            <span className="text-sm font-medium text-blue-700">Feedback:</span>
                            <p className="text-sm text-blue-600 mt-1">{meeting.attendiesFeedback}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PTMManagement;