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
  '&:last-child': {
    marginBottom: 0,
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(2),
  },
}));

const FeesGeneration = () => {
  const [formData, setFormData] = useState({
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
  });

  const classes = [
    'Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({
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
    });
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

  return (
    <Container maxWidth="md">
      <StyledPaper elevation={3}>
        <Box display="flex" alignItems="center" mb={4}>
          <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" component="h1" color="primary">
            Fees Generation
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Student Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} /> Student Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Receipt ID"
                name="recietId"
                value={formData.recietId}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ReceiptIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SchoolIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                {classes.map((cls) => (
                  <MenuItem key={cls} value={cls}>
                    {cls}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Father's Name"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  label="Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Fees Details */}
            <Grid item xs={12} mt={2}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                Fees Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FeeCard variant="outlined">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Registration Fees"
                        name="registrationFees"
                        type="number"
                        value={formData.registrationFees}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Admission Fees"
                        name="admissionFees"
                        type="number"
                        value={formData.admissionFees}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Annual Charges"
                        name="annualCharges"
                        type="number"
                        value={formData.annualCharges}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Activity Fees"
                        name="activityFees"
                        type="number"
                        value={formData.activityFees}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </FeeCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <FeeCard variant="outlined">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Maintenance Fees"
                        name="maintenanceFees"
                        type="number"
                        value={formData.maintenanceFees}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Tuition Fees"
                        name="tutionFees"
                        type="number"
                        value={formData.tutionFees}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Total Amount:</Typography>
                        <Typography variant="h5" color="primary">
                          ₹{calculateTotal().toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </FeeCard>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <StyledButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
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