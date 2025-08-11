import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CoordinatorNavbar from '../component/coordinator/CoordinatorNavbar'
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
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {toast} from 'react-toastify';


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

const InfoCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  border: '1px solid #e0e0e0',
}));

const FeesGeneration = () => {
  const { admissionId } = useParams();
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState('');
  console.log(admissionId);
  
  const [feePaymentData, setFeePaymentData] = useState({
    monthsSelected: [],
    amountPerMonth: '',
    totalAmount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    remarks: '',
  });

  const navigate = useNavigate();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();

  // Fetch student data on component mount
  useEffect(() => {
    if (admissionId) {
      fetchStudentData();
    }
  }, [admissionId]);

  const fetchStudentData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = sessionStorage.getItem('coordinatorToken');
      if(!token){
        toast.info('Please login to continue');
        navigate('/coordinator/login');
      }
      const response = await fetch(`https://school-erp-11-mr7k.onrender.com/api/final/admission/get/student/${admissionId}`,{
        method:'GET',
        headers:{
          'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Student not found');
      }
      const data = await response.json();
      setStudentData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch student data');
    } finally {
      setLoading(false);
    }
  };

  const handleFeePaymentChange = (e) => {
    const { name, value } = e.target;
    setFeePaymentData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate total amount when months or amount per month changes
      if (name === 'monthsSelected' || name === 'amountPerMonth') {
        const months = name === 'monthsSelected' ? value : prev.monthsSelected;
        const amount = name === 'amountPerMonth' ? parseFloat(value) || 0 : parseFloat(prev.amountPerMonth) || 0;
        updated.totalAmount = (months.length * amount).toFixed(2);
      }
      
      return updated;
    });
  };

  const handleMonthSelection = (event) => {
    const value = event.target.value;
    setFeePaymentData(prev => {
      const updated = { 
        ...prev, 
        monthsSelected: typeof value === 'string' ? value.split(',') : value 
      };
      // Recalculate total
      const amount = parseFloat(prev.amountPerMonth) || 0;
      updated.totalAmount = (updated.monthsSelected.length * amount).toFixed(2);
      return updated;
    });
  };

  const handleFeeSubmit = async (e) => {
    e.preventDefault();
    
    if (!feePaymentData.monthsSelected.length) {
      alert('Please select at least one month');
      return;
    }

    try {
      const paymentData = {
        admissionId,
        monthsSelected: feePaymentData.monthsSelected,
        amountPerMonth: parseFloat(feePaymentData.amountPerMonth),
        totalAmount: parseFloat(feePaymentData.totalAmount),
        paymentDate: feePaymentData.paymentDate,
        paymentMethod: feePaymentData.paymentMethod,
        remarks: feePaymentData.remarks,
        year: currentYear,
      };

      const response = await fetch('tp://localhost:5000/api/fees/create/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Payment submission failed');
      }

      alert('Fee payment recorded successfully!');
      
      // Reset form
      setFeePaymentData({
        receiptId: '',
        monthsSelected: [],
        amountPerMonth: '',
        totalAmount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
        remarks: '',
      });
      
      // Refresh student data to show updated payment history
      fetchStudentData();
      
    } catch (error) {
      console.error(error);
      alert('Payment submission failed: ' + error.message);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <div>
    <CoordinatorNavbar/>
    <Container  className='mt-5'>
      {/* Student Information Section */}
      {studentData && (
        <InfoCard elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={3}>
              <PersonIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
              <Typography variant="h5" color="primary">Student Information</Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Admission ID</Typography>
                <Typography variant="h6">{studentData.admissionId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Student Name</Typography>
                <Typography variant="h6">{studentData.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Class</Typography>
                <Typography variant="h6">{studentData.class}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Father's Name</Typography>
                <Typography variant="h6">{studentData.fatherName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Gender</Typography>
                <Typography variant="h6">{studentData.gender}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Monthly Fee Amount</Typography>
                <Typography variant="h6" color="primary">₹{studentData.monthlyFeeAmount || 'Not Set'}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </InfoCard>
      )}

      {/* Monthly Fee Payment Section */}
      <StyledPaper elevation={3}>
        <Box display="flex" alignItems="center" mb={4}>
          <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" color="primary">Monthly Fee Payment</Typography>
        </Box>

        <form onSubmit={handleFeeSubmit}>
          <Grid container spacing={3}>
            {/* Receipt Information */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary">
                <ReceiptIcon sx={{ mr: 1 }} /> Payment Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Receipt ID" 
                name="receiptId" 
                required 
                value={feePaymentData.receiptId} 
                onChange={handleFeePaymentChange}
                InputProps={{ 
                  startAdornment: <InputAdornment position="start"><ReceiptIcon /></InputAdornment> 
                }} 
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Payment Date" 
                name="paymentDate" 
                type="date"
                required 
                value={feePaymentData.paymentDate} 
                onChange={handleFeePaymentChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Month Selection */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary">
                <CalendarMonthIcon sx={{ mr: 1 }} /> Select Months ({currentYear})
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Months</InputLabel>
                <Select
                  multiple
                  name="monthsSelected"
                  value={feePaymentData.monthsSelected}
                  onChange={handleMonthSelection}
                  label="Select Months"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Fee Amount */}
            <Grid item xs={12} sm={4}>
              <TextField 
                fullWidth 
                label="Amount per Month" 
                name="amountPerMonth" 
                type="number"
                required 
                value={feePaymentData.amountPerMonth} 
                onChange={handleFeePaymentChange}
                InputProps={{ 
                  startAdornment: <InputAdornment position="start">₹</InputAdornment> 
                }} 
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField 
                fullWidth 
                label="Total Amount" 
                name="totalAmount" 
                type="number"
                value={feePaymentData.totalAmount} 
                InputProps={{ 
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  readOnly: true,
                }} 
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  name="paymentMethod"
                  value={feePaymentData.paymentMethod}
                  onChange={handleFeePaymentChange}
                  label="Payment Method"
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Card">Card</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="Cheque">Cheque</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Remarks */}
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Remarks (Optional)" 
                name="remarks" 
                multiline
                rows={3}
                value={feePaymentData.remarks} 
                onChange={handleFeePaymentChange}
              />
            </Grid>

            {/* Payment Summary */}
            {feePaymentData.monthsSelected.length > 0 && feePaymentData.amountPerMonth && (
              <Grid item xs={12}>
                <Card sx={{ backgroundColor: '#f5f5f5', mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Payment Summary</Typography>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography>Months Selected:</Typography>
                      <Typography>{feePaymentData.monthsSelected.length}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography>Amount per Month:</Typography>
                      <Typography>₹{feePaymentData.amountPerMonth}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h6">Total Amount:</Typography>
                      <Typography variant="h6" color="primary">₹{feePaymentData.totalAmount}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <StyledButton 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  disabled={!feePaymentData.monthsSelected.length || !feePaymentData.amountPerMonth}
                >
                  Record Payment
                </StyledButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </StyledPaper>
    </Container>
    </div>
  );
};

export default FeesGeneration;