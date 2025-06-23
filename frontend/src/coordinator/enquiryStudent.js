import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Box, 
  Grid, 
  TextField, 
  FormControlLabel, 
  Checkbox,
  Divider,
  Card,
  CardContent,
  FormGroup,
  Avatar,
  Chip,
  Stack,
  alpha,
  useTheme
} from '@mui/material';
import { 
  Save as SaveIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px 0 rgba(0,0,0,0.1)'
  },
  '& .MuiCardContent-root': {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      transform: 'none',
      boxShadow: 'none'
    }
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  '& svg': {
    marginRight: theme.spacing(1.5),
    color: theme.palette.primary.main
  }
}));

const InfoItem = ({ icon, label, value, color = 'text.primary' }) => {
  // Handle both string and element values
  const renderValue = () => {
    if (React.isValidElement(value)) {
      return value;
    }
    return (
      <Typography variant="body2" sx={{ color, fontWeight: 500, mt: 0.25 }}>
        {value}
      </Typography>
    );
  };

  return (
    <Box sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}>
      <Box sx={{ 
        color: 'primary.main', 
        mr: 2,
        mt: 0.5
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          {label}
        </Typography>
        {renderValue()}
      </Box>
    </Box>
  );
};

// Sample student data - replace with actual API call in production
const sampleStudent = {
  id: 'ENQ-2023-456',
  name: 'Rahul Sharma',
  parentName: 'Amit Sharma',
  email: 'rahul.s@example.com',
  phone: '+91 98765 43210',
  address: '123, ABC Colony, Andheri East, Mumbai - 400069',
  className: 'Nursery',
  dateOfEnquiry: '2025-06-20',
  source: 'Website',
  status: 'New',
  schoolInfo: false,
  schoolVisit: false,
  feesStructure: false,
  remarks: ''
};

const EnquiryStudent = () => {
  const theme = useTheme();
  const [student, setStudent] = useState(sampleStudent);
  const [remarks, setRemarks] = useState('');
  
  const handleNewEnquiry = () => {
    setStudent({
      id: `ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      parentName: '',
      email: '',
      phone: '',
      address: '',
      className: '',
      dateOfEnquiry: new Date().toISOString().split('T')[0],
      source: 'Website',
      status: 'New',
      schoolInfo: false,
      schoolVisit: false,
      feesStructure: false,
    });
    setRemarks('');
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setStudent(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
  };

  const handleSave = () => {
    // Basic validation
    if (!student.name || !student.parentName || !student.phone) {
      alert('Please fill in all required fields');
      return;
    }
    
    const enquiryData = {
      ...student,
      remarks,
      dateOfEnquiry: student.dateOfEnquiry || new Date().toISOString().split('T')[0]
    };
    
    console.log('Saving data:', enquiryData);
    // TODO: Add API call to save the data
    // Example:
    // try {
    //   const response = await fetch('/api/enquiries', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(enquiryData)
    //   });
    //   const result = await response.json();
    //   if (response.ok) {
    //     alert('Enquiry saved successfully!');
    //   } else {
    //     throw new Error(result.message || 'Failed to save enquiry');
    //   }
    // } catch (error) {
    //   console.error('Error saving enquiry:', error);
    //   alert('Error saving enquiry: ' + error.message);
    // }
  };

  const getStatusColor = (status) => {
    const colors = {
      'New': { main: 'primary.main', light: 'primary.light', dark: 'primary.dark' },
      'In Progress': { main: 'warning.main', light: 'warning.light', dark: 'warning.dark' },
      'Completed': { main: 'success.main', light: 'success.light', dark: 'success.dark' },
      'default': { main: 'text.primary', light: 'grey.100', dark: 'text.primary' }
    };
    return colors[status] || colors['default'];
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4, gap: 2, position: 'relative' }}>
        <Box sx={{ position: 'absolute', left: 0 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleNewEnquiry}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              boxShadow: '0 2px 10px rgba(25, 118, 210, 0.2)',
              '&:hover': {
                boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            New Enquiry
          </Button>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 700, 
            color: 'text.primary',
            mb: 0.5
          }}>
            Student Enquiry
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
            Enquiry ID: {student.id} • {new Date(student.dateOfEnquiry).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {/* Student Information */}
        <Grid item xs={12} md={7}>
          <StyledCard>
            <CardContent sx={{ p: 4 }}>
              <SectionHeader>
                <PersonIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Student Information</Typography>
              </SectionHeader>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InfoItem 
                    icon={<PersonIcon fontSize="small" />} 
                    label="Student Name" 
                    value={student.name} 
                  />
                  <InfoItem 
                    icon={<PersonIcon fontSize="small" />} 
                    label="Parent/Guardian" 
                    value={student.parentName} 
                  />
                  <InfoItem 
                    icon={<SchoolIcon fontSize="small" />} 
                    label="Class Applied" 
                    value={student.className} 
                  />
                  <InfoItem 
                    icon={<InfoIcon fontSize="small" />} 
                    label="Source" 
                    value={student.source} 
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ color: 'primary.main', mr: 2, mt: 0.5 }}>
                      <EmailIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Email
                      </Typography>
                      <Typography 
                        component="a"
                        href={`mailto:${student.email}`}
                        sx={{ 
                          color: 'primary.main', 
                          textDecoration: 'none',
                          '&:hover': { 
                            textDecoration: 'underline' 
                          }
                        }}
                      >
                        {student.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ color: 'primary.main', mr: 2, mt: 0.5 }}>
                      <PhoneIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Phone
                      </Typography>
                      <Typography
                        component="a"
                        href={`tel:${student.phone.replace(/\D/g, '')}`}
                        sx={{ 
                          color: 'primary.main', 
                          textDecoration: 'none',
                          '&:hover': { 
                            textDecoration: 'underline' 
                          }
                        }}
                      >
                        {student.phone}
                      </Typography>
                    </Box>
                  </Box>
                  <InfoItem 
                    icon={<HomeIcon fontSize="small" />} 
                    label="Address" 
                    value={student.address} 
                  />
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Coordinator Section */}
        <Grid item xs={12} md={5}>
          <StyledCard>
            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <SectionHeader>
                <AssignmentIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Coordinator Actions</Typography>
              </SectionHeader>
              
              <Box sx={{ mb: 3 }}>
                <Stack spacing={1.5}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      bgcolor: student.schoolInfo ? alpha(theme.palette.primary.light, 0.05) : 'transparent',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.light, 0.05),
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      },
                      '&:not(:last-child)': {
                        mb: 2
                      }
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={student.schoolInfo}
                          onChange={handleCheckboxChange}
                          name="schoolInfo"
                          color="primary"
                          size="small"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>School Information</Typography>
                          <Typography variant="caption" color="text.secondary">Share school brochure and details</Typography>
                        </Box>
                      }
                      sx={{ m: 0, width: '100%' }}
                      componentsProps={{
                        typography: {
                          component: 'div',
                          sx: { width: '100%' }
                        }
                      }}
                    />
                  </Box>
                  
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      bgcolor: student.schoolVisit ? alpha(theme.palette.primary.light, 0.05) : 'transparent',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.light, 0.05),
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      },
                      '&:not(:last-child)': {
                        mb: 2
                      }
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={student.schoolVisit}
                          onChange={handleCheckboxChange}
                          name="schoolVisit"
                          color="primary"
                          size="small"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>School Visit</Typography>
                          <Typography variant="caption" color="text.secondary">Schedule a campus tour</Typography>
                        </Box>
                      }
                      sx={{ m: 0, width: '100%' }}
                      componentsProps={{
                        typography: {
                          component: 'div',
                          sx: { width: '100%' }
                        }
                      }}
                    />
                  </Box>
                  
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      bgcolor: student.feesStructure ? alpha(theme.palette.primary.light, 0.05) : 'transparent',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.light, 0.05),
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      },
                      '&:not(:last-child)': {
                        mb: 2
                      }
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={student.feesStructure}
                          onChange={handleCheckboxChange}
                          name="feesStructure"
                          color="primary"
                          size="small"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Fees Structure</Typography>
                          <Typography variant="caption" color="text.secondary">Share fee details and payment plans</Typography>
                        </Box>
                      }
                      sx={{ m: 0, width: '100%' }}
                      componentsProps={{
                        typography: {
                          component: 'div',
                          sx: { width: '100%' }
                        }
                      }}
                    />
                  </Box>
                </Stack>
              </Box>
              
              <Box sx={{ mt: 'auto' }}>
                <TextField
                  fullWidth
                  label="Remarks"
                  multiline
                  rows={3}
                  value={remarks}
                  onChange={handleRemarksChange}
                  variant="outlined"
                  margin="normal"
                  placeholder="Add any additional remarks here..."
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.light',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    size="large"
                    fullWidth
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      boxShadow: '0 4px 14px 0 rgba(0,118,255,0.2)',
                      '&:hover': {
                        boxShadow: '0 8px 24px 0 rgba(0,118,255,0.3)',
                        transform: 'translateY(-2px)',
                        backgroundColor: theme.palette.primary.dark,
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                        boxShadow: '0 4px 14px 0 rgba(0,118,255,0.2)',
                      },
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EnquiryStudent;