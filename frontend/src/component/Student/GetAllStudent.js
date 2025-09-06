import React, { useState, useEffect } from "react";
import { Search, Eye, Edit, User, Mail, Phone, Calendar, MapPin, Building, X, Users, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../admin/AdminNavbar";

// API service functions
const apiService = {

  async fetchStudents() {

    const startData = sessionStorage.getItem('adminToken');
    const token = startData ? JSON.parse(startData).token : null; // Parse token from session storage
    if (!token) {
      toast.info('Please login to continue');
      window.location.href = '/'
      return;
    }
    try {
      const response = await fetch(`https://school-erp-1-exji.onrender.com/api/final/admission/get/all/admissions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to fetch students:', error);
      throw error;
    }
  },

  async deleteStudent(admissionId) {
    try {

      const startData = sessionStorage.getItem('adminToken');
      const token = startData ? JSON.parse(startData).token : null; // Parse token from session storage
      if (!token) {
        toast.info('Please login to continue');
        window.location.href = '/'
        return;
      }
      const response = await fetch(`https://school-erp-1-exji.onrender.com/api/final/students/delete/student/${admissionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to delete student:', error);
      throw error;
    }
  }
};

function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Map API data to display format
function mapApiDataToDisplayFormat(apiData) {
  return {
    id: apiData._id,
    applicationId: apiData.applicationId,
    admissionId: apiData.admissionId,
    inquiryId: apiData.inquiryId,
    rollNo: apiData.rollNo,
    name: apiData.name,
    gender: apiData.gender,
    class: apiData.class,
    dateOfBirth: apiData.dob,
    email: apiData.email,
    fatherName: apiData.fatherName,
    fatherQualification: apiData.fatherQualification,
    fatherOccupation: apiData.fatherOccupation,
    fatherMobile: apiData.fatherMobile,
    motherName: apiData.motherName,
    motherQualification: apiData.motherQualification,
    motherOccupation: apiData.motherOccupation,
    motherMobile: apiData.motherMobile,
    landLineNo: apiData.landLineNo,
    residentialAddress: apiData.residentialAddress,
    transportFacility: apiData.transportFacility,
    emergencyContactName: apiData.emergencyContactName,
    emergencyContactPhoneNo: apiData.emergencyContactPhoneNo,
    doctorName: apiData.doctorName,
    doctorPhoneNo: apiData.doctorPhoneNo,
    medicalCondition: apiData.medicalCondition,
    childImageUrl: apiData.childImageUrl,
    fatherImageUrl: apiData.fatherImageUrl,
    motherImageUrl: apiData.motherImageUrl,
    copyOfBirthCertificate: apiData.copyOfBirthCertificate,
    copyOfIdProof: apiData.copyOfIdProof,
    photosOfStudent: apiData.photosOfStudent,
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
  };
}

const ProfessionalStudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const navigate = useNavigate()

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiData = await apiService.fetchStudents();
      const formattedData = apiData.map(mapApiDataToDisplayFormat);
      setStudents(formattedData);
    } catch (err) {
      setError(err.message || "Failed to fetch students");
      console.error("Failed to fetch students:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      student.name?.toLowerCase().includes(query) ||
      student.applicationId?.toLowerCase().includes(query) ||
      student.admissionId?.toLowerCase().includes(query) ||
      student.rollNo?.toLowerCase().includes(query) ||
      student.class?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query) ||
      student.fatherName?.toLowerCase().includes(query) ||
      student.motherName?.toLowerCase().includes(query)
    );
  });

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };


  const activeStudents = students.filter(s => s.rollNo); // Students with roll numbers are considered active
  const inactiveStudents = students.filter(s => !s.rollNo); // Students without roll numbers are considered inactive

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading students...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Students</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchStudents}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
    <AdminNavbar/>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Management</h1>
                <p className="text-gray-600">Manage and view all student admission information</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>

          {/* Search and Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, ID, roll no, class, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>Total: {students.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Enrolled: {activeStudents.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Pending: {inactiveStudents.length}</span>
                </div>
              </div>
            </div>

            {searchQuery && (
              <p className="mt-4 text-sm text-gray-600">
                Found {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""} matching "{searchQuery}"
              </p>
            )}
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class & Roll No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parents
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                            {student.childImageUrl ? (
                              <img
                                src={student.childImageUrl}
                                alt={student.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-blue-600 font-medium">
                                {student.name?.[0] || "?"}
                              </span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              App ID: {student.applicationId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.email || "N/A"}</div>
                        <div className="text-sm text-gray-500">{student.fatherMobile || student.motherMobile || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.class || "N/A"}</div>
                        <div className="text-sm text-gray-500">
                          {student.rollNo ? `Roll: ${student.rollNo}` : "No Roll No"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.fatherName || "N/A"}</div>
                        <div className="text-sm text-gray-500">{student.motherName || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${student.rollNo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                          }`}>
                          {student.rollNo ? 'Enrolled' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(student)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/coordinator/update/student/${student.admissionId}`)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery ? "Try adjusting your search criteria." : "No students have been added yet."}
                </p>
              </div>
            )}
          </div>

          {/* Modal */}
          {isModalOpen && selectedStudent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                        {selectedStudent.childImageUrl ? (
                          <img
                            src={selectedStudent.childImageUrl}
                            alt={selectedStudent.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-blue-600 font-bold text-xl">
                            {selectedStudent.name?.[0] || "?"}
                          </span>
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {selectedStudent.name || "N/A"}
                        </h2>
                        <p className="text-gray-600">Application ID: {selectedStudent.applicationId}</p>
                        {selectedStudent.rollNo && (
                          <p className="text-gray-600">Roll Number: {selectedStudent.rollNo}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Student Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User size={20} />
                        Student Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Name</label>
                          <span className="text-gray-900 mt-1 block">{selectedStudent.name || "N/A"}</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Gender</label>
                          <span className="text-gray-900 mt-1 block">{selectedStudent.gender || "N/A"}</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar size={16} className="text-gray-400" />
                            <span className="text-gray-900">{formatDate(selectedStudent.dateOfBirth)}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Class</label>
                          <span className="text-gray-900 mt-1 block">{selectedStudent.class || "N/A"}</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Email</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail size={16} className="text-gray-400" />
                            <span className="text-gray-900">{selectedStudent.email || "N/A"}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Address</label>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin size={16} className="text-gray-400" />
                            <span className="text-gray-900">{selectedStudent.residentialAddress || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Father Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User size={20} />
                        Father Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Name</label>
                          <span className="text-gray-900 mt-1 block">{selectedStudent.fatherName || "N/A"}</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Qualification</label>
                          <span className="text-gray-900 mt-1 block">{selectedStudent.fatherQualification || "N/A"}</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Occupation</label>
                          <span className="text-gray-900 mt-1 block">{selectedStudent.fatherOccupation || "N/A"}</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Mobile</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone size={16} className="text-gray-400" />
                            <span className="text-gray-900">{selectedStudent.fatherMobile || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mother Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User size={20} />
                        Mother Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Name</label>
                          <span className="text-gray-900 mt-1 block">{selectedStudent.motherName || "N/A"}</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Qualification</label>
                          <span className="text-gray-900 mt-1 block">{selectedStudent.motherQualification || "N/A"}</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Occupation</label>
                          <span className="text-gray-900 mt-1 block">{selectedStudent.motherOccupation || "N/A"}</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Mobile</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone size={16} className="text-gray-400" />
                            <span className="text-gray-900">{selectedStudent.motherMobile || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Landline</label>
                          <span className="text-gray-900 mt-1 block">{selectedStudent.landLineNo || "N/A"}</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Transport Facility</label>
                          <span className="text-gray-900 mt-1 block">{selectedStudent.transportFacility || "N/A"}</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Emergency Contact</label>
                          <span className="text-gray-900 mt-1 block">{selectedStudent.emergencyContactName || "N/A"}</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Emergency Phone</label>
                          <span className="text-gray-900 mt-1 block">{selectedStudent.emergencyContactPhoneNo || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Doctor Name</label>
                          <span className="text-gray-900 mt-1 block">{selectedStudent.doctorName || "N/A"}</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Doctor Phone</label>
                          <span className="text-gray-900 mt-1 block">{selectedStudent.doctorPhoneNo || "N/A"}</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Medical Condition</label>
                          <span className="text-gray-900 mt-1 block">{selectedStudent.medicalCondition || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Document Status */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${selectedStudent.copyOfBirthCertificate ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm text-gray-700">Birth Certificate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${selectedStudent.copyOfIdProof ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm text-gray-700">ID Proof</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${selectedStudent.photosOfStudent ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm text-gray-700">Student Photos</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => navigate(`/coordinator/update/student/${selectedStudent.admissionId}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Edit size={16} />
                    Update Student
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalStudentList;