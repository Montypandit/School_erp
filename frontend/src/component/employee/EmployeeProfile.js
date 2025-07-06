import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  User, Mail, Phone, Calendar, MapPin, GraduationCap, BookOpen, Hash, Building, Award, Clock
} from 'lucide-react';
import AdminNavbar from '../../admin/AdminNavbar';
import CoordinatorNavbar from '../coordinator/CoordinatorNavbar';
import PrincipalNavbar from '../principal/PrincipalNavbar';
import TeacherNavbar from '../teacher/TeacherNavbar';


const getToken = () => {
  return (
    sessionStorage.getItem('adminToken') ||
    sessionStorage.getItem('coordinatorToken') ||
    sessionStorage.getItem('teacherToken') ||
    sessionStorage.getItem('principalToken')
  );
};

const EmployeeProfile = () => {
  const email = sessionStorage.getItem('email')
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = getToken();
        if (!token) {
          toast.info('Please login to continue');
          navigate('/');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/employees/get/employee/email/${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

          }
        });

        const roleResponse = await fetch(`http://localhost:5000/api/auth/get/user/role?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!roleResponse.ok) {
          throw new Error('Failed to fetch user role');
        }

        const roleData = await roleResponse.json();
        setUserRole(roleData.role);

        if (!response.ok) {
          throw new Error('Failed to fetch employee data');
        }

        const data = await response.json();
        setEmployee(data);
        setFormData(data);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load employee profile');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [email, navigate]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setFormData(employee);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      if (!token) {
        toast.info('Please login to continue');
        navigate('/');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/employee/update/employee/${employee.empId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update employee');
      }

      const data = await response.json();
      setEmployee(data);
      setEditing(false);
      toast.success('Employee profile updated successfully');
    } catch (err) {
      console.log(err);
      setError(err.message);
      toast.error('Failed to update employee profile');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div>
      {userRole === 'admin' && <AdminNavbar />}
      {userRole === 'coordinator' && <CoordinatorNavbar />}
      {userRole === 'teacher' && <TeacherNavbar />}
      {userRole === 'principal' && <PrincipalNavbar />}

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Employee Profile</h1>
            <div>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                disabled={editing}
              >
                Edit Profile
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Back
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              {employee.imageUrl && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={employee.imageUrl}
                    alt={`${employee.firstName} ${employee.lastName}`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                  />
                </div>
              )}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <span>Name:</span>
                  <span>{employee.firstName} {employee.lastName}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span>Email:</span>
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span>Phone:</span>
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span>DOB:</span>
                  <span>{employee.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Hash className="w-5 h-5 text-gray-500" />
                  <span>Employee ID:</span>
                  <span>{employee.empId}</span>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  <span>Role:</span>
                  <span>{employee.role}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span>DOJ:</span>
                  <span>{employee.doj ? new Date(employee.doj).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-gray-500" />
                  <span>Qualification:</span>
                  <span>{employee.qualification}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-500" />
                  <span>Salary:</span>
                  <span>₹{employee.salary?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Address Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span>Residential Address:</span>
                  <span>{employee.residentialAddress}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span>Permanent Address:</span>
                  <span>{employee.permanentAddress}</span>
                </div>
              </div>
            </div>

            {/* Edit Form (only shown when editing) */}
            {editing && (
              <div className="mt-6 md:col-span-2 lg:col-span-3">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="coordinator">Coordinator</option>
                      <option value="teacher">Teacher</option>
                      <option value="principal">Principal</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
