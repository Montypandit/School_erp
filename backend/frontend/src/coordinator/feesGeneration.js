import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Box,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

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

const FeeCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiCardContent-root': {
    padding: theme.spacing(2),
  },
}));

const FeesGeneration = () => {
  const [formData, setFormData] = useState({
    recietId: '',
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
    periodType: '',
    monthOrQuarter: '',
    amountPaid: '',
  });

  const classes = [
    'Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5',
    '6', '7', '8', '9', '10', '11', '12',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    const fees = [
      parseFloat(formData.registrationFees) || 0,
      parseFloat(formData.admissionFees) || 0,
      parseFloat(formData.annualCharges) || 0,
      parseFloat(formData.activityFees) || 0,
      parseFloat(formData.maintenanceFees) || 0,
      parseFloat(formData.tutionFees) || 0,
    ];
    return fees.reduce((sum, fee) => sum + fee, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const admissionData = {
      recietId: formData.recietId,
      admissionId: formData.admissionId,
      name: formData.name,
      class: formData.class,
      fatherName: formData.fatherName,
      gender: formData.gender,
      registrationFees: formData.registrationFees,
      admissionFees: formData.admissionFees,
      annualCharges: formData.annualCharges,
      activityFees: formData.activityFees,
      maintenanceFees: formData.maintenanceFees,
      tutionFees: formData.tutionFees,
    };

    try {
      // Create initial admission fee entry
      await fetch('https://your-backend-url/create/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(admissionData),
      });

      // Optionally add recurring payment
      if (
        formData.periodType &&
        formData.monthOrQuarter &&
        formData.amountPaid
      ) {
        await fetch('https://your-backend-url/add/recurring/payment', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            admissionId: formData.admissionId,
            periodType: formData.periodType,
            monthOrQuarter: formData.monthOrQuarter,
            amountPaid: parseFloat(formData.amountPaid),
          }),
        });
      }

      alert('Fee submitted successfully');
      setFormData({
        recietId: '',
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
        periodType: '',
        monthOrQuarter: '',
        amountPaid: '',
      });
    } catch (error) {
      console.error(error);
      alert('Submission failed');
    }
  };

  return (
    <Container maxWidth="md">
      <StyledPaper elevation={3}>
        <Box display="flex" alignItems="center" mb={4}>
          <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" color="primary">Fees Generation</Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* === Student Info === */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary"><PersonIcon sx={{ mr: 1 }} /> Student Info</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Receipt ID" name="recietId" required value={formData.recietId} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><ReceiptIcon /></InputAdornment> }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Admission ID" name="admissionId" required value={formData.admissionId} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Student Name" name="name" required value={formData.name} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Class" name="class" required value={formData.class} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><SchoolIcon /></InputAdornment> }}>
                {classes.map(cls => <MenuItem key={cls} value={cls}>{cls}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Father's Name" name="fatherName" required value={formData.fatherName} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select labelId="gender-label" name="gender" value={formData.gender} onChange={handleChange} label="Gender">
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* === Admission Fees === */}
            <Grid item xs={12} mt={2}>
              <Typography variant="h6" color="primary">Admission-Time Fees</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {[
              ['registrationFees', 'Registration Fees'],
              ['admissionFees', 'Admission Fees'],
              ['annualCharges', 'Annual Charges'],
              ['activityFees', 'Activity Fees'],
              ['maintenanceFees', 'Maintenance Fees'],
              ['tutionFees', 'Tuition Fees'],
            ].map(([field, label]) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField fullWidth label={label} name={field} type="number" value={formData[field]} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} />
              </Grid>
            ))}

            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h5" color="primary">₹{calculateTotal().toFixed(2)}</Typography>
              </Box>
            </Grid>

            {/* === Recurring Fees === */}
            <Grid item xs={12} mt={2}>
              <Typography variant="h6" color="primary">Recurring Payment (Optional)</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Period Type</InputLabel>
                <Select name="periodType" value={formData.periodType} onChange={handleChange} label="Period Type">
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Quarterly">Quarterly</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Month / Quarter" name="monthOrQuarter" value={formData.monthOrQuarter} onChange={handleChange} placeholder="e.g., June 2025 or Q2 2025" />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Amount Paid" name="amountPaid" type="number" value={formData.amountPaid} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <StyledButton type="submit" variant="contained" color="primary" size="large">
                  Generate Receipt
                </StyledButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default FeesGeneration;
