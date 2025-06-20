import React, { useEffect, useState } from 'react';

const InquiryApproval = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdate, setStatusUpdate] = useState({});

  useEffect(() => {
    fetch('https://your-backend-url/api/inquiries') // replace with your real API
      .then((res) => res.json())
      .then((data) => {
        setInquiries(data); // assumed data is an array
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching inquiries:', error);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = (inquiryId, value) => {
    setStatusUpdate((prev) => ({
      ...prev,
      [inquiryId]: value,
    }));
  };

  const handleUpdateStatus = async (inquiryId) => {
    try {
      const res = await fetch('https://your-backend-url/update/admission/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inquiryId,
          admissionId,
          status: statusUpdate[inquiryId] || 'Pending',
        }),
      });

      const result = await res.json();
      alert(result.message);
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update status');
    }
  };

  if (loading) return <p>Loading inquiries...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Student Inquiry Approvals</h2>
      {inquiries.map((item) => (
        <div key={item.inquiryId} className="border p-4 mb-4 rounded shadow-md">
          <p><strong>Name:</strong> {item.name}</p>
          <p><strong>Current Class:</strong> {item.currentClass}</p>
          <p><strong>DOB:</strong> {new Date(item.dob).toLocaleDateString()}</p>
          <p><strong>Gender:</strong> {item.gender}</p>
          <p><strong>Father Name:</strong> {item.fatherName}</p>
          <p><strong>Mother Name:</strong> {item.motherName}</p>
          <p><strong>Status:</strong> {item.admissionApproved || 'Pending'}</p>

          <div className="mt-2">
            <select
              value={statusUpdate[item.inquiryId] || 'Pending'}
              onChange={(e) => handleStatusChange(item.inquiryId, e.target.value)}
              className="border p-1 mr-2"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button
              onClick={() => handleUpdateStatus(item.inquiryId, item.admissionId)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Update
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InquiryApproval;
