import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, TextField, CircularProgress, Button, Grid, Box, InputAdornment, Alert, IconButton, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CoordinatorNavbar from '../component/coordinator/CoordinatorNavbar';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

// Reusing styles for consistency
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: '10px 24px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600
}));

const UpdateAdmissionFee = () => {
  const { admissionId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [feeData, setFeeData] = useState({
    registrationFees: 0,
    admissionFees: 0,
    annualCharges: 0,
    activityFees: 0,
    maintenanceFees: 0,
    tutionFees: 0,
    uniform: 0,
    transport: 0,
    books: 0,
    belt: 0,
    totalPaidAmount: 0,
    others: [{ name: '', amount: 0 }]
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!admissionId) {
        setError('No Admission ID provided.');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const token = sessionStorage.getItem('coordinatorToken');
        if (!token) {
          toast.error('Authentication required.');
          navigate('/coordinator/login');
          return;
        }

        // Fetch student details
        const studentRes = await fetch(`https://school-erp-11-mr7k.onrender.com/api/final/admission/get/student/${admissionId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!studentRes.ok) throw new Error('Failed to fetch student details.');
        const studentResult = await studentRes.json();
        setStudent(studentResult.data);

        // Fetch existing fee details
        const feeRes = await fetch(`https://school-erp-11-mr7k.onrender.com/api/admission/fees/get/admission/fee/${admissionId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (feeRes.ok) {
          const feeResult = await feeRes.json();
          if (feeResult.data) {
            setFeeData({
              ...feeResult.data,
              others: feeResult.data.others && feeResult.data.others.length > 0 ? feeResult.data.others : [{ name: '', amount: 0 }]
            });
          }
        } else if (feeRes.status !== 404) {
          // Handle errors other than 'not found'
          throw new Error('Failed to fetch fee details.');
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [admissionId, navigate]);

  // Auto-calculate total paid amount
  useEffect(() => {
    const {
      registrationFees, admissionFees, annualCharges, activityFees,
      maintenanceFees, tutionFees, uniform, transport, books, belt, others
    } = feeData;

    const mainFeesTotal = [
      registrationFees, admissionFees, annualCharges, activityFees,
      maintenanceFees, tutionFees, uniform, transport, books, belt
    ].reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

    const othersTotal = others?.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0) || 0;

    const total = mainFeesTotal + othersTotal;

    setFeeData(prev => ({
      ...prev,
      totalPaidAmount: total.toFixed(2),
    }));
  }, [
    feeData.registrationFees, feeData.admissionFees, feeData.annualCharges,
    feeData.activityFees, feeData.maintenanceFees, feeData.tutionFees,
    feeData.uniform, feeData.transport, feeData.books, feeData.belt,
    feeData.others
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeeData(prev => ({ ...prev, [name]: value }));
  };

  const handleOtherChange = (idx, field, value) => {
    setFeeData(prev => {
      const updatedOthers = [...prev.others];
      updatedOthers[idx] = { ...updatedOthers[idx], [field]: value };
      return { ...prev, others: updatedOthers };
    });
  };

  const addOtherField = () => {
    setFeeData(prev => ({
      ...prev,
      others: [...(prev.others || []), { name: '', amount: 0 }]
    }));
  };

  const removeOtherField = (idx) => {
    setFeeData(prev => ({
      ...prev,
      others: prev.others.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = sessionStorage.getItem('coordinatorToken');
      if (!token) {
        toast.error('Authentication required.');
        setSubmitting(false);
        return;
      }

      const response = await fetch(`https://school-erp-11-mr7k.onrender.com/api/admission/fees/update/student/admission-fees/${admissionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(feeData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update fees.');
      }

      toast.success('Admission fees updated successfully!');
      navigate(`/coordinator/monthly-fees/${admissionId}`);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading student and fee data...</Typography>
        </Box>
      </Container>
    );
  }

  if (error && !student) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      </Container>
    );
  }

  const feeFields = [
    { field: 'registrationFees', label: 'Registration Fees' },
    { field: 'admissionFees', label: 'Admission Fees' },
    { field: 'annualCharges', label: 'Annual Charges' },
    { field: 'activityFees', label: 'Activity Fees' },
    { field: 'maintenanceFees', label: 'Maintenance Fees' },
    { field: 'tutionFees', label: 'Tuition Fees' },
    { field: 'uniform', label: 'Uniform' },
    { field: 'transport', label: 'Transport' },
    { field: 'books', label: 'Books' },
    { field: 'belt', label: 'Belt' }
  ];

  return (
    <>
      <CoordinatorNavbar />
      <Container maxWidth="md">
        <StyledPaper>
          <Box display="flex" alignItems="center" mb={4}>
            <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" color="primary">Update Admission Fees</Typography>
          </Box>

          {student && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Updating fees for: <strong>{student.name}</strong> (Admission ID: {student.admissionId})
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" color="primary">
                  <ReceiptIcon sx={{ mr: 1 }} /> Fee Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {feeFields.map(({ field, label }) => (
                <Grid item xs={12} sm={6} key={field}>
                  <TextField
                    fullWidth
                    type="number"
                    label={label}
                    name={field}
                    value={feeData[field] || 0}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    inputProps={{ step: "0.01", min: "0" }}
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  Other Fees
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {feeData.others.map((item, idx) => (
                  <Box key={idx} display="flex" alignItems="center" gap={1} mb={2}>
                    <TextField
                      size="small"
                      label="Fee Name"
                      value={item.name}
                      onChange={e => handleOtherChange(idx, 'name', e.target.value)}
                      sx={{ flex: 2 }}
                    />
                    <TextField
                      size="small"
                      type="number"
                      label="Amount"
                      value={item.amount || 0} 
                      onChange={e => handleOtherChange(idx, 'amount', e.target.value)}
                      InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                      inputProps={{ step: "1", min: "0" }}
                      sx={{ flex: 1 }}
                    />
                    <IconButton onClick={() => removeOtherField(idx)} color="error">
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button startIcon={<AddCircleOutlineIcon />} onClick={addOtherField}>
                  Add Other Fee
                </Button>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Paid Amount"
                  name="totalPaidAmount"
                  value={feeData.totalPaidAmount}
                  disabled
                  variant="filled"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  sx={{
                    '& .MuiFilledInput-root': {
                      backgroundColor: '#e8f5e8',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                  <Button variant="outlined" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <StyledButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={20} /> : <ReceiptIcon />}
                  >
                    {submitting ? 'Updating...' : 'Update Fees'}
                  </StyledButton>
                </Box>
              </Grid>
            </Grid>
          </form>
        </StyledPaper>
      </Container>
    </>
  );
};

export default UpdateAdmissionFee;