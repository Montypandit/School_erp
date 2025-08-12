import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Users, CheckCircle, XCircle, Edit, Search, Filter, Eye, Phone, Mail, Calendar, MapPin, User, UserCheck, AlertCircle } from 'lucide-react';
import PrincipalNavbar from './PrincipalNavbar';
import { useNavigate } from 'react-router-dom';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);
    const [updateFormData, setUpdateFormData] = useState({
        status: '',
        leaveDate: '',
        leaveType: '',
        leaveReason: '',
        remarks: ''
    });

    const navigate = useNavigate();

    const fetchStudentStatuses = async () => {
        setLoading(true);
        setError(null);
        try {
            const startData = sessionStorage.getItem('principalToken');
            const token = startData ? JSON.parse(startData).token : null; // Parse token from session storage

            if (!token) {
                toast.info('Please login to continue')
                navigate('/');
                return;
            }

            const response = await fetch('https://school-erp-11-mr7k.onrender.com/api/student/status/get/all/student/status', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch student statuses.');
            }

            const data = await response.json();
            setStudents(data.data || []);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentDetails = async (admissionId) => {
        try {
            const startData = sessionStorage.getItem('principalToken');
            const token = startData ? JSON.parse(startData).token : null;
            if (!token) {
                toast.info('Please login to continue')
                navigate('/');
                return;
            }

            const response = await fetch(`https://school-erp-11-mr7k.onrender.com/api/final/admission/get/student/${admissionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch student details.');
            }

            const data = await response.json();
            return data.data;
        } catch (err) {
            toast.error(err.message);
            return null;
        }
    };

    useEffect(() => {
        fetchStudentStatuses();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const openUpdateModal = (student) => {
        setSelectedStudent(student);
        setUpdateFormData({
            status: student.status || '',
            leaveDate: student.leaveDate || '',
            leaveType: student.leaveType || '',
            leaveReason: student.leaveReason || '',
            remarks: student.remarks || ''
        });
        setShowUpdateModal(true);
    };

    const closeUpdateModal = () => {
        setShowUpdateModal(false);
        setSelectedStudent(null);
        setUpdateFormData({
            status: '',
            leaveDate: '',
            leaveType: '',
            leaveReason: '',
            remarks: ''
        });
    };

    const openDetailsModal = async (student) => {
        const details = await fetchStudentDetails(student.admissionId);
        if (details) {
            setSelectedStudentDetails(details);
            setShowDetailsModal(true);
        }
    };

    const closeDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedStudentDetails(null);
    };

    const handleUpdateChange = (e) => {
        setUpdateFormData({
            ...updateFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const startData = sessionStorage.getItem('principalToken');
            const token = startData ? JSON.parse(startData).token : null; // Parse token from session storage
            if (!token) {
                toast.info('Please login to continue')
                navigate('/');
                return;
            }

            const response = await fetch(`https://school-erp-11-mr7k.onrender.com/api/student/status/student/update/status/${selectedStudent.admissionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updateFormData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update status.');
            }

            toast.success('Student status updated successfully!');
            closeUpdateModal();
            fetchStudentStatuses();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesStatus = filterStatus === 'All' || student.status === filterStatus;
        const lowerSearchTerm = searchTerm.toLowerCase();
        const matchesSearch =
            student.admissionId?.toLowerCase().includes(lowerSearchTerm) ||
            student.studentName?.toLowerCase().includes(lowerSearchTerm);
        return matchesStatus && matchesSearch; 
    });

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading students...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <div className="flex items-center mb-2">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <h3 className="text-lg font-medium text-red-800">Error</h3>
                    </div>
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={fetchStudentStatuses}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const openPromotionModal = (student) =>{
        navigate(`/student/promotion/page/${student.admissionId}`)
    }

    return (
        <div>
        <PrincipalNavbar/>
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center">
                                <Users className="h-8 w-8 text-blue-600 mr-3" />
                                <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 px-3 py-1 rounded-full">
                                    <span className="text-sm font-medium text-blue-800">
                                        Total: {filteredStudents.length}
                                    </span>
                                </div>
                                <div className="bg-green-100 px-3 py-1 rounded-full">
                                    <span className="text-sm font-medium text-green-800">
                                        Active: {filteredStudents.filter(s => s.status === 'Active').length}
                                    </span>
                                </div>
                                <div className="bg-red-100 px-3 py-1 rounded-full">
                                    <span className="text-sm font-medium text-red-800">
                                        Inactive: {filteredStudents.filter(s => s.status === 'Inactive').length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name or admission ID..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Filter className="h-4 w-4 text-gray-400" />
                                    <select
                                        value={filterStatus}
                                        onChange={handleFilterChange}
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Student Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Class
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Admission ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Leave Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Leave Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Remarks
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                                <p>No students found matching your criteria.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredStudents.map((student) => (
                                            <tr key={student._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {student.studentName || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {student.studentClass || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {student.admissionId}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'Active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {student.status === 'Active' ? (
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                        ) : (
                                                            <XCircle className="w-3 h-3 mr-1" />
                                                        )}
                                                        {student.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(student.leaveDate)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {student.leaveType || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {student.remarks || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => openDetailsModal(student)}
                                                            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                                                        >
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => openUpdateModal(student)}
                                                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors flex items-center"
                                                        >
                                                            <Edit className="w-4 h-4 mr-1" />
                                                            Update
                                                        </button>
                                                        <button 
                                                        onClick={() => openPromotionModal(student)}
                                                        className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors flex items-center"
                                                        >
                                                            Promotion
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
                </div>

                {/* Student Details Modal */}
                {showDetailsModal && selectedStudentDetails && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto m-4 w-full">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-semibold text-gray-900">Student Details</h2>
                                    <button
                                        onClick={closeDetailsModal}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Personal Information */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                                            <User className="w-5 h-5 mr-2 text-blue-600" />
                                            Personal Information
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Name:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Gender:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.gender}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Class:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.class}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">DOB:</span>
                                                <span className="text-sm font-medium">{formatDate(selectedStudentDetails.dob)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Admission ID:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.admissionId}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Father's Information */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                                            <UserCheck className="w-5 h-5 mr-2 text-green-600" />
                                            Father's Information
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Name:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.fatherName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Qualification:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.fatherQualification || '-'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Occupation:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.fatherOccupation || '-'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Mobile:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.fatherMobile || '-'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mother's Information */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                                            <UserCheck className="w-5 h-5 mr-2 text-pink-600" />
                                            Mother's Information
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Name:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.motherName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Qualification:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.motherQualification || '-'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Occupation:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.motherOccupation || '-'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Mobile:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.motherMobile || '-'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                                            <Phone className="w-5 h-5 mr-2 text-purple-600" />
                                            Contact Information
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Email:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.email || '-'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Landline:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.landLineNo || '-'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Address:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.residentialAddress || '-'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Transport:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.transportFacility}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Emergency & Medical Information */}
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-red-50 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-red-900 mb-3 flex items-center">
                                            <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                                            Emergency Contact
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Name:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.emergencyContactName || '-'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Phone:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.emergencyContactPhoneNo || '-'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-blue-900 mb-3 flex items-center">
                                            <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
                                            Medical Information
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Doctor:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.doctorName || '-'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Doctor Phone:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.doctorPhoneNo || '-'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Condition:</span>
                                                <span className="text-sm font-medium">{selectedStudentDetails.medicalCondition || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Update Status Modal */}

                {showUpdateModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
        <form
            onSubmit={handleUpdateSubmit}
            className="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
        >
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Update Student Status</h2>
                    <button
                        type="button"
                        onClick={closeUpdateModal}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-4">
                {/* Status Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        name="status"
                        value={updateFormData.status}
                        onChange={handleUpdateChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                {/* Leave Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leave Date</label>
                    <input
                        type="date"
                        name="leaveDate"
                        value={updateFormData.leaveDate}
                        onChange={handleUpdateChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Leave Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                    <select
                        name="leaveType"
                        value={updateFormData.leaveType}
                        onChange={handleUpdateChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select Leave Type</option>
                        <option value="Temporary">Temporary</option>
                        <option value="Permanent">Permanent</option>
                        <option value="Transfer">Transfer</option>
                    </select>
                </div>

                {/* Leave Reason */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leave Reason</label>
                    <textarea
                        name="leaveReason"
                        value={updateFormData.leaveReason}
                        onChange={handleUpdateChange}
                        rows={3}
                        placeholder="Enter leave reason..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Remarks */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                    <textarea
                        name="remarks"
                        value={updateFormData.remarks}
                        onChange={handleUpdateChange}
                        rows={3}
                        placeholder="Enter remarks..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
                <button
                    type="button"
                    onClick={closeUpdateModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                >
                    Update Status
                </button>
            </div>
        </form>
    </div>
)}

            </div>
        </div>
  );
};

export default StudentManagement;