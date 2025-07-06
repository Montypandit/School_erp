import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  CssBaseline, 
  Avatar, 
  InputAdornment, 
  IconButton,
  CircularProgress
} from '@mui/material';
import { 
  Lock as LockIcon, 
  Visibility, 
  VisibilityOff 
} from '@mui/icons-material';



const TeacherLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    showPassword: false,
  });
  const [errors, setErrors] = useState({});
  // loginError state is no longer needed as we'll use toasts
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleClickShowPassword = () => {
    setFormData({
      ...formData,
      showPassword: !formData.showPassword,
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {

      const res = await fetch(`http://localhost:5000/api/auth/get/user/role?email=${formData.email}`, { 
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            });
      
            const data = await res.json();
            if (data.role !== 'teacher') {
              toast.info(`Please login with ${data.role} portal`);
              navigate('/');
              return;
            }



      const response = await fetch('http://localhost:5000/api/auth/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData = { message: errorText || `HTTP error! status: ${response.status}` };
        
        const err = new Error(errorData.message); 
        err.response = { status: response.status, data: errorData }; 
        throw err;
      }

      // If response is OK, the body is the token itself (plain text)
      const token = await response.text();
      sessionStorage.setItem('teacherToken', token);
      sessionStorage.setItem('email', formData.email);
      toast.success('Login successful! Redirecting...');
      navigate('/teacher/home');

    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';

      if (error.response && error.response.data) {
        // Handle errors where server responded with error data (e.g., from response.json() if !response.ok)
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status) { // Fallback if data.message is not there but status is
            errorMessage = `Login failed: ${error.response.data.error || `Server error ${error.response.status}`}`;
        }
      } else if (error.message && (error.message.includes('Failed to fetch') || error.name === 'TypeError')) {
        // Handle network errors (e.g., server down, CORS issues if not configured on server)
        errorMessage = 'Unable to connect to the server. Please check your connection or API configuration.';
      } else if (error.response && error.response.status) {
        // Fallback for other HTTP errors if data wasn't JSON or error.response.data was not set
         errorMessage = `Login failed with status: ${error.response.status}`;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Teacher Sign In
        </Typography>
        
        {/* The Alert component for loginError is removed, toasts will handle this */}
        
        <Paper elevation={3} sx={{ p: 4, mt: 3, width: '100%' }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={formData.showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default TeacherLogin;