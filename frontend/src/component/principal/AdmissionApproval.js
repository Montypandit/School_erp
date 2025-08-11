import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PrincipalNavbar from './PrincipalNavbar';

const badgeColor = (status) => {
  if (status === 'Approved') return 'bg-green-100 text-green-700 border-green-300';
  if (status === 'Rejected') return 'bg-red-100 text-red-700 border-red-300';
  if (status === 'Forwarded') return 'bg-blue-100 text-blue-700 border-blue-300';
  return 'bg-yellow-100 text-yellow-700 border-yellow-300';
};

const AdmissionApproval = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdate, setStatusUpdate] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmissionsForApproval = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem('principalToken');
        if (!token) {
          toast.info('Please login to continue');
          navigate('/');
          return;
        }

        const admissionRes = await fetch('https://school-erp-11-mr7k.onrender.com/api/admissions/get/all/admission/approval/status', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const inquiryRes = await fetch('https://school-erp-11-mr7k.onrender.com/api/inquiry/all/inquiries', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!admissionRes.ok || !inquiryRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const admissionData = await admissionRes.json();
        const inquiryData = await inquiryRes.json();

        const enrichedAdmissions = admissionData.data
          .map(admission => {
            const correspondingInquiry = inquiryData.data.find(inq => inq.inquiryId === admission.inquiryId);
            if (!correspondingInquiry) return null;
            return {
              ...admission,
              ...correspondingInquiry,
            };
          })
          .filter(Boolean);

        const pendingAdmissions = enrichedAdmissions.filter(
          adm => adm.admissionApproved === 'Pending' || adm.admissionApproved === 'Forwarded'
        );

        setAdmissions(pendingAdmissions);

        const initialStatus = {};
        pendingAdmissions.forEach(adm => {
          initialStatus[adm.inquiryId] = adm.admissionApproved;
        });
        setStatusUpdate(initialStatus);
      } catch (error) {
        console.error('Error fetching admissions:', error);
        toast.error(error.message || 'Failed to load admissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissionsForApproval();
  }, [navigate]);

  const handleStatusChange = (inquiryId, value) => {
    setStatusUpdate(prev => ({
      ...prev,
      [inquiryId]: value,
    }));
  };

  const handleUpdateStatus = async (inquiryId) => {
    try {
      const token = sessionStorage.getItem('principalToken');
      if (!token) {
        toast.error('Authentication error. Please log in again.');
        return;
      }

      const status = statusUpdate[inquiryId];
      if (!status) {
        toast.warn('Please select a status to update.');
        return;
      }

      const res = await fetch('https://school-erp-11-mr7k.onrender.com/api/admissions/update/admission/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          inquiryId,
          admissionApproved: status,
        }),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || 'Failed to update status');
      }

      const result = await res.json();
      toast.success(result.message);

      setAdmissions(prev => prev.filter(adm => adm.inquiryId !== inquiryId));
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-400 border-t-transparent opacity-20"></div>
        </div>
        <p className="mt-6 text-xl text-gray-700 font-medium">Loading inquiries...</p>
        <div className="mt-2 flex space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PrincipalNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pt-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-blue-900 mb-10 text-center drop-shadow-sm tracking-tight">
            Student Inquiry Approvals
          </h2>
          {admissions.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl shadow-xl text-center border border-blue-100">
              <p className="text-gray-500 text-lg font-medium">No pending inquiries for approval.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {admissions.map(item => (
                <div
                  key={item.inquiryId}
                  className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Student Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        Student Details
                      </h3>
                      <div className="space-y-1 text-gray-700">
                        <div><span className="font-semibold">Admission ID:</span> {item.admissionId}</div>
                        <div><span className="font-semibold">Inquiry ID:</span> {item.inquiryId}</div>
                        <div><span className="font-semibold">Name:</span> {item.name}</div>
                        <div><span className="font-semibold">Current Class:</span> {item.currentClass}</div>
                        <div><span className="font-semibold">DOB:</span> {item.dob ? new Date(item.dob).toLocaleDateString() : 'N/A'}</div>
                        <div><span className="font-semibold">Gender:</span> {item.gender}</div>
                      </div>
                    </div>
                    {/* Parent Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        Parent Details
                      </h3>
                      <div className="space-y-1 text-gray-700">
                        <div><span className="font-semibold">Father Name:</span> {item.fatherName}</div>
                        <div><span className="font-semibold">Father Qualification:</span> {item.fatherQualification || 'N/A'}</div>
                        <div><span className="font-semibold">Father Occupation:</span> {item.fatherOccupation || 'N/A'}</div>
                        <div><span className="font-semibold">Father Phone:</span> {item.fatherPhoneNo || 'N/A'}</div>
                        <div><span className="font-semibold">Father Email:</span> {item.fatherEmail || 'N/A'}</div>
                        <div><span className="font-semibold">Mother Name:</span> {item.motherName}</div>
                        <div><span className="font-semibold">Mother Qualification:</span> {item.motherQualification || 'N/A'}</div>
                        <div><span className="font-semibold">Mother Occupation:</span> {item.motherOccupation || 'N/A'}</div>
                        <div><span className="font-semibold">Mother Phone:</span> {item.motherPhoneNo || 'N/A'}</div>
                        <div><span className="font-semibold">Mother Email:</span> {item.motherEmail || 'N/A'}</div>
                      </div>
                    </div>
                    {/* Additional Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        Additional Information
                      </h3>
                      <div className="space-y-1 text-gray-700">
                        <div><span className="font-semibold">Residential Address:</span> {item.residentialAddress || 'N/A'}</div>
                        <div><span className="font-semibold">Visited Website:</span> {item.haveYouVisitedOurWebsite ? 'Yes' : 'No'}</div>
                        <div><span className="font-semibold">How They Heard About Us:</span> {item.howDoYouKnowAboutSUNVILLEKIDZ || 'N/A'}</div>
                        <div><span className="font-semibold">References:</span> {item.references || 'N/A'}</div>
                        <div><span className="font-semibold">Has Siblings:</span> {item.doYouHaveSiblings ? 'Yes' : 'No'}</div>
                        {item.siblings && item.siblings.length > 0 && (
                          <div>
                            <span className="font-semibold">Siblings:</span>
                            <ul className="list-disc pl-6 mt-1">
                              {item.siblings.map((sibling, index) => (
                                <li key={index}>
                                  {sibling.name} <span className="text-gray-500">(Age: {sibling.age || 'N/A'})</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div>
                          <span className="font-semibold">Status:</span>
                          <span className={`ml-2 px-3 py-1 rounded-full border text-sm font-semibold ${badgeColor(item.admissionApproved)}`}>
                            {item.admissionApproved}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Action */}
                  <div className="mt-8 flex flex-col md:flex-row md:items-center gap-4 justify-end">
                    <select
                      value={statusUpdate[item.inquiryId] || item.admissionApproved}
                      onChange={e => handleStatusChange(item.inquiryId, e.target.value)}
                      className="border border-gray-300 p-2 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 shadow-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <button
                      onClick={() => handleUpdateStatus(item.inquiryId)}
                      className={`px-6 py-2 rounded-md font-semibold transition-colors shadow-sm ${
                        statusUpdate[item.inquiryId] === item.admissionApproved
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                      }`}
                      disabled={statusUpdate[item.inquiryId] === item.admissionApproved}
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdmissionApproval;