import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PrincipalNavbar from './PrincipalNavbar';

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

        // Fetch all admission approval statuses
        const admissionRes = await fetch('http://localhost:5000/api/admissions/get/all/admission/approval/status', {
          method:'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // Fetch all inquiries to get student details
        const inquiryRes = await fetch('http://localhost:5000/api/inquiry/all/inquiries', {
          method:'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!admissionRes.ok || !inquiryRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const admissionData = await admissionRes.json();
        const inquiryData = await inquiryRes.json();

        // Combine admission and inquiry data
        const enrichedAdmissions = admissionData.data
          .map(admission => {
            const correspondingInquiry = inquiryData.data.find(inq => inq.inquiryId === admission.inquiryId);
            if (!correspondingInquiry) return null; // Skip if no matching inquiry

            return {
              ...admission, // contains admissionId, inquiryId, admissionApproved
              ...correspondingInquiry, // contains name, class, dob, etc.
            };
          })
          .filter(Boolean); // Remove nulls

        // Filter for pending approvals
        const pendingAdmissions = enrichedAdmissions.filter(
          (adm) => adm.admissionApproved === 'Pending' || adm.admissionApproved === 'Forwarded'
        );

        setAdmissions(pendingAdmissions);
        
        // Initialize status update state
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
    setStatusUpdate((prev) => ({
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

      const res = await fetch('http://localhost:5000/api/admissions/update/admission/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          inquiryId,
          admissionApproved: status,
        }),
      });

      console.log(inquiryId);
      console.log(status);

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || 'Failed to update status');
      }

      const result = await res.json();
      toast.success(result.message);

      // Remove the updated inquiry from the list
      setAdmissions(prev => prev.filter(adm => adm.inquiryId !== inquiryId));

    } catch (err) {
      console.error('Update error:', err);
      toast.error(err.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading inquiries...</p>
      </div>
    );
  }

  return (
    <>
      <PrincipalNavbar />
      <div className="p-6 mt-16">
        <h2 className="text-2xl font-bold mb-4">Student Inquiry Approvals</h2>
        {admissions.length === 0 ? (
          <p>No pending inquiries for approval.</p>
        ) : (
          admissions.map((item) => (
            <div key={item.inquiryId} className="border p-4 mb-4 rounded shadow-md bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Admission ID:</strong> {item.admissionId}</p>
                  <p><strong>Inquiry ID:</strong> {item.inquiryId}</p>
                  <p><strong>Name:</strong> {item.name}</p>
                  <p><strong>Current Class:</strong> {item.currentClass}</p>
                  <p><strong>DOB:</strong> {new Date(item.dob).toLocaleDateString()}</p>
                </div>
                <div>
                  <p><strong>Gender:</strong> {item.gender}</p>
                  <p><strong>Father Name:</strong> {item.fatherName}</p>
                  <p><strong>Mother Name:</strong> {item.motherName}</p>
                  <p><strong>Status:</strong> <span className="font-semibold">{item.admissionApproved}</span></p>
                </div>
              </div>

              <div className="mt-4 flex items-center">
                <select
                  value={statusUpdate[item.inquiryId] || item.admissionApproved}
                  onChange={(e) => handleStatusChange(item.inquiryId, e.target.value)}
                  className="border p-2 mr-2 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <button
                  onClick={() => handleUpdateStatus(item.inquiryId)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  disabled={statusUpdate[item.inquiryId] === item.admissionApproved}
                >
                  Update Status
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AdmissionApproval;
