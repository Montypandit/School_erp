import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PrincipalNavbar from './PrincipalNavbar';
import { toast } from 'react-toastify';

const StudentPromotionPage = () => {
    const { admissionId } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [allocation, setAllocation] = useState(null);
    const [promotion, setPromotion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updateForm, setUpdateForm] = useState({
        newClass: '',
        newSection: ''
    });

    // Fetch all info
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = sessionStorage.getItem('principalToken');
                if (!token) {
                    toast.error('Please login as principal.');
                    navigate('/');
                    return;
                }

                // Fetch student admission info
                const resStudent = await fetch(`http://localhost:5000/api/final/admission/get/student/${admissionId}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!resStudent.ok) throw new Error('Student not found');
                const studentData = await resStudent.json();

                // Fetch section info
                const resAllocation = await fetch(`http://localhost:5000/api/allocation/get/student/${admissionId}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                let allocationData = null;
                if (resAllocation.ok) {
                    allocationData = await resAllocation.json();
                }

                // Fetch promotion info
                const resPromotion = await fetch(`http://localhost:5000/api/promoted/students/get/promoted/student/${admissionId}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                let promotionData = null;
                if (resPromotion.ok) {
                    promotionData = await resPromotion.json();
                }

                setStudent(studentData.data);
                setAllocation(allocationData?.data || null);
                setPromotion(promotionData?.data || null);

                setUpdateForm({
                    newClass: promotionData?.data?.currentClass || allocationData?.data?.class || studentData.data.class || '',
                    newSection: promotionData?.data?.currentSection || allocationData?.data?.section || '',
                });
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [admissionId, navigate]);

    // Handle update
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = sessionStorage.getItem('principalToken');
            if (!token) throw new Error('Please login as principal.');

            const payload = {
                admissionId,
                newClass: updateForm.newClass,
                newSection: updateForm.newSection
            };

            const res = await fetch(`http://localhost:5000/api/principal/student-promotion/update/${admissionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to update promotion');
            }

            toast.success('Student promoted successfully!');
            navigate('/principal/student-management');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div>
            <PrincipalNavbar />
            <div className="max-w-3xl mx-auto mt-8 bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-6 text-blue-700">Student Promotion</h2>
                {student ? (
                    <>
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="font-semibold text-lg">{student.name}</div>
                                <div>Admission ID: <span className="font-mono">{student.admissionId}</span></div>
                                <div>Application ID: <span className="font-mono">{student.applicationId}</span></div>
                                <div>Inquiry ID: <span className="font-mono">{student.inquiryId}</span></div>
                                <div>Gender: {student.gender}</div>
                                <div>Date of Birth: {student.dob ? new Date(student.dob).toLocaleDateString() : '-'}</div>
                                <div>Class: <span className="font-semibold">{promotion?.currentClass || allocation?.class || student.class}</span></div>
                                <div>Section: <span className="font-semibold">{promotion?.currentSection || allocation?.section || '-'}</span></div>
                                <div>Roll No: {allocation?.rollNo || '-'}</div>
                                <div>Academic Year: {allocation?.academicYear || '-'}</div>
                                <div>Transport Facility: {student.transportFacility}</div>
                                <div>Address: {student.residentialAddress}</div>
                                <div>Email: {student.email}</div>
                            </div>
                            <div>
                                <div className="font-semibold mb-2">Father's Info:</div>
                                <div>Name: {student.fatherName}</div>
                                <div>Mobile: {student.fatherMobile}</div>
                                <div>Qualification: {student.fatherQualification}</div>
                                <div>Occupation: {student.fatherOccupation}</div>
                                <div className="font-semibold mt-4 mb-2">Mother's Info:</div>
                                <div>Name: {student.motherName}</div>
                                <div>Mobile: {student.motherMobile}</div>
                                <div>Qualification: {student.motherQualification}</div>
                                <div>Occupation: {student.motherOccupation}</div>
                                <div className="font-semibold mt-4 mb-2">Emergency Contact:</div>
                                <div>Name: {student.emergencyContactName}</div>
                                <div>Phone: {student.emergencyContactPhoneNo}</div>
                                <div className="font-semibold mt-4 mb-2">Medical Info:</div>
                                <div>Doctor: {student.doctorName}</div>
                                <div>Doctor Phone: {student.doctorPhoneNo}</div>
                                <div>Condition: {student.medicalCondition}</div>
                            </div>
                        </div>
                        <div className="mb-4 mt-6">
                            <div className="font-semibold">Promotion History:</div>
                            <ul className="list-disc ml-6">
                                {promotion?.previousClass?.length > 0 ? (
                                    promotion.previousClass.map((cls, idx) => (
                                        <li key={idx}>
                                            {cls.class} - Section {cls.section}
                                        </li>
                                    ))
                                ) : (
                                    <li>{allocation?.class || student.class} - Section {allocation?.section || '-'}</li>
                                )}
                            </ul>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4 mt-6">
                            <div>
                                <label className="block font-medium mb-1">New Class</label>
                                <input
                                    type="text"
                                    value={updateForm.newClass}
                                    onChange={e => setUpdateForm(f => ({ ...f, newClass: e.target.value }))}
                                    required
                                    className="border px-3 py-2 rounded w-full"
                                    placeholder="Enter new class"
                                />
                            </div>
                            
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Promotion'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-red-600">Student not found.</div>
                )}
            </div>
        </div>
    );
};

export default StudentPromotionPage;