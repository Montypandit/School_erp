import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PrincipalNavbar from './PrincipalNavbar'; // Assuming you have a PrincipalNavbar

const PrincipalHome = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmissionsForApproval = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem('principalToken'); // Assuming principal token
        if (!token) {
          toast.info('Please login to continue');
          navigate('/principal/login'); // Redirect to principal login
          return;
        }

        // Fetch all admission approval statuses
        const response = await fetch('http://localhost:5000/api/admissions/get/all/admission/approval/status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to parse error' }));
          throw new Error(errorData.message || 'Failed to fetch admissions for approval');
        }

        const data = await response.json();
        // Filter for admissions that are 'Pending' or 'Forwarded' for principal review
        const pendingAdmissions = data.data.filter(
          (adm) => adm.admissionApproved === 'Pending' || adm.admissionApproved === 'Forwarded'
        );
        setAdmissions(pendingAdmissions);
      } catch (err) {
        console.error('Error fetching admissions:', err);
        setError(err.message || 'Failed to load admissions.');
        toast.error(err.message || 'Failed to load admissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissionsForApproval();
  }, [navigate]);

  const handleViewDetails = (inquiryId) => {
    navigate(`/principal/admission/detail/${inquiryId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading admissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <PrincipalNavbar />
      <div className="container mx-auto p-6 mt-16"> {/* Added mt-16 for navbar spacing */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admission Approvals</h1>

        {admissions.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
            No pending admissions for approval.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admission ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inquiry ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admissions.map((admission) => (
                  <tr key={admission._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {admission.admissionId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admission.inquiryId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        admission.admissionApproved === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        admission.admissionApproved === 'Forwarded' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {admission.admissionApproved}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(admission.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(admission.inquiryId)}
                        className="text-indigo-600 hover:text-indigo-900 hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrincipalHome;
