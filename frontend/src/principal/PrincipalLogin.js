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



const CoordinatorLogin = () => {
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

      const res = await fetch(`http://localhost:5000/api/auth/get/user/role/${formData.email}`, { // Pass email as query parameter
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (data.role !== 'principal') {
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
      sessionStorage.setItem('principalToken', token);
      sessionStorage.setItem('email',formData.email)
      toast.success('Login successful! Redirecting...');
      navigate('/principal/home');

    } catch (error) {
      console.error('Login error:', error);

      toast.error('Error to login!!!');
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
          Principal Sign In
        </Typography>

        {/* The Alert component for loginError is removed, toasts will handle this */}

        <Paper elevation={3} sx={{ p: 4, mt: 3, width: '100%' }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Box mb={2}>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              {errors.email && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.email}</span>}
            </Box>

            <Box mb={2}>
              <label>Password</label>
              <Box display="flex" alignItems="center" position="relative">
                <input
                  type={formData.showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <span
                  onClick={handleClickShowPassword}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                >
                  {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                </span>
              </Box>
              {errors.password && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.password}</span>}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CoordinatorLogin;