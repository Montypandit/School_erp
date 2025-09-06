import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, User, Mail, Phone, MapPin, GraduationCap, Info, Calendar, ClipboardList, CheckCircle2, Loader2 } from 'lucide-react';
import PrincipalNavbar from './PrincipalNavbar';

const PrincipalAdmissionDetail = () => {
  const { inquiryId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [admissionRecord, setAdmissionRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const startData = sessionStorage.getItem('principalToken');
        const token = startData ? JSON.parse(startData).token : null; // Parse token from session storage
        if (!token) {
          toast.info('Please login to continue');
          navigate('/principal/login');
          return;
        }

        // 1. Fetch student inquiry details
        const inquiryRes = await fetch(`https://school-erp-1-exji.onrender.comapi/inquiry/get/inquiry/${inquiryId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!inquiryRes.ok) throw new Error('Failed to fetch inquiry details.');
        const inquiryData = await inquiryRes.json();
        setStudent(inquiryData);

        // 2. Fetch all admission records and find the one matching inquiryId
        const admissionsRes = await fetch('https://school-erp-1-exji.onrender.comapi/admissions/get/all/admission/approval/status', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!admissionsRes.ok) throw new Error('Failed to fetch admission records.');
        const admissionsData = await admissionsRes.json();
        const foundAdmission = admissionsData.data.find(adm => adm.inquiryId === inquiryId);
        if (!foundAdmission) throw new Error('Admission record not found for this inquiry.');
        setAdmissionRecord(foundAdmission);
        setSelectedStatus(foundAdmission.admissionApproved);

      } catch (err) {
        console.error('Error fetching details:', err);
        setError(err.message || 'Failed to load details.');
        toast.error(err.message || 'Failed to load details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [inquiryId, navigate]);

  const handleUpdateStatus = async () => {
    if (!admissionRecord || !selectedStatus) {
      toast.error('Please select a status.');
      return;
    }

    setIsUpdating(true);
    try {
      const startData = sessionStorage.getItem('principalToken');
      const token = startData ? JSON.parse(startData).token : null;
      if(!token){
        toast.info('Please login to continue');
        navigate('/principal/login');
        return;
      }
      const response = await fetch('https://school-erp-1-exji.onrender.comapi/admissions/update/admission/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          inquiryId: admissionRecord.inquiryId,
          admissionApproved: selectedStatus,
        }),
      });
      console.log(admissionRecord.inquiryId);
      console.log()

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || 'Failed to update admission status');
      }

      toast.success('Admission status updated successfully!');
      navigate('/principal/home'); // Go back to the principal home page
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(err.message || 'Failed to update status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="text-blue-600 mt-0.5 flex-shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
        <div className="text-sm text-gray-900 font-medium">{value || "Not provided"}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-gray-600 ml-4">Loading student details...</p>
      </div>
    );
  }

  if (error || !student || !admissionRecord) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <p className="text-red-600 text-center">{error || 'Student or admission record not found.'}</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <PrincipalNavbar />
      <div className="container mx-auto px-4 py-8 pt-20 max-w-7xl"> {/* Added pt-20 for navbar spacing */}
        <div className="relative mb-8">
          <div className="absolute left-0 top-0">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admission Review</h1>
            <p className="text-lg text-gray-600">Review and approve or reject student admission</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Information */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <div className="p-6 pb-4 border-b border-gray-100">
                <h2 className="flex items-center text-xl font-semibold text-gray-900">
                  <User className="h-5 w-5 mr-3 text-blue-600" />
                  Student Information
                </h2>
              </div>
              <div className="p-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <InfoItem icon={<User className="h-4 w-4" />} label="Student Name" value={student.name} />
                    <InfoItem icon={<User className="h-4 w-4" />} label="Parent/Guardian" value={student.fatherName} />
                    <InfoItem icon={<GraduationCap className="h-4 w-4" />} label="Class Applied" value={student.currentClass} />
                    <InfoItem icon={<Info className="h-4 w-4" />} label="DOB" value={new Date(student.dob).toLocaleDateString()} />
                  </div>
                  <div className="space-y-1">
                    <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={student.fatherEmail} />
                    <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone" value={student.fatherPhoneNo} />
                    <InfoItem icon={<MapPin className="h-4 w-4" />} label="Gender" value={student.gender} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admission Approval */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300 h-fit">
              <div className="p-6 pb-4 border-b border-gray-100">
                <h2 className="flex items-center text-xl font-semibold text-gray-900">
                  <ClipboardList className="h-5 w-5 mr-3 text-blue-600" />
                  Admission Decision
                </h2>
              </div>
              <div className="p-6 pt-4 space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">Current Status</label>
                  <p className="text-lg font-medium text-gray-700">{admissionRecord.admissionApproved}</p>
                </div>
                <div className="space-y-3">
                  <label htmlFor="status-select" className="block text-sm font-semibold text-gray-900">Update Status</label>
                  <select
                    id="status-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isUpdating}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating || selectedStatus === admissionRecord.admissionApproved}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Confirm Decision
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalAdmissionDetail;