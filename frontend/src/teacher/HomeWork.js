import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { BookOpen, Calendar, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react';
import TeacherNavbar from '../component/teacher/TeacherNavbar';

const HomeWork = () => {
  const [formData, setFormData] = useState({
    className: '',
    section: '',
    subject: '',
    homeworkDetails: '',
    dueDate: ''
  });
  
  const [teacherSchedules, setTeacherSchedules] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableSections, setAvailableSections] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [teacherId, setTeacherId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  

  // Fetch teacher's data and schedules on component mount
  useEffect(() => {
    const fetchTeacherData = async () => {
      const startData = sessionStorage.getItem('teacherToken');
      const token = startData ? JSON.parse(startData).token : null;
      if (!token) {
        toast.error('Please login to continue');
        window.location.href = '/teacher/login';
        return;
      }

      try {
        // First get teacher's info
        const teacherRes = await fetch(
          `https://school-erp-1-exji.onrender.com/api/employees/get/employee/email/${sessionStorage.getItem('email')}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!teacherRes.ok) {
          throw new Error('Failed to fetch teacher information');
        }

        const teacherData = await teacherRes.json();
        setTeacherId(teacherData.empId);

        // Then get teacher's schedule
        const scheduleRes = await fetch(
          `https://school-erp-1-exji.onrender.com/api/teaching/schedule/get/teaching/schedule/${teacherData.empId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!scheduleRes.ok) {
          throw new Error('Failed to fetch teaching schedule');
        }

        const scheduleData = await scheduleRes.json();
        setTeacherSchedules(scheduleData);
        
        // Extract unique classes that the teacher is assigned to
        const classes = [...new Set(
          scheduleData
            .filter(schedule => schedule.empId === teacherData.empId) // Only include classes assigned to this teacher
            .map(item => item.className)
        )];
        
        if (classes.length === 0) {
          toast.warning('You are not assigned to any classes. Please contact the administrator.');
        }
        
        setAvailableClasses(classes);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to load teaching schedule');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  // Update sections when class is selected
  useEffect(() => {
    if (formData.className) {
      const sections = [
        ...new Set(
          teacherSchedules
            .filter(schedule => 
              schedule.className === formData.className && 
              schedule.empId === teacherId
            )
            .map(schedule => schedule.section)
        )
      ];
      setAvailableSections(sections);
      
      // Reset section and subject when class changes
      setFormData(prev => ({
        ...prev,
        section: '',
        subject: ''
      }));
      setAvailableSubjects([]);
    }
  }, [formData.className, teacherSchedules, teacherId]);

  // Update subjects when section is selected
  useEffect(() => {
    if (formData.className && formData.section) {
      const subjects = [
        ...new Set(
          teacherSchedules
            .filter(
              schedule => 
                schedule.className === formData.className && 
                schedule.section === formData.section &&
                schedule.empId === teacherId
            )
            .map(schedule => schedule.subject)
        )
      ];
      setAvailableSubjects(subjects);
      
      // Reset subject when section changes
      setFormData(prev => ({
        ...prev,
        subject: ''
      }));
    }
  }, [formData.section, formData.className, teacherSchedules, teacherId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.className || !formData.section || !formData.subject || !formData.homeworkDetails || !formData.dueDate) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Validate due date is in the future
    const selectedDate = new Date(formData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error('Due date must be in the future');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const startData = sessionStorage.getItem('teacherToken');
      const token = startData ? JSON.parse(startData).token : null;
      if (!token) {
        throw new Error('No authentication token found');
      }

      // First try to get teacher's admission ID from session storage
      let teacherAdmissionId = sessionStorage.getItem('teacherAdmissionId');
      
      // If not found in session storage, try to fetch teacher's profile
      if (!teacherAdmissionId) {
        try {
          const profileResponse = await fetch(`https://school-erp-1-exji.onrender.com/api/employees/get/employee/email/${sessionStorage.getItem('email')}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!profileResponse.ok) {
            throw new Error('Failed to fetch teacher profile');
          }
          
          const teacherProfile = await profileResponse.json();
          
          // Try to find a suitable identifier in the profile
          teacherAdmissionId = teacherProfile.admissionId || 
                             teacherProfile.employeeId ||
                             teacherProfile._id; // Try MongoDB _id as fallback
          
          if (!teacherAdmissionId) {
            console.error('Available profile fields:', Object.keys(teacherProfile));
            throw new Error(`Admission ID not found in teacher profile. Available fields: ${Object.keys(teacherProfile).join(', ')}`);
          }
          
          // Store for future use
          sessionStorage.setItem('teacherAdmissionId', teacherAdmissionId);
        } catch (error) {
          console.error('Error fetching teacher profile:', error);
          throw new Error('Could not retrieve teacher information. Please try again or contact support.');
        }
      }

      // Prepare the homework data according to the backend schema
      const homeworkData = {
        admissionId: teacherAdmissionId, // Required by the backend schema
        className: formData.className,
        section: formData.section,
        subject: formData.subject,
        homeworkDetails: formData.homeworkDetails,
        dueDate: formData.dueDate,
        assignedBy: teacherId,
        // Remove fields not in the schema to avoid validation errors
        // assignedDate is automatically added by the timestamps option
      };
      
      
      const response = await fetch('https://school-erp-1-exji.onrender.com/api/homework/for/students/create/homework', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(homeworkData)
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        const textResponse = await response.text();
        console.error('Raw response text:', textResponse);
        throw new Error('Invalid response from server');
      }
      
      if (!response.ok) {
        console.error('Server responded with error status:', response.status);
        console.error('Error response data:', responseData);
        throw new Error(responseData.message || `Server error: ${response.status}`);
      }
      
      // Reset form on success
      setFormData({
        className: formData.className, // Keep class selected
        section: formData.section,     // Keep section selected
        subject: '',
        homeworkDetails: '',
        dueDate: ''
      });
      
      toast.success('Homework assigned successfully!');
    } catch (err) {
      console.error('Error assigning homework:', err);
      toast.error(`Failed to assign homework: ${err.message || 'Please try again'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your teaching assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherNavbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-6">
            <BookOpen className="h-8 w-8 text-green-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">Assign Homework</h1>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Class Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Class</option>
                  {availableClasses.map((cls, index) => (
                    <option key={index} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Section Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Section <span className="text-red-500">*</span>
                </label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  disabled={!formData.className}
                  required
                >
                  <option value="">Select Section</option>
                  {availableSections.map((section, index) => (
                    <option key={index} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Subject Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  disabled={!formData.section}
                  required
                >
                  <option value="">Select Subject</option>
                  {availableSubjects.map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Due Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Homework Details */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Homework Details <span className="text-red-500">*</span>
              </label>
              <textarea
                name="homeworkDetails"
                value={formData.homeworkDetails}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Enter homework details here..."
                required
              />
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Assigning...
                  </>
                ) : (
                  <>
                    <CheckCircle className="-ml-1 mr-2 h-5 w-5" />
                    Assign Homework
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Info className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Assignment Guidelines</h2>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
            <li>Select the appropriate class, section, and subject from the dropdown menus above.</li>
            <li>Enter detailed homework instructions in the provided text area.</li>
            <li>Set a due date for the homework assignment.</li>
            <li>You can only assign homework to classes and subjects you are assigned to teach.</li>
            <li>Students will be notified of new homework assignments automatically.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomeWork;