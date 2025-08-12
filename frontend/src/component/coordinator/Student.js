import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CoordinatorNavbar from './CoordinatorNavbar';
import EditIcon from '@mui/icons-material/Edit';
import PaymentsIcon from '@mui/icons-material/Payments';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

const FinalAdmissionsList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFinalAdmissions = async () => {
      setLoading(true);
      try {
        const storedData = sessionStorage.getItem('coordinatorToken');
        const token = storedData ? JSON.parse(storedData).token : null;
        if (!token) {
          toast.info('Please login to continue');
          navigate('/coordinator/login');
          return;
        }

        // This endpoint fetches all finally admitted students.
        const res = await fetch('https://school-erp-11-mr7k.onrender.com/api/final/admission/get/all/admissions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch student data');
        }

        const data = await res.json();
        const studentData = data.data || [];
        setStudents(studentData);
        setFilteredStudents(studentData);
      } catch (error) {
        console.error('Error fetching final admissions:', error);
        toast.error(error.message || 'Error fetching student data.');
      } finally {
        setLoading(false);
      }
    };

    fetchFinalAdmissions();
  }, [navigate]);

  useEffect(() => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = students.filter(student =>
      (student.name && student.name.toLowerCase().includes(lowercasedQuery)) ||
      (student.admissionId && student.admissionId.includes(lowercasedQuery)) ||
      (student.fatherName && student.fatherName.toLowerCase().includes(lowercasedQuery))
    );
    setFilteredStudents(filtered);
  }, [query, students]);

  const handleUpdateInfo = (admissionId) => {
    // This route needs to be created in your router setup (e.g., App.js)
    navigate(`/coordinator/update-student-info/${admissionId}`);
  };

  const handleUpdateFees = (admissionId) => {
    // Navigates to the existing fees management page
    navigate(`/coordinator/admission-fees/${admissionId}`);
  };

  return (
    <>
      <CoordinatorNavbar />
      <Container maxWidth="lg">
        <StyledPaper>
          <Typography variant="h4" color="primary" gutterBottom>
            Final Admissions
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            View and manage students whose admission process is complete.
          </Typography>

          <TextField
            label="Search by Name, Admission ID, or Father's Name"
            variant="outlined"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ mb: 2.5 }}
          />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
                  <TableRow>
                    <TableCell><strong>Admission ID</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Father's Name</strong></TableCell>
                    <TableCell><strong>Class</strong></TableCell>
                    <TableCell align="center"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.admissionId} hover>
                        <TableCell>{student.admissionId}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.fatherName}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Button variant="contained" color="secondary" size="small" startIcon={<EditIcon />} onClick={() => handleUpdateInfo(student.admissionId)}>
                              Update Info
                            </Button>
                            <Button variant="contained" color="primary" size="small" startIcon={<PaymentsIcon />} onClick={() => handleUpdateFees(student.admissionId)}>
                              Update Fees
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No matching students found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </StyledPaper>
      </Container>
    </>
  );
};

export default FinalAdmissionsList;
