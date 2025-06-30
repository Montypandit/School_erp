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
  useMediaQuery,
  InputAdornment,
  Card,
  CardContent,
  Divider,
  createTheme,
  ThemeProvider,
  alpha
} from '@mui/material';
import { 
  CheckCircle, 
  Error, 
  Add, 
  Refresh, 
  Edit,
  Person,
  Class,
  School,
  FormatListNumbered,
  Search
} from '@mui/icons-material';
import CoordinatorNavbar from './CoordinatorNavbar';

// Custom theme with modern color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
      light: '#6573c3',
      dark: '#2c387e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f50057',
      light: '#f73378',
      dark: '#ab003c',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748',
      secondary: '#718096',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h4: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(63, 81, 181, 0.25)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(63, 81, 181, 0.35)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px 0 rgba(0,0,0,0.1)',
          },
        },
      },
    },
  },
});

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(4, 0),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: '0 12px 48px rgba(63, 81, 181, 0.15)',
    transform: 'translateY(-2px)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: '12px 32px',
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9375rem',
  letterSpacing: '0.5px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
  },
  '&.primary': {
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    },
  },
  '&.secondary': {
    background: `linear-gradient(45deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
    color: theme.palette.secondary.contrastText,
    '&:hover': {
      background: `linear-gradient(45deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
    },
  },
  '& .MuiCircularProgress-root': {
    color: 'inherit',
    marginRight: theme.spacing(1),
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: '6px 16px',
  borderRadius: 20,
  textTransform: 'none',
  fontSize: '0.8125rem',
  fontWeight: 500,
  minWidth: '100px',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows[2],
  },
  '&.success': {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  },
  '&.error': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    marginRight: theme.spacing(0.5),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.9),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 1),
    },
    '&.Mui-focused': {
      backgroundColor: alpha(theme.palette.common.white, 1),
    },
    '& fieldset': {
      borderColor: alpha(theme.palette.primary.main, 0.2),
      transition: theme.transitions.create(['border-color', 'box-shadow']),
    },
    '&:hover fieldset': {
      borderColor: alpha(theme.palette.primary.main, 0.5),
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiInputAdornment-root': {
    color: theme.palette.primary.main,
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    padding: '12.5px 14px',
    fontSize: '0.9375rem',
    color: theme.palette.text.primary,
    '&:focus': {
      backgroundColor: 'transparent',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(theme.palette.primary.main, 0.2),
    transition: theme.transitions.create(['border-color', 'box-shadow']),
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(theme.palette.primary.main, 0.5),
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
  '& .MuiSelect-icon': {
    color: theme.palette.primary.main,
  },
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 650,
  '& .MuiTableCell-root': {
    padding: theme.spacing(1.5, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:first-of-type': {
      paddingLeft: theme.spacing(3),
    },
    '&:last-child': {
      paddingRight: theme.spacing(3),
    },
  },
  '& .MuiTableHead-root': {
    '& .MuiTableCell-root': {
      backgroundColor: alpha(theme.palette.primary.main, 0.03),
      color: theme.palette.primary.main,
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      borderBottom: `2px solid ${theme.palette.primary.main}`,
    },
  },
  '& .MuiTableBody-root': {
    '& tr:last-child td': {
      borderBottom: 'none',
    },
    '& tr:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.02),
    },
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  paddingBottom: theme.spacing(1),
  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  color: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1.5),
  },
}));

/**
 * StudentAllotment Component
 *
 * A page for coordinators to manage student class allotments.
 * It provides a form to add or edit a student's class, section, and roll number.
 * A table displays the list of all currently allotted students, with search and edit functionality.
 * The component is built with Material-UI for a modern look and feel.
 *
 * @component
 */
const StudentAllotment = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Theme for the component
  const componentTheme = createTheme(theme, {
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            padding: '10px 24px',
            borderRadius: 8,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(63, 81, 181, 0.25)',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: '0 4px 12px rgba(63, 81, 181, 0.35)',
            },
          },
        },
      },
    },
  });
  
  /**
   * State for the student allotment form.
   * @type {[Object, function(Object): void]}
   */
  const [formData, setFormData] = useState({
    studentName: '',
    className: '',
    section: '',
    rollNumber: '',
    isValid: false
  });
  
  /**
   * State for tracking validation errors in the form fields.
   * @type {[Object, function(Object): void]}
   */
  const [validationErrors, setValidationErrors] = useState({
    studentName: false,
    className: false,
    section: false,
    rollNumber: false
  });
  
  /**
   * State for the list of allotted students.
   * In a real application, this would be fetched from an API.
   * @type {[Array<Object>, function(Array<Object>): void]}
   */
  const [students, setStudents] = useState([
    // Sample data - replace with API call
    { 
      id: 'S001', 
      name: 'John Doe', 
      className: '10', 
      section: 'A', 
      rollNumber: '15',
      status: 'Active',
      lastUpdated: '2023-05-15'
    },
    { 
      id: 'S002', 
      name: 'Jane Smith', 
      className: '9', 
      section: 'B', 
      rollNumber: '22',
      status: 'Active',
      lastUpdated: '2023-05-16'
    },
  ]);
  
  /** @type {[boolean, function(boolean): void]} State to control the visibility of the snackbar notification. */
  const [openSnackbar, setOpenSnackbar] = useState(false);
  /** @type {[string, function(string): void]} State for the message displayed in the snackbar. */
  const [snackbarMessage, setSnackbarMessage] = useState('');
  /** @type {['success'|'error'|'info'|'warning', function('success'|'error'|'info'|'warning'): void]} State for the severity/color of the snackbar. */
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  /** @type {[boolean, function(boolean): void]} State to indicate when an API call (or simulation) is in progress. */
  const [loading, setLoading] = useState(false);
  /** @type {[string, function(string): void]} State for the search term used to filter the students table. */
  const [searchTerm, setSearchTerm] = useState('');

  // Available options
  const classes = ['Nursery', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => (i + 1).toString())];
  const sections = ['A', 'B', 'C', 'D', 'E'];
  
  /**
   * Filters the list of students based on the search term.
   * @type {Array<Object>}
   */
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.includes(searchTerm)
  );

  /**
   * Effect hook for fetching initial data. Currently commented out.
   * In a real application, this would fetch the list of students from the backend.
   */
  useEffect(() => {
    // In a real app, fetch students from API
    // fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    /**
     * Handles changes in form input fields.
     * Updates the form data state and corresponding validation state.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
     */
    
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

  /**
   * Populates the form with the details of a selected student from the table,
   * allowing the coordinator to edit their allotment.
   * @param {Object} student - The student object to be edited.
   */
  const handleSelectStudent = (student) => {
    setFormData({
      studentName: student.name,
      className: student.className || '',
      section: student.section || '',
      rollNumber: student.rollNumber || ''
    });
  };

  /**
   * Handles the form submission for allotting a class to a student.
   * Validates the form, shows a loading indicator, and simulates an API call.
   * On success, it adds the new student to the list and shows a success message.
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   */
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

  /**
   * Closes the snackbar notification.
   */
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <ThemeProvider theme={componentTheme}>
      <CoordinatorNavbar />
      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              background: 'linear-gradient(45deg, #3f51b5 30%, #2196F3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
              '& .MuiSvgIcon-root': {
                fontSize: '2.5rem',
              }
            }}
          >
            <School />
            Student Class Allotment
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage student class assignments and sections
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={5} lg={4}>
            <StyledPaper elevation={0}>
              <SectionTitle variant="h5">
                <Person />
                Student Details
              </SectionTitle>
              
              <form onSubmit={handleSubmit}>
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
                  helperText={validationErrors.studentName ? 'Student name is required' : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="class-label">Class</InputLabel>
                  <StyledSelect
                    labelId="class-label"
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    label="Class"
                    error={validationErrors.className}
                    startAdornment={
                      <InputAdornment position="start">
                        <Class color="primary" />
                      </InputAdornment>
                    }
                  >
                    {classes.map((cls, index) => (
                      <MenuItem key={cls} value={cls}>
                        {index < 3 ? cls : `Class ${cls}`}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                  {validationErrors.className && (
                    <Typography variant="caption" color="error">
                      Class is required
                    </Typography>
                  )}
                </FormControl>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth margin="normal" required>
                      <InputLabel id="section-label">Section</InputLabel>
                      <StyledSelect
                        labelId="section-label"
                        name="section"
                        value={formData.section}
                        onChange={handleInputChange}
                        label="Section"
                        error={validationErrors.section}
                      >
                        {sections.map((sec) => (
                          <MenuItem key={sec} value={sec}>
                            Section {sec}
                          </MenuItem>
                        ))}
                      </StyledSelect>
                      {validationErrors.section && (
                        <Typography variant="caption" color="error">
                          Section is required
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
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
                      helperText={validationErrors.rollNumber ? 'Roll number is required' : ''}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FormatListNumbered color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                  <StyledButton
                    type="submit"
                    variant="contained"
                    className="primary"
                    disabled={loading}
                    fullWidth={isMobile}
                    startIcon={loading ? <CircularProgress size={20} /> : <Add />}
                  >
                    {loading ? 'Processing...' : 'Allot Class'}
                  </StyledButton>
                  
                  <StyledButton
                    variant="outlined"
                    onClick={() => {
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
                    }}
                    fullWidth={isMobile}
                  >
                    <Refresh />
                    Reset
                  </StyledButton>
                </Box>
              </form>
            </StyledPaper>
          </Grid>
          
          <Grid item xs={12} md={7} lg={8}>
            <StyledPaper elevation={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <SectionTitle variant="h5" sx={{ mb: 0 }}>
                  <Class />
                  Allotted Students
                </SectionTitle>
                <StyledTextField
                  variant="outlined"
                  size="small"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: isMobile ? '100%' : 300 }}
                />
              </Box>
              
              <TableContainer>
                <StyledTable>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell>Section</TableCell>
                      <TableCell>Roll No.</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id} hover>
                          <TableCell>{student.id}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {student.name}
                            </Typography>
                          </TableCell>
                          <TableCell>Class {student.className}</TableCell>
                          <TableCell>Sec {student.section}</TableCell>
                          <TableCell>{student.rollNumber}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <ActionButton
                                variant="contained"
                                size="small"
                                className="success"
                                startIcon={<Edit />}
                                onClick={() => handleSelectStudent(student)}
                              >
                                Edit
                              </ActionButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <School color="disabled" sx={{ fontSize: 48, mb: 1 }} />
                            <Typography variant="body1" color="textSecondary">
                              No students found. Add a new student to get started.
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </StyledTable>
              </TableContainer>
            </StyledPaper>
          </Grid>
        </Grid>
        
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbarSeverity}
            elevation={6}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default StudentAllotment;