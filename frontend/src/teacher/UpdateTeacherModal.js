// frontend/src/component/admin/UpdateTeacherModal.js
import React, { useState, useEffect } from 'react';
import {
    Modal, Box, Typography, TextField, Button, Grid, CircularProgress, Avatar,
    FormControl, InputLabel, Select, MenuItem, IconButton
} from '@mui/material';
import { toast } from 'react-toastify';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: '80%', md: '700px' },
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: { xs: 2, sm: 3, md: 4 },
    borderRadius: '12px',
};

const UpdateTeacherModal = ({ open, onClose, teacherData, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (teacherData) {
            setFormData({
                teacherId: teacherData.teacherId || '',
                email: teacherData.email || '',
                password:teacherData.password || '', 
                imageUrl: teacherData.imageUrl || '',
                firstName: teacherData.firstName || '',
                LastName: teacherData.LastName || '',
                phone: teacherData.phone || '',
                city: teacherData.city || '',
                state: teacherData.state || '',
                country: teacherData.country || '',
                pincode: teacherData.pincode || '',
                village: teacherData.village || '',
                aadhar: teacherData.aadhar || '',
                designation: teacherData.designation || '',
                qualification: teacherData.qualification || '',
                department: teacherData.department || '',
                salary: teacherData.salary || '',
                status: teacherData.status || 'active', // Default to active if not present
            });
            setPreviewImage(teacherData.imageUrl || null);
        } else {
            // Reset form if no teacher data (e.g., modal closed and reopened without data)
            setFormData({});
            setPreviewImage(null);
        }
    }, [teacherData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, imageFile: file, imageUrl: '' })); // Store file, clear imageUrl if new one is uploaded
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Create a plain object for the JSON payload, excluding the image file
        const dataToSubmit = { ...formData };
        delete dataToSubmit.imageFile; // We can't send the file as JSON

        // If password is empty, do not send it, so the backend doesn't update it
        if (!dataToSubmit.password) {
            delete dataToSubmit.password;
        }

        try {
            const token = sessionStorage.getItem('adminToken');
            if (!token) {
                toast.error('Authentication token not found.');
                setLoading(false);
                return;
            }

            const response = await fetch(`http://localhost:5000/api/teachers/update/teacher/${teacherData.empId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', // Set content type to JSON
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(dataToSubmit), // Stringify the data
            });

            if (!response.ok) {
                // Try to get text error message from server if not JSON
                const errorText = await response.text(); 
                // Attempt to parse as JSON in case the server does send a JSON error sometimes
                let errorData = null;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    // If parsing fails, errorText is likely the direct message
                }
                throw new Error(errorData?.message || errorData?.error || errorText || 'Failed to update teacher');
            }

            const responseData = await response.json(); 

            toast.success(responseData.message || 'Teacher updated successfully!');
            if(onUpdateSuccess) onUpdateSuccess();
            onClose(); // Close modal on success
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.message || 'An error occurred while updating the teacher.');
        } finally {
            setLoading(false);
        }
    };

    if (!teacherData) return null; // Don't render modal content if no teacher data

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="update-teacher-modal-title"
            aria-describedby="update-teacher-modal-description"
        >
            <Box sx={modalStyle}>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography id="update-teacher-modal-title" variant="h5" component="h2" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
                    Update Teacher Details
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar
                                src={previewImage || formData.imageUrl}
                                sx={{ width: 120, height: 120, mb: 2, border: '2px solid lightgray' }}
                            />
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<PhotoCamera />}
                            >
                                Change Photo
                                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                            </Button>
                        </Grid>

                        {/* Personal Information */}
                        <Grid item xs={12} sm={6}>
                            <TextField name="firstName" label="First Name" value={formData.firstName || ''} onChange={handleChange} fullWidth required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="LastName" label="Last Name" value={formData.LastName || ''} onChange={handleChange} fullWidth required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="email" label="Email" type="email" value={formData.email || ''} onChange={handleChange} fullWidth required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="phone" label="Phone Number" value={formData.phone || ''} onChange={handleChange} fullWidth required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="password" label="New Password (leave blank to keep current)" type="password" value={formData.password || ''} onChange={handleChange} fullWidth />
                        </Grid>
                         <Grid item xs={12} sm={6}>
                            <TextField name="teacherId" label="Teacher ID (Employee ID)" value={formData.teacherId || ''} onChange={handleChange} fullWidth required disabled /* Usually empId is not editable */ />
                        </Grid>

                        {/* Address Information */}
                        <Grid item xs={12} sm={6}>
                            <TextField name="village" label="Village/Street" value={formData.village || ''} onChange={handleChange} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="city" label="City" value={formData.city || ''} onChange={handleChange} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField name="pincode" label="Pincode" value={formData.pincode || ''} onChange={handleChange} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField name="state" label="State" value={formData.state || ''} onChange={handleChange} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField name="country" label="Country" value={formData.country || ''} onChange={handleChange} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="aadhar" label="Aadhar Number" value={formData.aadhar || ''} onChange={handleChange} fullWidth />
                        </Grid>

                        {/* Professional Information */}
                        <Grid item xs={12} sm={6}>
                            <TextField name="designation" label="Designation" value={formData.designation || ''} onChange={handleChange} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="qualification" label="Qualification" value={formData.qualification || ''} onChange={handleChange} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="department" label="Department" value={formData.department || ''} onChange={handleChange} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="salary" label="Salary" type="number" value={formData.salary || ''} onChange={handleChange} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    name="status"
                                    value={formData.status || 'active'}
                                    label="Status"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="inactive">Inactive</MenuItem>
                                    <MenuItem value="on_leave">On Leave</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button onClick={onClose} variant="outlined" color="secondary" disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary" disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default UpdateTeacherModal;
