import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box, 
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  styled,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { deepPurple, green, red } from '@mui/material/colors';
import { CheckCircle, Error, Add, Refresh, Edit } from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: '24px',
  boxShadow: '0 10px 30px rgba(108, 92, 231, 0.1)',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: '0 15px 40px rgba(108, 92, 231, 0.15)',
    transform: 'translateY(-4px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: '14px 36px',
  borderRadius: '28px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '16px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  color: '#fff',
  backgroundColor: '#6c5ce7',
  '&:hover': {
    backgroundColor: '#5a4ce0',
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 20px rgba(108, 92, 231, 0.3)',
  },
  '&:disabled': {
    backgroundColor: '#9c8fe4',
    color: '#fff',
    opacity: 0.7,
  },
  '&.Mui-disabled:hover': {
    backgroundColor: '#9c8fe4',
  },
  '& .MuiCircularProgress-root': {
    color: '#fff',
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: '6px 16px',
  borderRadius: '16px',
  textTransform: 'none',
  fontSize: '14px',
  fontWeight: 500,
  minWidth: '120px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  },
  '&.success': {
    backgroundColor: '#2ed573',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#27ae60',
    },
  },
  '&.error': {
    backgroundColor: '#ff4757',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#ff3f4b',
    },
  }
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#6c5ce7',
      borderRadius: '12px',
    },
    '&:hover fieldset': {
      borderColor: '#5a4ce0',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#5a4ce0',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6c5ce7',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#5a4ce0',
  },
});

const StyledSelect = styled(Select)({
  '& .MuiSelect-select': {
    fontSize: '14px',
    color: '#6c5ce7',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#6c5ce7',
    borderRadius: '12px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#5a4ce0',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#5a4ce0',
  },
  '& .MuiMenuItem-root': {
    '&:hover': {
      backgroundColor: '#6c5ce71a',
    },
  },
});

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    borderBottom: '1px solid rgba(108, 92, 231, 0.1)',
  },
  '& .MuiTableHead-root': {
    '& .MuiTableCell-root': {
      backgroundColor: '#f8f9fa',
      color: '#6c5ce7',
      fontWeight: 600,
    },
  },
}));

const StudentAllotment = () => {
  const theme = useTheme();
  
  // Form state
  const [formData, setFormData] = useState({
    studentName: '',
    className: '',
    section: '',
    rollNumber: '',
    isValid: false
  });
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    studentName: false,
    className: false,
    section: false,
    rollNumber: false
  });
  
  const [students, setStudents] = useState([
    // Sample data - replace with API call
    { id: 'S001', name: 'John Doe', className: '10', section: 'A', rollNumber: '15' },
    { id: 'S002', name: 'Jane Smith', className: '9', section: 'B', rollNumber: '22' },
  ]);
  
  // Remove filtered students state since we're using students directly
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);

  // Available options
  const classes = ['Nursery', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => (i + 1).toString())];
  const sections = ['A', 'B', 'C', 'D', 'E'];

  useEffect(() => {
    // In a real app, fetch students from API
    // fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update validation state
    setValidationErrors(prev => ({
      ...prev,
      [name]: !value.trim()
    }));
    
    // Filter students based on search
    if (name === 'studentName') {
      // No need to set filtered students since we're filtering directly in the UI
    }

    // Update form validity
    const isFormValid = Object.values(validationErrors).every(error => !error);
    setFormData(prev => ({ ...prev, isValid: isFormValid }));
  };

  const handleSelectStudent = (student) => {
    setFormData({
      studentName: student.name,
      className: student.className || '',
      section: student.section || '',
      rollNumber: student.rollNumber || ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    const isFormValid = formData.studentName && formData.className && formData.section && formData.rollNumber;
    if (!isFormValid) {
      setSnackbarMessage('Please fill all required fields!');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Generate new student ID
        const newStudentId = `S${students.length + 1}`;
        const newStudent = {
          id: newStudentId,
          name: formData.studentName,
          className: formData.className,
          section: formData.section,
          rollNumber: formData.rollNumber
        };
        
        // Add new student
        setStudents(prev => [...prev, newStudent]);
        
        setSnackbarMessage('Student added successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setLoading(false);
        
        // Reset form
        setFormData({
          studentName: '',
          className: '',
          section: '',
          rollNumber: '',
          isValid: false
        });
        setValidationErrors({
          studentName: false,
          className: false,
          section: false,
          rollNumber: false
        });
      } catch (error) {
        setLoading(false);
        setSnackbarMessage('Failed to save student. Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    }, 1000);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 4 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        sx={{ 
          mb: 4,
          fontWeight: 'bold',
          color: theme.palette.primary.main,
          textAlign: 'center',
          textTransform: 'uppercase',
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}
      >
        <Add sx={{ fontSize: 32 }} />
        Student Class Allotment
      </Typography>
      
      <StyledPaper elevation={3} sx={{ mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Student Name"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                required
                error={validationErrors.studentName}
                helperText={validationErrors.studentName ? 'Required' : ''}
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel 
                  id="class-label" 
                  sx={{
                    color: '#6c5ce7',
                    '&.Mui-focused': {
                      color: '#5a4ce0',
                    }
                  }}
                >
                  Class
                </InputLabel>
                <StyledSelect
                  labelId="class-label"
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                  label="Class"
                  required
                >
                  {classes.map((cls, index) => (
                    <MenuItem 
                      key={cls} 
                      value={cls}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#6c5ce71a',
                        }
                      }}
                    >
                      {index < 3 ? cls : `Class ${cls}`}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
              
              <FormControl fullWidth margin="normal">
                <InputLabel 
                  id="section-label" 
                  sx={{
                    color: '#6c5ce7',
                    '&.Mui-focused': {
                      color: '#5a4ce0',
                    }
                  }}
                >
                  Section
                </InputLabel>
                <StyledSelect
                  labelId="section-label"
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  label="Section"
                  required
                >
                  {sections.map((sec) => (
                    <MenuItem 
                      key={sec} 
                      value={sec}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#6c5ce71a',
                        }
                      }}
                    >
                      Section {sec}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
              
              <StyledTextField
                fullWidth
                label="Roll Number"
                name="rollNumber"
                type="number"
                value={formData.rollNumber}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                required
                error={validationErrors.rollNumber}
                helperText={validationErrors.rollNumber ? 'Required' : ''}
              />
            </Grid>
            
            <Grid item xs={12}>
              <StyledButton
                type="submit"
                variant="contained"
                disabled={!formData.isValid || loading}
                startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
              >
                Save Allotment
              </StyledButton>
            </Grid>
          </Grid>
        </form>
      </StyledPaper>

      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom 
        sx={{ 
          mb: 3,
          fontWeight: 'bold',
          color: '#6c5ce7',
          textAlign: 'center'
        }}
      >
        Current Student Allotments
      </Typography>

      <StyledPaper>
        <TableContainer>
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Class</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Section</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Roll Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.className}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>
                    <ActionButton 
                      onClick={() => handleSelectStudent(student)}
                      className="success"
                      sx={{
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                        }
                      }}
                    >
                      <Edit sx={{ mr: 1 }} />
                      Edit
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </TableContainer>
      </StyledPaper>
      
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StudentAllotment;