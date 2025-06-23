import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CoordinatorNavbar from '../component/coordinator/CoordinatorNavbar';
import { toast } from 'react-toastify';

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllStudentFees = async () => {
      const token = sessionStorage.getItem('coordinatorToken');
      if (!token) {
        toast.info('Please login to continue');
        navigate('/coordinator/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/final/admission/get/all/admissions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          toast.error('Error in fetching data');
          return;
        }

        const data = await res.json();
        setStudents(data.data);
      } catch (error) {
        console.log(error);
        toast.error('Error in fetching data');
      }
    };

    fetchAllStudentFees();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(query.toLowerCase()) ||
    student.admissionId.includes(query)
  );

  return (
    <div>
      <CoordinatorNavbar />
      <div style={{ padding: '20px' }}>
        <TextField
          label="Search by name or admission ID"
          variant="outlined"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginBottom: '20px' }}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Admission ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Gender</strong></TableCell>
                <TableCell><strong>DOB</strong></TableCell>
                <TableCell><strong>Father's Name</strong></TableCell>
                <TableCell><strong>Class</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.admissionId}>
                  <TableCell>{student.admissionId}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{new Date(student.dob).toISOString().split('T')[0]}</TableCell>
                  <TableCell>{student.fatherName}</TableCell>
                  <TableCell>{student.class} </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/coordinator/fees/generate/${student.admissionId}`)}
                    >
                      Update Fees
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No matching students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default StudentListPage;
