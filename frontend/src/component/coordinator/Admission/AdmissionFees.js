import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, TextField, MenuItem, CircularProgress, Button, Grid,
  Box, InputAdornment, FormControl, InputLabel, Select, Divider, Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CoordinatorNavbar from '../CoordinatorNavbar';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import jsPDF from "jspdf";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import numWords from 'num-words';

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


const generateReceiptId = () => `RCP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const FeesGeneration = () => {
  const { admissionId } = useParams();
  const [receiptId] = useState(generateReceiptId()); // Generate once per component mount

  const [formData, setFormData] = useState({
    receiptId: receiptId,
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
    others: [
      {
        name: '',
        amount: ''
      }
    ]
  });

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Fetch user data with improved error handling
  useEffect(() => {
    const fetchUserData = async () => {
      if (!admissionId) {
        setError('No admission ID provided');
        setDataLoading(false);
        return;
      }

      try {
        setDataLoading(true);
        const token = sessionStorage.getItem('coordinatorToken');
        if (!token) {
          toast.error('Authentication required.');
          navigate('/coordinator/login');
          return;
        }

        // Try multiple possible API endpoints
        let data = null;
        let response = null;

        // First try the current endpoint
        try {
          response = await fetch(`https://school-erp-11-mr7k.onrender.com/api/final/admission/get/student/${admissionId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            data = result.data || result;
          }
        } catch (err) {
          console.log(err);
        }

        // If first endpoint fails, try alternative endpoint
        if (!data) {
          try {
            response = await fetch(`https://school-erp-11-mr7k.onrender.com/api/admission/get/${admissionId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const result = await response.json();
              data = result.data || result;
            }
          } catch (err) {
            console.log(err);
          }
        }

        if (!data) {
          throw new Error('Failed to fetch student data from all endpoints');
        }

        setUserData(data);
        setError('');

        // Pre-fill form data
        setFormData(prev => ({
          ...prev,
          admissionId: data.admissionId || admissionId,
          name: data.name || '',
          class: data.class || '',
          fatherName: data.fatherName || '',
          gender: data.gender || '',
        }));

      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(`Failed to fetch student data: ${error.message}`);
        toast.error('Failed to fetch student data. Please check the admission ID.');
      } finally {
        setDataLoading(false);
      }
    };

    fetchUserData();
  }, [admissionId, navigate]);

  // Auto-calculate total paid amount
  useEffect(() => {
    const {
      registrationFees, admissionFees, annualCharges,
      activityFees, maintenanceFees, tutionFees,
      uniform, transport, books, belt, others
    } = formData;

    const total = [
      registrationFees, admissionFees, annualCharges,
      activityFees, maintenanceFees, tutionFees,
      uniform, transport, books, belt
    ].reduce((sum, val) => sum + (parseFloat(val) || 0), 0) + (others?.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0) || 0)

    setFormData(prev => ({
      ...prev,
      totalPaidAmount: total.toFixed(2),
    }));
  }, [
    formData.registrationFees, formData.admissionFees, formData.annualCharges,
    formData.activityFees, formData.maintenanceFees, formData.tutionFees,
    formData.uniform, formData.transport, formData.books, formData.belt,
    formData.others
  ]);

  // Handler for "others" fields
  const handleOtherChange = (idx, field, value) => {
    setFormData(prev => {
      const updatedOthers = prev.others.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      );
      return { ...prev, others: updatedOthers };
    });
  };

  const addOtherField = () => {
    setFormData(prev => ({
      ...prev,
      others: [...(prev.others || []), { label: '', amount: '' }]
    }));
  };

  const removeOtherField = (idx) => {
    setFormData(prev => ({
      ...prev,
      others: prev.others.filter((_, i) => i !== idx)
    }));
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Enhanced PDF generation function
  const generateFeeReceiptPDF = (data) => {
    const doc = new jsPDF();

    // Set up colors and fonts
    const primaryColor = [41, 128, 185]; // Blue
    const secondaryColor = [52, 73, 94]; // Dark gray
    const lightGray = [245, 245, 245];

    // Header with school branding
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');


    // School name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('SUNVILLEKIDZ', 45, 18);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('ADMISSION FEE RECEIPT', 45, 28);

    // Receipt number and date
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(10);
    // Use the receiptId from data
    const receiptNo = data.receiptId || 'RCP-UNKNOWN';
    const currentDate = new Date().toLocaleDateString('en-IN');
    doc.text(`Receipt No: ${receiptNo}`, 140, 18);
    doc.text(`Date: ${currentDate}`, 140, 26);

    // Student Information Section
    let y = 55;
    doc.setFillColor(...lightGray);
    doc.rect(15, y - 5, 180, 8, 'F');

    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('STUDENT INFORMATION', 20, y);

    y += 15;
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    // Student details in two columns
    const studentInfo = [
      ['Admission ID:', data.admissionId || 'N/A'],
      ['Student Name:', data.name || 'N/A'],
      ['Class:', data.class || 'N/A'],
      ['Gender:', data.gender || 'N/A'],
      ['Father\'s Name:', data.fatherName || 'N/A']
    ];

    studentInfo.forEach(([label, value], index) => {
      const xPos = index % 2 === 0 ? 20 : 120;
      const yPos = y + Math.floor(index / 2) * 8;

      doc.setFont('helvetica', 'bold');
      doc.text(label, xPos, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(value, xPos + 35, yPos);
    });

    y += Math.ceil(studentInfo.length / 2) * 8 + 10;

    // Fee Details Section
    doc.setFillColor(...lightGray);
    doc.rect(15, y - 5, 180, 8, 'F');

    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FEE DETAILS', 20, y);

    y += 15;

    // Table header
    doc.setFillColor(...primaryColor);
    doc.rect(15, y - 5, 180, 8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('FEE TYPE', 20, y);
    doc.text('AMOUNT (RS.)', 160, y);

    y += 12;
    doc.setTextColor(...secondaryColor);
    doc.setFont('helvetica', 'normal');

    // Fee items
    const feeItems = [
      { label: 'Registration Fees', field: 'registrationFees' },
      { label: 'Admission Fees', field: 'admissionFees' },
      { label: 'Annual Charges', field: 'annualCharges' },
      { label: 'Activity Fees', field: 'activityFees' },
      { label: 'Maintenance Fees', field: 'maintenanceFees' },
      { label: 'Tuition Fees', field: 'tutionFees' },
      { label: 'Uniform', field: 'uniform' },
      { label: 'Transport', field: 'transport' },
      { label: 'Books', field: 'books' },
      { label: 'Belt', field: 'belt' }
    ];

    let subtotal = 0;
    feeItems.forEach((item, index) => {
      if (data[item.field] != 0) {
        const amount = parseFloat(data[item.field]) || 0;
        if (amount > 0) {
          // Alternating row colors
          if (index % 2 === 0) {
            doc.setFillColor(250, 250, 250);
            doc.rect(15, y - 3, 180, 6, 'F');
          }

          doc.text(item.label, 20, y);
          doc.text(amount.toFixed(2), 165, y);
          subtotal += amount;
          y += 8;
        }
      }
    });

    // Divider line
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(15, y + 2, 195, y + 2);

    y += 10;

    // Total section
    doc.setFillColor(...primaryColor);
    doc.rect(15, y - 3, 180, 10, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL AMOUNT PAID', 20, y + 3);
    doc.text(`${subtotal.toFixed(2)} RS.`, 155, y + 3);
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const totalAmount = parseFloat(data.totalPaidAmount || subtotal);
    const totalInWords = numWords(Math.floor(totalAmount)).replace(/^\w/, c => c.toUpperCase()) + ' Rupees Only';
    doc.text(`(Rupees: ${totalInWords})`, 20, y + 12);

    y += 20;

    // Payment information
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Payment Method: Cash/Online Transfer', 20, y);
    doc.text('Status: Paid', 20, y + 8);

    // Footer
    y = 280;
    doc.setDrawColor(200, 200, 200);
    doc.line(15, y, 195, y);

    y += 8;
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a computer generated receipt and does not require signature.', 20, y);
    doc.text('For queries, contact: admin@sunvillekidz.com | Phone: +91-XXXXXXXXXX', 20, y + 6);

    // Authorized signature section
    y += 20;
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(10);
    doc.text('_____________________', 20, y);
    doc.text('Authorized Signature', 20, y + 8);

    doc.text('_____________________', 140, y);
    doc.text('Parent/Guardian Signature', 140, y + 8);

    // Save the PDF
    doc.save(`Fee_Receipt_${receiptNo}.pdf`);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.class || !formData.fatherName) {
      toast.error('Please ensure all student details are properly loaded before submitting.');
      return;
    }

    const startData = sessionStorage.getItem('coordinatorToken');
    const token = startData ? JSON.parse(startData).token : null;
    if (!token) {
      toast.error('Authentication required.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://school-erp-11-mr7k.onrender.com/api/admission/fees/create/admission/fee', {
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

        // Generate PDF with the submitted data
        generateFeeReceiptPDF(formData);

        // Navigate after a short delay to allow PDF generation
        setTimeout(() => {
          navigate('/coordinator/home');
        }, 1000);

      } else {
        toast.error(result.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Submission error:', err);
      toast.error('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <>
        <CoordinatorNavbar />
        <Container maxWidth="md">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2 }}>Loading student data...</Typography>
          </Box>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CoordinatorNavbar />
        <Container maxWidth="md">
          <StyledPaper>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button variant="contained" onClick={() => navigate('/coordinator/home')}>
              Go Back to Home
            </Button>
          </StyledPaper>
        </Container>
      </>
    );
  }

  return (
    <>
      <CoordinatorNavbar />
      <Container maxWidth="md">
        <StyledPaper>
          <Box display="flex" alignItems="center" mb={4}>
            <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" color="primary">Fees Generation</Typography>
          </Box>

          {userData && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Student data loaded successfully for: <strong>{userData.name}</strong>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" color="primary">
                  <PersonIcon sx={{ mr: 1 }} /> Student Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Admission ID"
                  name="admissionId"
                  value={formData.admissionId}
                  disabled
                  variant="filled"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Student Name"
                  name="name"
                  value={formData.name}
                  disabled
                  variant="filled"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Class"
                  name="class"
                  value={formData.class}
                  disabled
                  variant="filled"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SchoolIcon /></InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Father's Name"
                  name="fatherName"
                  value={formData.fatherName}
                  disabled
                  variant="filled"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled variant="filled">
                  <InputLabel>Gender</InputLabel>
                  <Select name="gender" value={formData.gender} label="Gender">
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  <ReceiptIcon sx={{ mr: 1 }} /> Fee Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {/* Fee Input Fields */}
              {[
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
              ].map(({ field, label }) => (
                <Grid item xs={12} sm={6} key={field}>
                  <TextField
                    fullWidth
                    type="number"
                    label={label}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    inputProps={{ step: "0.01", min: "0" }}
                  />
                </Grid>
              ))}

              {/* Auto-calculated total */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Paid Amount"
                  name="totalPaidAmount"
                  value={formData.totalPaidAmount}
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

              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography variant="subtitle1">Others</Typography>
                  <AddCircleOutlineIcon
                    color="primary"
                    sx={{ cursor: 'pointer' }}
                    onClick={addOtherField}
                  />
                </Box>
                {formData.others && formData.others.length > 0 && formData.others.map((item, idx) => (
                  <Box key={idx} display="flex" alignItems="center" gap={1} mb={1}>
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
                      value={item.amount}
                      onChange={e => handleOtherChange(idx, 'amount', e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                      inputProps={{ step: "0.01", min: "0" }}
                      sx={{ flex: 1 }}
                    />
                    <RemoveCircleOutlineIcon
                      color="error"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => removeOtherField(idx)}
                    />
                  </Box>
                ))}
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" gap={2} mt={2}>
                  <StyledButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading || !formData.name}
                    startIcon={loading ? <CircularProgress size={20} /> : <ReceiptIcon />}
                  >
                    {loading ? 'Processing...' : 'Generate Fee Receipt'}
                  </StyledButton>

                  <StyledButton
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/coordinator/home')}
                  >
                    Cancel
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

export default FeesGeneration;