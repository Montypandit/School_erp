import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CoordinatorNavbar from './CoordinatorNavbar';
import './StudentListPage.css'; // create CSS for styles

const StudentListPage = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [studentStatus, setStudentStatus] = useState([]);


    const studentMap = React.useMemo(() => {
        const map = new Map();
        studentStatus.forEach(item => {
            map.set(item.admissionId, item.status);
        });
        return map;
    }, [studentStatus]);

    useEffect(() => {


        const fetchStudentStatuses = async () => {
            setLoading(true);
            try {
                const storedData = sessionStorage.getItem('principalToken') || sessionStorage.getItem('coordinatorToken');
                const token = storedData ? JSON.parse(storedData).token : null;
                if (!token) {
                    toast.info('Please login to continue')
                    navigate('/');
                    return;
                }

                const response = await fetch('https://school-erp-1-exji.onrender.com/api/student/status/get/all/student/status', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch student statuses.');
                }

                const data = await response.json();
                setStudentStatus(data.data || []);
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };








        const fetchStudents = async () => {
            setLoading(true);
            try {
                const storedData = sessionStorage.getItem('coordinatorToken');
                const token = storedData ? JSON.parse(storedData).token : null;
                if (!token) {
                    toast.info('Please login to continue');
                    navigate('/coordinator/login');
                    return;
                }

                const res = await fetch('https://school-erp-1-exji.onrender.com/api/final/admission/get/all/admissions', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch student data');
                }

                const data = await res.json();
                const studentData = data.data || [];
                setStudents(studentData);
                setFilteredStudents(studentData);
            } catch (error) {
                console.error('Error fetching students:', error);
                toast.error(error.message || 'Error fetching student data.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentStatuses();
        fetchStudents();
    }, [navigate]);


    useEffect(() => {
        const lowercasedQuery = query.toLowerCase();
        const filtered = students.filter(student =>
            (student.name && student.name.toLowerCase().includes(lowercasedQuery)) ||
            (student.admissionId && student.admissionId.toLowerCase().includes(lowercasedQuery)) ||
            (student.fatherName && student.fatherName.toLowerCase().includes(lowercasedQuery))
        );
        setFilteredStudents(filtered);
    }, [query, students]);

    const handleUpdateDetails = (admissionId) => {
        navigate(`/coordinator/update/student/${admissionId}`);
    };

    const handleFees = (admissionId) => {
        navigate(`/coordinator/monthly-fees/${admissionId}`);
    };

    return (
        <>
            <CoordinatorNavbar />
            <div className="student-container">
                <div className="student-card">
                    <h2>Student List</h2>
                    <p>View and manage all admitted students.</p>

                    <input
                        type="text"
                        placeholder="Search by Name, Admission ID, or Father's Name"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-input"
                    />

                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : (
                        <div className="student-table">
                            <div className="table-header">
                                <div>Admission ID</div>
                                <div>Name</div>
                                <div>Father's Name</div>
                                <div>Class</div>
                                <div>Actions</div>
                            </div>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.filter(student =>( studentMap.get(student.admissionId) !== 'Inactive') ).map(student => (
                                    <div className="table-row" key={student.admissionId || student._id}>
                                        <div>{student.admissionId}</div>
                                        <div>{student.name}</div>
                                        <div>{student.fatherName}</div>
                                        <div>{student.class}</div>
                                        <div className="actions">
                                            <button onClick={() => handleUpdateDetails(student.admissionId)}>Update</button>
                                            <button onClick={() => handleFees(student.admissionId)}>Fees</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-data">No matching students found.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default StudentListPage;
