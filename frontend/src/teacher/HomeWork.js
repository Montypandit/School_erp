import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  Grid,
  Box,
  Snackbar,
  Alert,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  useTheme,
  alpha,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Class as ClassIcon,
  Category as CategoryIcon,
  Event as EventIcon,
  Person as PersonIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
  InfoOutlined as InfoOutlinedIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import axios from 'axios';

// Mock data - replace with API calls in production
const CLASSES = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const SECTIONS = ['A', 'B', 'C', 'D'];
const SUBJECTS = [
  'Mathematics', 'Science', 'English', 'Hindi', 'Social Studies',
  'Computer Science', 'Physics', 'Chemistry', 'Biology', 'History',
  'Geography', 'Economics', 'Business Studies', 'Accountancy'
];

const HomeWork = () => {
  const [formData, setFormData] = useState({
    className: '',
    section: '',
    subject: '',
    homeworkDetails: '',
    dueDate: null
  });
  const [filter, setFilter] = useState({
    className: '',
    section: ''
  });
  const [students, setStudents] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilter = {
      ...filter,
      [name]: value
    };
    setFilter(newFilter);
    
    // Reset section if class changes
    if (name === 'className' && value !== filter.className) {
      setFormData(prev => ({
        ...prev,
        section: ''
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dueDate: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you would make an API call here
      // await axios.post('/api/homework', formData);
      
      setSnackbarMessage('Homework assigned successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      // Reset form
      setFormData({
        className: filter.className,
        section: filter.section,
        subject: '',
        homeworkDetails: '',
        dueDate: null
      });
    } catch (error) {
      console.error('Error assigning homework:', error);
      setSnackbarMessage('Failed to assign homework. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // In a real app, you would fetch students based on the selected class and section
  useEffect(() => {
    if (filter.className && filter.section) {
      // Simulate API call to fetch students
      // const fetchStudents = async () => {
      //   const response = await axios.get(`/api/students?class=${filter.className}&section=${filter.section}`);
      //   setStudents(response.data);
      // };
      // fetchStudents();
      
      // Mock data for demonstration
      setStudents(Array(5).fill().map((_, i) => ({
        admissionId: `ADM${Math.floor(1000 + Math.random() * 9000)}`,
        name: `Student ${i + 1}`
      })));
    }
  }, [filter.className, filter.section]);

  const theme = useTheme();
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ 
          mb: 4,
          textAlign: 'center',
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          p: 3,
          borderRadius: 2,
          boxShadow: theme.shadows[4]
        }}>
          <Typography variant="h3" component="h1" sx={{ 
            fontWeight: 700,
            letterSpacing: '0.5px',
            mb: 1
          }}>
            Homework Assignment
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Create and manage homework assignments for your students
          </Typography>
        </Box>
        
        <Grid container spacing={3} alignItems="stretch">
          {/* Filter Section */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <Box sx={{ 
                bgcolor: 'primary.main', 
                color: 'white', 
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <ClassIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Filter Students</Typography>
              </Box>
              <Box sx={{ p: 3, flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="class-label">Class</InputLabel>
                    <Select
                      labelId="class-label"
                      id="className"
                      name="className"
                      value={filter.className}
                      onChange={handleFilterChange}
                      label="Class"
                      fullWidth
                    >
                      {CLASSES.map((cls) => (
                        <MenuItem key={cls} value={cls}>
                          {cls}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="section-label">Section</InputLabel>
                    <Select
                      labelId="section-label"
                      id="section"
                      name="section"
                      value={filter.section}
                      onChange={handleFilterChange}
                      label="Section"
                      disabled={!filter.className}
                      fullWidth
                    >
                      {SECTIONS.map((sec) => (
                        <MenuItem key={sec} value={sec}>
                          {sec}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              {students.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ 
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}>
                    <PersonIcon fontSize="small" />
                    Students in {filter.className}-{filter.section}:
                  </Typography>
                  <List dense sx={{ 
                    maxHeight: 200, 
                    overflow: 'auto', 
                    bgcolor: alpha(theme.palette.primary.light, 0.05),
                    borderRadius: 1,
                    p: 1
                  }}>
                    {students.map((student) => (
                      <ListItem 
                        key={student.admissionId} 
                        sx={{
                          p: 0.5,
                          mb: 0.5,
                          borderRadius: 1,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.05)
                          }
                        }}
                      >
                        <ListItemAvatar sx={{ minWidth: 32 }}>
                          <Avatar 
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              bgcolor: theme.palette.primary.main,
                              fontSize: '0.75rem'
                            }}
                          >
                            {student.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {student.name}
                            </Typography>
                          } 
                          secondary={
                            <Chip 
                              label={student.admissionId} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                height: 18,
                                fontSize: '0.65rem',
                                mt: 0.5
                              }}
                            />
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              </Box>
            </Paper>
          </Grid>
          
          {/* Homework Form */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={3} 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <Box sx={{ 
                bgcolor: 'primary.main', 
                color: 'white', 
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <AssignmentIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Assign Homework</Typography>
              </Box>
              <Box sx={{ p: 3 }}>
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="subject-label" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CategoryIcon fontSize="small" />
                        Subject
                      </InputLabel>
                      <Select
                        labelId="subject-label"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CategoryIcon fontSize="small" />
                            Subject
                          </Box>
                        }
                        required
                        disabled={!filter.className || !filter.section}
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'divider',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        {SUBJECTS.map((subj) => (
                          <MenuItem key={subj} value={subj}>
                            {subj}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <DatePicker
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EventIcon fontSize="small" />
                            Due Date
                          </Box>
                        }
                        value={formData.dueDate}
                        onChange={handleDateChange}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            fullWidth 
                            required 
                            sx={{
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'divider',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                              },
                            }}
                          />
                        )}
                        minDate={new Date()}
                        disabled={!filter.className || !filter.section}
                        inputFormat="dd/MM/yyyy"
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      fullWidth
                      multiline
                      rows={6}
                      name="homeworkDetails"
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AssignmentIcon fontSize="small" />
                          Homework Details
                        </Box>
                      }
                      placeholder="Enter homework details here..."
                      value={formData.homeworkDetails}
                      onChange={handleInputChange}
                      required
                      disabled={!filter.className || !filter.section}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          display: 'flex',
                          alignItems: 'center',
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      disabled={!filter.className || !filter.section || !formData.subject || !formData.homeworkDetails || !formData.dueDate}
                      startIcon={<AssignmentIcon />}
                      sx={{
                        mt: 2,
                        py: 1.5,
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        textTransform: 'none',
                        borderRadius: 2,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[4],
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                        },
                        '&.Mui-disabled': {
                          background: theme.palette.grey[300],
                          color: theme.palette.grey[500],
                        }
                      }}
                    >
                      Assign Homework
                    </Button>
                  </Grid>
                </Grid>
              </form>
              </Box>
              <Box sx={{ 
                p: 2, 
                bgcolor: alpha(theme.palette.primary.light, 0.1),
                borderTop: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <InfoOutlinedIcon color="primary" fontSize="small" />
                <Typography variant="caption" color="text.secondary">
                  Homework will be assigned to all students in {filter.className || 'selected class'} - {filter.section || 'section'}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            '& .MuiPaper-root': {
              borderRadius: 2,
              boxShadow: theme.shadows[6],
              minWidth: 300,
            }
          }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbarSeverity} 
            sx={{ 
              width: '100%',
              alignItems: 'center',
              '& .MuiAlert-message': {
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }
            }}
            iconMapping={{
              success: <CheckCircleOutlineIcon fontSize="inherit" />,
              error: <ErrorOutlineIcon fontSize="inherit" />
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default HomeWork;