// frontend/src/component/admin/GetTeacher.js
import React, { useState } from 'react';
import {
    TextField, Button, CircularProgress, Typography, Paper, Box, Container,
    Card, CardContent, Avatar, Grid, Alert, AlertTitle
} from '@mui/material'; // Removed CardMedia as Avatar is used in the enhanced card
import AdminNavbar from '../admin/AdminNavbar';
import { toast } from 'react-toastify';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import BadgeIcon from '@mui/icons-material/Badge';
import InfoIcon from '@mui/icons-material/Info';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import UpdateTeacherModal from './UpdateTeacherModal'; // Import the modal component
import EditIcon from '@mui/icons-material/Edit'; // For the update button icon

// Helper component for individual detail items in the card
function DetailItem({ icon, label, value, isEmail = false }) {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            mb: 2.5,
            p: 1.5,
            borderRadius: 1,
            transition: 'all 0.2s',
            '&:hover': {
                bgcolor: 'action.hover',
                transform: 'translateX(4px)'
            }
        }}>
            <Box sx={{
                mr: 2,
                mt: 0.5,
                // color: 'primary.main' // Icon color can be set directly on the icon component
            }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="subtitle2" sx={{
                    fontWeight: 600,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '0.7rem',
                    mb: 0.5
                }}>
                    {label}
                </Typography>
                {isEmail ? (
                    <Typography
                        component="a"
                        href={`mailto:${value}`}
                        variant="body1"
                        sx={{
                            fontWeight: 500,
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        {value}
                    </Typography>
                ) : (
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                        {value}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}


const GetTeacher = () => {
    // --- Your existing state variables ---
    // const [searchTerm, setSearchTerm] = useState(''); // Or searchEmpId
    // const [teacherDetails, setTeacherDetails] = useState(null);
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState('');

    // --- Your existing handleSearch function ---
    // const handleSearch = async () => { ... };

    // Ensure these state variables are defined in your component:
    // For example:
    const [searchTerm, setSearchTerm] = useState('');
    const [teacherDetails, setTeacherDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false); // To show "No results" only after a search

    // State for Update Modal
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedTeacherForUpdate, setSelectedTeacherForUpdate] = useState(null);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            toast.error('Please enter an Employee ID.');
            return;
        }
        setLoading(true);
        setError('');
        setTeacherDetails(null);
        setHasSearched(true); // Mark that a search has been attempted

        try {
            const token = sessionStorage.getItem('adminToken');
            if (!token) {
                toast.error('Authentication token not found.');
                setLoading(false);
                return;
            }
            const response = await fetch(`http://localhost:5000/api/teachers/getteacher/${searchTerm}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
                throw new Error(errData.message || errData.error || `Failed to fetch teacher (Status: ${response.status})`);
            }
            const data = await response.json();
            if (data.teachers && data.teachers.length > 0) {
                setTeacherDetails(data.teachers[0]);
            } else if (data.teacher) { // Handle single teacher object if API sends that
                setTeacherDetails(data.teacher);
            } else {
                setTeacherDetails(null); // Explicitly set to null if no teacher found
            }
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handlers for Update Modal
    const handleOpenUpdateModal = (teacher) => {
        setSelectedTeacherForUpdate(teacher);
        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setSelectedTeacherForUpdate(null);
        setIsUpdateModalOpen(false);
    };

    const handleUpdateSuccess = () => {
        handleCloseUpdateModal();
        // Optionally, re-fetch teacher details to show updated info immediately
        if (searchTerm) {
            handleSearch(); // Re-run search for the current searchTerm
        }
    };

    return (
        <>
            <AdminNavbar />
            <Container maxWidth="lg" sx={{ mb: 4, mt:10}}>
                <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: '16px', backgroundColor: 'background.paper' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 3 } }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
                            <PersonSearchIcon sx={{ fontSize: '2rem' }} />
                        </Avatar>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            Find Employee
                        </Typography>
                    </Box>

                    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 3, sm: 4 }, borderRadius: '12px' }}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
                            Enter Employee ID to Search
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'stretch', gap: 2 }}>
                            <TextField
                                label="Employee ID"
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                fullWidth
                                sx={{ flexGrow: 1 }}
                                onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleSearch}
                                disabled={loading}
                                startIcon={loading ? null : <SearchIcon />}
                                sx={{
                                    minWidth: { xs: '100%', sm: '130px' },
                                    py: {sm: '0'}, // Ensure button height matches TextField on sm screens
                                    height: {xs: '48px', sm: '56px'},
                                    fontSize: {xs: '0.9rem', sm: '1rem'},
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    '&:hover': {
                                        boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                            </Button>
                        </Box>
                    </Paper>

                    {loading && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', my: 5, p: 3 }}>
                            <CircularProgress size={60} thickness={4} />
                            <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
                                Searching for Employee...
                            </Typography>
                        </Box>
                    )}

                    {error && !loading && (
                        <Alert severity="error" sx={{ mt: 3, borderRadius: '8px', p: 2 }} icon={<InfoIcon fontSize="inherit" />}>
                            <AlertTitle sx={{ fontWeight: 'bold' }}>Search Error</AlertTitle>
                            {error}
                        </Alert>
                    )}

                    {!loading && !error && teacherDetails && (
                        <Card sx={{
                            mt: 4,
                            borderRadius: '16px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                            overflow: 'visible', // Allow avatar to slightly overflow if needed
                            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
                            }
                        }}>
                            <Box sx={{
                                background: 'linear-gradient(145deg, #673ab7 0%, #3f51b5 100%)', // Deep purple to indigo
                                color: 'white',
                                p: {xs: 3, md: 4},
                                borderTopLeftRadius: '16px',
                                borderTopRightRadius: '16px',
                                textAlign: 'center',
                                position: 'relative'
                            }}>
                                <Avatar
                                    src={teacherDetails.imageUrl || undefined} // Pass undefined if no image to show initials
                                    alt={`${teacherDetails.firstName} ${teacherDetails.LastName}`}
                                    sx={{
                                        width: {xs: 100, md: 140},
                                        height: {xs: 100, md: 140},
                                        margin: '-60px auto 1rem', // Pull avatar up
                                        border: '5px solid white',
                                        boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                                        fontSize: {xs: '3rem', md: '4rem'}, // For initials
                                        bgcolor: 'secondary.main' // Fallback background for Avatar if no image
                                    }}
                                >
                                    {!teacherDetails.imageUrl && `${teacherDetails.firstName?.charAt(0) || ''}${teacherDetails.LastName?.charAt(0) || ''}`}
                                </Avatar>
                                <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    {teacherDetails.firstName} {teacherDetails.LastName}
                                </Typography>
                                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                                    {teacherDetails.designation} &bull; {teacherDetails.department}
                                </Typography>
                                <Button 
                                    variant="outlined" 
                                    color="inherit" 
                                    startIcon={<EditIcon />} 
                                    onClick={() => handleOpenUpdateModal(teacherDetails)} 
                                    sx={{ mt: 1, borderColor: 'rgba(255,255,255,0.5)', color: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' } }}
                                >
                                    Update Employee
                                </Button>
                            </Box>

                            <CardContent sx={{ p: {xs: 2, sm: 3, md: 4} }}>
                                <Grid container spacing={{xs: 2, md: 3.5}}>
                                    <Grid item xs={12} md={6}>
                                        <DetailItem icon={<BadgeIcon color="primary" />} label="Employee ID" value={teacherDetails.empId || 'N/A'} />
                                        {/* <DetailItem icon={<BadgeIcon color="primary" />} label="Teacher ID" value={teacherDetails.teacherId || 'N/A'} /> */}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DetailItem icon={<EmailIcon color="action" />} label="Email" value={teacherDetails.email || 'N/A'} isEmail={!!teacherDetails.email} />
                                        <DetailItem icon={<PhoneIcon color="action" />} label="Phone" value={teacherDetails.phone || 'N/A'} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DetailItem icon={<WorkIcon color="action" />} label="Subject" value={teacherDetails.subject || 'N/A'} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{
                                            display: 'flex', alignItems: 'center', p: 1.5, borderRadius: 1,
                                            bgcolor: teacherDetails.status === 'Active' ? 'success.light' : 'error.light',
                                            color: teacherDetails.status === 'Active' ? 'success.dark' : 'error.dark',
                                            border: `1px solid ${teacherDetails.status === 'Active' ? 'success.main' : 'error.main'}`
                                        }}>
                                            <InfoIcon sx={{ mr: 1.5 }} />
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>Status</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>{teacherDetails.status || 'N/A'}</Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )}

                    {!loading && !error && !teacherDetails && hasSearched && (
                        <Alert severity="info" sx={{ mt: 3, borderRadius: '8px', p: 2 }} icon={<InfoIcon fontSize="inherit" />}>
                            <AlertTitle sx={{ fontWeight: 'bold' }}>No Employee Found</AlertTitle>
                            No Employee details found for Employee ID: <strong>{searchTerm}</strong>. Please verify the ID and try again.
                        </Alert>
                    )}
                </Paper>
            </Container>

            {selectedTeacherForUpdate && (
                <UpdateTeacherModal
                    open={isUpdateModalOpen}
                    onClose={handleCloseUpdateModal}
                    teacherData={selectedTeacherForUpdate}
                    onUpdateSuccess={handleUpdateSuccess}
                />
            )}
        </>
    );
};

export default GetTeacher;