import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, TextField, MenuItem, CircularProgress, Button, Grid,
  Box, InputAdornment, FormControl, InputLabel, Select, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CoordinatorNavbar from '../CoordinatorNavbar';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: '10px 24px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
}));

const classes = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const FeesGeneration = () => {
  const { admissionId } = useParams();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    admissionId: '',
    name: '',
    class: '',
    fatherName: '',
    gender: '',
    registrationFees: '',
    admissionFees: '',
    annualCharges: '',
    activityFees: '',
    maintenanceFees: '',
    tutionFees: '',
    uniform: '',
    transport: '',
    books: '',
    belt: '',
    totalPaidAmount: '',
    totalAdmissionFees: '',
  });

  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('coordinatorToken');
        if (!token) {
          toast.error('Authentication required.');
          navigate('/coordinator/login');
          return;
        }

        const res = await fetch(`http://localhost:5000/api/final/admission/get/student/${admissionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setUserData(data);

      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch user data.');
      }
    };

    fetchUserData();
  }, [admissionId]);

  // Fill form with fetched data
  useEffect(() => {
    if (userData && userData.admissionId) {
      setFormData((prev) => ({
        ...prev,
        admissionId: userData.admissionId || '',
        name: userData.name || '',
        class: userData.class || '',
        fatherName: userData.fatherName || '',
        gender: userData.gender || '',
      }));
    }
  }, [userData]);

  // Auto-calculate total paid amount
  useEffect(() => {
    const {
      registrationFees, admissionFees, annualCharges,
      activityFees, maintenanceFees, tutionFees,
      uniform, transport, books, belt
    } = formData;

    const total = [
      registrationFees, admissionFees, annualCharges,
      activityFees, maintenanceFees, tutionFees,
      uniform, transport, books, belt
    ].reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

    setFormData((prev) => ({
      ...prev,
      totalPaidAmount: total.toFixed(2),
    }));
  }, [
    formData.registrationFees, formData.admissionFees, formData.annualCharges,
    formData.activityFees, formData.maintenanceFees, formData.tutionFees,
    formData.uniform, formData.transport, formData.books, formData.belt
  ]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('coordinatorToken');
    if (!token) {
      toast.error('Authentication required.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/admission/fees/create/admission/fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Fees submitted successfully!');
        navigate('/coordinator/home');
        setFormData({
          admissionId: '',
          name: '',
          class: '',
          fatherName: '',
          gender: '',
          registrationFees: '',
          admissionFees: '',
          annualCharges: '',
          activityFees: '',
          maintenanceFees: '',
          tutionFees: '',
          uniform: '',
          transport: '',
          books: '',
          belt: '',
          totalPaidAmount: '',
          totalAdmissionFees: '',
        });
        
      } else {
        toast.error(result.message || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CoordinatorNavbar />
      <Container maxWidth="md">
        <StyledPaper>
          <Box display="flex" alignItems="center" mb={4}>
            <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" color="primary">Fees Generation</Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" color="primary"><PersonIcon sx={{ mr: 1 }} /> Student Info</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Admission ID" name="admissionId" value={formData.admissionId} disabled />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Name" name="name" value={formData.name} disabled />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Class" name="class" value={formData.class} disabled
                  InputProps={{ startAdornment: <InputAdornment position="start"><SchoolIcon /></InputAdornment> }}>
                  {classes.map(cls => (
                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Father's Name" name="fatherName" value={formData.fatherName} disabled />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled>
                  <InputLabel>Gender</InputLabel>
                  <Select name="gender" value={formData.gender} label="Gender">
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Fee Input Fields */}
              {[
                'registrationFees', 'admissionFees', 'annualCharges',
                'activityFees', 'maintenanceFees', 'tutionFees',
                'uniform', 'transport', 'books', 'belt'
              ].map(field => (
                <Grid item xs={12} sm={6} key={field}>
                  <TextField
                    fullWidth
                    type="number"
                    label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                </Grid>
              ))}

              {/* Auto-calculated totalPaidAmount */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Paid Amount"
                  name="totalPaidAmount"
                  value={formData.totalPaidAmount}
                  disabled
                />
              </Grid>

              {/* Optional totalAdmissionFees (manual entry) */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Admission Fees"
                  name="totalAdmissionFees"
                  value={formData.totalAdmissionFees}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <StyledButton type="submit" variant="contained" color="primary" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Submit Fees'}
                </StyledButton>
              </Grid>
            </Grid>
          </form>
        </StyledPaper>
      </Container>
    </>
  );
};

export default FeesGeneration;
