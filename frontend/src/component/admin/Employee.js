import React, { useState, useEffect } from 'react';
import { Eye, Edit, Search, User, Mail, Phone, X, Save, KeyIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import AdminNavbar from '../../admin/AdminNavbar';
import { useNavigate } from 'react-router-dom';

const AdminEmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            try {
                const token = sessionStorage.getItem('adminToken');
                if (!token) {
                    toast.info('Please login to continue');
                    navigate('/');
                    return;
                }

                // 1. Fetch all employees
                const employeeRes = await fetch('https://school-erp-11-mr7k.onrender.com/api/employees/get/all/employees', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!employeeRes.ok) {
                    throw new Error('Failed to fetch employees');
                }
                const employeeData = await employeeRes.json();

                // 2. Fetch account status for each employee and combine data
                const employeesWithStatus = await Promise.all(
                    employeeData.map(async (employee) => {
                        try {
                            const statusRes = await fetch(`https://school-erp-11-mr7k.onrender.com/api/auth/get/user/${employee.email}`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                }
                            });
                            if (statusRes.ok) {
                                const statusData = await statusRes.json();
                                return { ...employee, accountStatus: statusData.status };
                            }
                            return { ...employee, accountStatus: false }; // Default to inactive if status check fails
                        } catch (err) {
                            console.error(`Failed to fetch status for ${employee.email}`, err);
                            return { ...employee, accountStatus: false }; // Default to inactive on error
                        }
                    })
                );

                setEmployees(employeesWithStatus);

            } catch (error) {
                console.error('Error fetching employees:', error);
                toast.error(error.message || 'Failed to load employee data.');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [navigate]);

    const handleViewEmployee = (employee) => {
        setSelectedEmployee(employee);
        setIsViewModalOpen(true);
    };

    const handleUpdateEmployee = (employee) => {
        setSelectedEmployee(employee);
        setUpdateFormData({ ...employee });
        console.log("Selected Employee for Update:", employee); // Debugging
        setIsUpdateModalOpen(true);
    };



    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsUpdating(true);
            const token = sessionStorage.getItem('adminToken');
            const response = await fetch(`https://school-erp-11-mr7k.onrender.com/api/employees/update/employee/${selectedEmployee.empId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateFormData),
            });

            if (!response.ok) {
                toast.error('Failed to update employee. Please try again later');
                throw new Error('Failed to update employee');
            }

            if (response.ok) {
                toast.success('Employee updated successfully!');
            }
            setIsUpdateModalOpen(false);
            setUpdateFormData({});

        } catch (error) {
            console.error('Error updating employee:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredEmployees = employees.filter(employee =>
        employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.empId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const closeModals = () => {
        setIsViewModalOpen(false);
        setIsUpdateModalOpen(false);
        setSelectedEmployee(null);
        setUpdateFormData({});
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading employees...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <AdminNavbar />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
                                <p className="text-gray-600 mt-1">Manage and view all employee information</p>
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Search employees..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Employee Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Employee
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Join Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Account Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 ">
                                    {filteredEmployees.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                                <p className="text-lg font-medium">No employees found</p>
                                                <p className="text-sm">Try adjusting your search criteria</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredEmployees.map((employee) => (
                                            <tr key={employee._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            {employee.imageUrl ? (
                                                                <img
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                    src={employee.imageUrl}
                                                                    alt={`${employee.firstName} ${employee.lastName}`}
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                    <User className="h-5 w-5 text-gray-500" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {employee.firstName} {employee.lastName}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                ID: {employee.empId}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 flex items-center">
                                                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                                        {employee.email}
                                                    </div>
                                                    <div className="text-sm text-gray-500 flex items-center mt-1">
                                                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                                        {employee.phone}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                        {(employee.role).toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(employee.doj)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${employee.accountStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {employee.accountStatus ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            className="bg-yellow-100 text-red-700 hover:bg-yellow-200 p-2 rounded-lg transition-colors"
                                                            title='Employee Status'
                                                            onClick={() => navigate(`/admin/employee/status/${employee.email}`)}
                                                        >
                                                            <KeyIcon className='h-4 w-4' />
                                                        </button>
                                                        <button
                                                            onClick={() => handleViewEmployee(employee)}
                                                            className="bg-blue-100 text-blue-700 hover:bg-blue-200 p-2 rounded-lg transition-colors"
                                                            title="View Employee"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateEmployee(employee)}
                                                            className="bg-green-100 text-green-700 hover:bg-green-200 p-2 rounded-lg transition-colors"
                                                            title="Update Employee"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* View Modal */}
                    {isViewModalOpen && selectedEmployee && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Employee Details</h2>
                                        <button
                                            onClick={closeModals}
                                            className="text-gray-400 hover:text-gray-600 p-2"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                                                <p className="text-sm text-gray-900">{selectedEmployee.empId}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                                <p className="text-sm text-gray-900">{selectedEmployee.firstName}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                                <p className="text-sm text-gray-900">{selectedEmployee.lastName || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <p className="text-sm text-gray-900">{selectedEmployee.email}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                                <p className="text-sm text-gray-900">{selectedEmployee.phone}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                                <p className="text-sm text-gray-900">{selectedEmployee.gender || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                                <p className="text-sm text-gray-900">{formatDate(selectedEmployee.dob)}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
                                                <p className="text-sm text-gray-900">{formatDate(selectedEmployee.doj)}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                                <p className="text-sm text-gray-900">{(selectedEmployee.role).toUpperCase()}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                                                <p className="text-sm text-gray-900">{selectedEmployee.qualification || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
                                                <p className="text-sm text-gray-900">{selectedEmployee.residentialAddress || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
                                                <p className="text-sm text-gray-900">{selectedEmployee.permanentAddress || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar No</label>
                                                <p className="text-sm text-gray-900">{selectedEmployee.aadharNo || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">PAN No</label>
                                                <p className="text-sm text-gray-900">{selectedEmployee.panNo || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Passport No</label>
                                                <p className="text-sm text-gray-900">{selectedEmployee.passportNo || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                                                <p className="text-sm text-gray-900">{selectedEmployee.salary ? `₹${selectedEmployee.salary.toLocaleString()}` : 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Update Modal */}
                    {isUpdateModalOpen && selectedEmployee && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Update Employee</h2>
                                        <button
                                            onClick={closeModals}
                                            className="text-gray-400 hover:text-gray-600 p-2"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleUpdateSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={updateFormData.firstName || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={updateFormData.lastName || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                                <select
                                                    name="gender"
                                                    value={updateFormData.gender || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    value={updateFormData.dob ? new Date(updateFormData.dob).toISOString().split('T')[0] : ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
                                                <input
                                                    type="date"
                                                    name="doj"
                                                    value={updateFormData.doj ? new Date(updateFormData.doj).toISOString().split('T')[0] : ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                                <input
                                                    type="text"
                                                    name="role"
                                                    value={updateFormData.role || ''}
                                                    onChange={(e) => setUpdateFormData({ ...updateFormData, role: (e.target.value).toLowerCase() })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                                                <input
                                                    type="text"
                                                    name="qualification"
                                                    value={updateFormData.qualification || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
                                                <textarea
                                                    name="residentialAddress"
                                                    value={updateFormData.residentialAddress || ''}
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
                                                <textarea
                                                    name="permanentAddress"
                                                    value={updateFormData.permanentAddress || ''}
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar No</label>
                                                <input
                                                    type="text"
                                                    name="aadharNo"
                                                    value={updateFormData.aadharNo || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">PAN No</label>
                                                <input
                                                    type="text"
                                                    name="panNo"
                                                    value={updateFormData.panNo || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Passport No</label>
                                                <input
                                                    type="text"
                                                    name="passportNo"
                                                    value={updateFormData.passportNo || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                                                <input
                                                    type="number"
                                                    name="salary"
                                                    value={updateFormData.salary || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                                            <button
                                                type="button"
                                                onClick={closeModals}
                                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isUpdating}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                            >
                                                {isUpdating ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        <span>Updating...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-4 w-4" />
                                                        <span>Update Employee</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminEmployeeManagement;