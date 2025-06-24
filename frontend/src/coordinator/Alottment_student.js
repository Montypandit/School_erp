import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TablePagination,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  FormHelperText,
  InputAdornment,
  ListItemIcon
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import {
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Class as ClassIcon,
  ListAlt as ListAltIcon,
  School as SchoolIcon,
  Search as SearchIcon,
  AddCircleOutline as AddCircleOutlineIcon
} from '@mui/icons-material';

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(6),
  '& .section-title': {
    marginBottom: theme.spacing(3),
    paddingBottom: theme.spacing(1),
    borderBottom: `2px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: theme.spacing(1),
    }
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-2px)',
  },
  '& .MuiCardHeader-root': {
    padding: theme.spacing(2, 3),
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    '& .MuiCardHeader-title': {
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      '& svg': {
        marginRight: theme.spacing(1),
      }
    }
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(3),
  }
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 800,
  '& .MuiTableHead-root': {
    '& th': {
      backgroundColor: theme.palette.grey[100],
      color: theme.palette.text.primary,
      fontWeight: 600,
      fontSize: '0.9rem',
      borderBottom: `2px solid ${theme.palette.divider}`,
    }
  },
  '& .MuiTableBody-root': {
    '& tr': {
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      }
    }
  },
  '& .MuiTableCell-root': {
    padding: theme.spacing(1.5, 2),
  }
}));

const FormRow = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(0.8, 2),
  '&.MuiButton-contained': {
    boxShadow: 'none',
    '&:hover': {
      boxShadow: theme.shadows[2],
    }
  }
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 500,
  borderRadius: 4,
  '&.MuiChip-colorSuccess': {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  },
  '&.MuiChip-colorWarning': {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  },
  '&.MuiChip-colorError': {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.paper,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderWidth: 1,
    },
  },
}));

const StudentAllotment = () => {
  // State management
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Form state
  const [formData, setFormData] = useState({
    classId: '',
    sectionId: '',
    rollNumber: '',
    studentId: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace with actual API endpoints
        const [studentsRes, classesRes] = await Promise.all([
          axios.get('/api/students/unassigned'),
          axios.get('/api/classes')
        ]);
        
        setStudents(studentsRes.data);
        setClasses(classesRes.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch sections when class is selected
  useEffect(() => {
    const fetchSections = async () => {
      if (formData.classId) {
        try {
          const res = await axios.get(`/api/classes/${formData.classId}/sections`);
          setSections(res.data);
        } catch (err) {
          setError('Failed to fetch sections');
          console.error('Error fetching sections:', err);
        }
      } else {
        setSections([]);
      }
    };

    fetchSections();
  }, [formData.classId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.classId || !formData.sectionId || !formData.rollNumber || !formData.studentId) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      // Replace with actual API endpoint
      await axios.post('/api/students/allot', formData);
      
      // Update local state
      const updatedStudents = students.filter(s => s.id !== formData.studentId);
      setStudents(updatedStudents);
      
      setSuccess('Student allotted successfully!');
      resetForm();
    } catch (err) {
      setError('Failed to allot student. Please try again.');
      console.error('Error allotting student:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      classId: '',
      sectionId: '',
      rollNumber: '',
      studentId: ''
    });
    setEditingId(null);
  };

  // Handle edit
  const handleEdit = (student) => {
    setFormData({
      classId: student.classId,
      sectionId: student.sectionId,
      rollNumber: student.rollNumber,
      studentId: student.id
    });
    setEditingId(student.id);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  // Add a function to handle class section selection
  const handleClassSectionSelect = (classId, sectionId) => {
    setFormData(prev => ({
      ...prev,
      classId,
      sectionId,
      // Clear roll number when changing class/section
      rollNumber: ''
    }));
  };

  // Generate class-section options
  const classSectionOptions = [];
  classes.forEach(cls => {
    // Add class option
    classSectionOptions.push({
      type: 'class',
      id: `class-${cls.id}`,
      classId: cls.id,
      label: cls.name,
      isHeader: true
    });
    
    // Add sections under each class
    const classSections = sections.filter(s => s.classId === cls.id);
    classSections.forEach(section => {
      classSectionOptions.push({
        type: 'section',
        id: `section-${section.id}`,
        classId: cls.id,
        sectionId: section.id,
        label: `   └─ ${section.name}`,
        isHeader: false
      });
    });
  });

  return (
    <StyledContainer maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" className="section-title">
          <SchoolIcon fontSize="large" />
          Student Class & Roll Number Allotment
        </Typography>
      </Box>
      
      {/* Allotment Form */}
      <StyledCard elevation={2}>
        <CardHeader 
          title={
            <Box display="flex" alignItems="center">
              <ClassIcon />
              <span>Student Class & Section Allotment</span>
            </Box>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <FormRow item xs={12} sm={6} md={4}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="student-select-label">Select Student</InputLabel>
                  <Select
                    labelId="student-select-label"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    label="Select Student"
                    required
                    disabled={loading}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 250,
                        },
                      },
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <PersonAddIcon color="action" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="" disabled>
                      <em>Select a student</em>
                    </MenuItem>
                    {students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {`${student.name} (${student.admissionNumber})`}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Select student to assign class & section</FormHelperText>
                </FormControl>
              </FormRow>
              
              <FormRow item xs={12} sm={6} md={5}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="class-section-label">Select Class & Section</InputLabel>
                  <Select
                    labelId="class-section-label"
                    value={`${formData.classId || ''}-${formData.sectionId || ''}`}
                    label="Select Class & Section"
                    required
                    disabled={loading || !formData.studentId}
                    onChange={(e) => {
                      const [classId, sectionId] = e.target.value.split('-');
                      if (classId && sectionId) {
                        handleClassSectionSelect(classId, sectionId);
                      }
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <ClassIcon color="action" />
                      </InputAdornment>
                    }
                    renderValue={(selected) => {
                      if (!selected || selected === '-') return 'Select class & section';
                      const [classId, sectionId] = selected.split('-');
                      const cls = classes.find(c => c.id === classId);
                      const section = sections.find(s => s.id === sectionId);
                      return cls && section ? `${cls.name} - ${section.name}` : 'Select class & section';
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select a class and section</em>
                    </MenuItem>
                    {classSectionOptions.map((option) => {
                      if (option.type === 'class') {
                        return (
                          <MenuItem 
                            key={option.id} 
                            value={`${option.classId}-`}
                            disabled
                            sx={{
                              fontWeight: 600,
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                cursor: 'default'
                              }
                            }}
                          >
                            {option.label}
                          </MenuItem>
                        );
                      }
                      return (
                        <MenuItem 
                          key={option.id} 
                          value={`${option.classId}-${option.sectionId}`}
                          sx={{
                            paddingLeft: 4,
                            '&:hover': {
                              backgroundColor: 'rgba(25, 118, 210, 0.08)'
                            }
                          }}
                        >
                          {option.label}
                        </MenuItem>
                      );
                    })}
                    <Divider sx={{ my: 1 }} />
                    <MenuItem 
                      onClick={() => {
                        // Handle add new class/section
                        console.log('Add new class/section clicked');
                      }}
                      sx={{
                        color: 'primary.main',
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.04)'
                        }
                      }}
                    >
                      <ListItemIcon>
                        <AddCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      Add New Class/Section
                    </MenuItem>
                  </Select>
                  <FormHelperText>Select or add class and section</FormHelperText>
                </FormControl>
              </FormRow>
              
              <FormRow item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined" size="small">
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="rollNumber"
                    label="Roll Number"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    type="number"
                    inputProps={{ 
                      min: 1,
                      step: 1,
                      pattern: '\d*'
                    }}
                    required
                    disabled={loading || !formData.sectionId}
                    helperText={formData.sectionId ? "Enter unique roll number" : "Select class & section first"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ListAltIcon 
                            color={formData.sectionId ? "action" : "disabled"} 
                          />
                        </InputAdornment>
                      ),
                      endAdornment: formData.rollNumber && (
                        <InputAdornment position="end">
                          <Chip 
                            label="Check" 
                            size="small" 
                            color="primary"
                            variant="outlined"
                            onClick={() => {
                              // Add roll number availability check logic
                              console.log('Check roll number availability');
                            }}
                            sx={{ cursor: 'pointer' }}
                          />
                        </InputAdornment>
                      )
                    }}
                  />
                </FormControl>
              </FormRow>
              
              <FormRow item xs={12} md={2} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading || !formData.studentId || !formData.classId || !formData.sectionId || !formData.rollNumber}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : editingId ? <SaveIcon /> : <PersonAddIcon />}
                  size="large"
                  sx={{
                    height: '40px',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 2,
                    },
                  }}
                >
                  {loading ? 'Processing...' : editingId ? 'Update' : 'Allot'}
                </Button>
                {editingId && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={resetForm}
                    fullWidth
                    sx={{
                      mt: 1,
                      height: '36px',
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 500,
                    }}
                    startIcon={<CancelIcon />}
                  >
                    Cancel
                  </Button>
                )}
              </FormRow>
            </Grid>
          </form>
        </CardContent>
      </StyledCard>

      {/* Students Table */}
      <StyledCard elevation={2}>
        <CardHeader 
          title={
            <Box display="flex" alignItems="center">
              <ListAltIcon />
              <span>Allotted Students</span>
            </Box>
          }
          action={
            <SearchField
              variant="outlined"
              size="small"
              placeholder="Search students..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300, mb: 2 }}
            />
          }
        />
        <CardContent>
          <TableContainer>
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell>Admission No.</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Roll No.</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <CircularProgress size={40} />
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                          Loading student data...
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <SchoolIcon fontSize="large" color="action" sx={{ mb: 1 }} />
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                          No Students Found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {formData.studentId ? 'No students match your search criteria' : 'No students have been allotted yet'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  students
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((student) => (
                      <TableRow 
                        key={student.id} 
                        hover 
                        sx={{ '&:last-child td': { borderBottom: 0 } }}
                      >
                        <TableCell>
                          <Typography variant="subtitle2">
                            {student.admissionNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2">
                              {student.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {student.email || 'No email provided'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {student.className ? (
                            <Chip 
                              label={student.className} 
                              size="small" 
                              color="primary"
                              variant="outlined"
                            />
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              Not allotted
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {student.sectionName ? (
                            <Chip 
                              label={student.sectionName} 
                              size="small" 
                              color="secondary"
                              variant="outlined"
                            />
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              -
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {student.rollNumber ? (
                            <Box 
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                fontWeight: 600,
                              }}
                            >
                              {student.rollNumber}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              -
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusChip 
                            label={student.status || 'Active'} 
                            color={
                              student.status === 'Active' ? 'success' : 
                              student.status === 'Inactive' ? 'error' : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Edit student details">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleEdit(student)}
                                sx={{
                                  backgroundColor: 'primary.light',
                                  '&:hover': {
                                    backgroundColor: 'primary.main',
                                    color: 'white'
                                  }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </StyledTable>
          </TableContainer>
          
          {students.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={students.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                '& .MuiTablePagination-toolbar': {
                  paddingLeft: 0,
                },
                '& .MuiTablePagination-actions': {
                  marginLeft: 1,
                },
              }}
            />
          )}
        </CardContent>
      </StyledCard>

      {/* Snackbars for feedback */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default StudentAllotment;