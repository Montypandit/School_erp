import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const StudentAllotment = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all student allocations
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const startData = sessionStorage.getItem('coordinatorToken');
      const token = startData ? JSON.parse(startData).token : null;
      const res = await fetch('https://school-erp-1-exji.onrender.com/api/coordinator/get/all/students/allocations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setStudents(data.data || []);
    } catch (err) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handler for allocating books (dummy, replace with your logic/API)
  const handleAllocateBooks = async (student) => {
    // Example: open a modal or call an API
    toast.info(`Allocate books for ${student.admissionId}`);
    // TODO: Implement actual allocation logic/API call
  };

  // Handler for allocating uniform (dummy, replace with your logic/API)
  const handleAllocateUniform = async (student) => {
    // Example: open a modal or call an API
    toast.info(`Allocate uniform for ${student.admissionId}`);
    // TODO: Implement actual allocation logic/API call
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #eee', padding: '2rem' }}>
      <h2>Student Section Allotment</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: 10, border: '1px solid #eee' }}>Admission ID</th>
              <th style={{ padding: 10, border: '1px solid #eee' }}>Section</th>
              <th style={{ padding: 10, border: '1px solid #eee' }}>Academic Year</th>
              <th style={{ padding: 10, border: '1px solid #eee' }}>Alloted</th>
              <th style={{ padding: 10, border: '1px solid #eee' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>No students found.</td>
              </tr>
            )}
            {students.map(student => (
              <tr key={student._id}>
                <td style={{ padding: 10, border: '1px solid #eee' }}>{student.admissionId}</td>
                <td style={{ padding: 10, border: '1px solid #eee' }}>{student.section}</td>
                <td style={{ padding: 10, border: '1px solid #eee' }}>{student.academicYear}</td>
                <td style={{ padding: 10, border: '1px solid #eee' }}>{student.alloted ? 'Yes' : 'No'}</td>
                <td style={{ padding: 10, border: '1px solid #eee' }}>
                  <button
                    style={{ marginRight: 8, background: '#4a90e2', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer' }}
                    onClick={() => handleAllocateBooks(student)}
                  >
                    Allocate Books
                  </button>
                  <button
                    style={{ background: '#43a047', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer' }}
                    onClick={() => handleAllocateUniform(student)}
                  >
                    Allocate Uniform
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentAllotment;