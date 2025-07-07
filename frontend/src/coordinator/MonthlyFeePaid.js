import React, { useState, useEffect } from 'react';
import { Search, Download, Send, Receipt, User, Calendar, CreditCard, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import CoordinatorNavbar from '../component/coordinator/CoordinatorNavbar';

const FeeManagementPage = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [generatedReceipt, setGeneratedReceipt] = useState(null);
    const [error, setError] = useState('');
    const [showPaidFeesModal, setShowPaidFeesModal] = useState(false); // New state for paid fees modal
    const [paidFees, setPaidFees] = useState([]); // New state for paid fees data

    // Fee form state
    const [feeData, setFeeData] = useState({
        className: '',
        section: '',
        totalFee: '',
        monthlyFee: '',
        paymentStartMonth: 'January',
        paymentStartYear: new Date().getFullYear(),
        payments: []
    });

    // Payment form state
    const [paymentForm, setPaymentForm] = useState({
        month: 'January',
        year: new Date().getFullYear(),
        amountPaid: '',
        paymentMode: 'Cash',
        remarks: ''
    });

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const { admissionId } = useParams();
    const navigate = useNavigate();

    // Fetch single student by admissionId
    const fetchStudent = async () => {
        if (!admissionId) {
            setError('No admission ID provided in URL');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = sessionStorage.getItem('coordinatorToken');
            if (!token) {
                navigate('/')
                return;
            }
            const res = await fetch(`http://localhost:5000/api/final/admission/get/student/${admissionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch student data: ${res.status}`);
            }

            const data = await res.json();
            const studentData = data.data;

            if (!studentData) {
                throw new Error('Student not found');
            }

            setStudent(studentData);
            setFeeData(prev => ({
                ...prev,
                className: studentData.class || '',
                section: studentData.section || 'A'
            }));

        } catch (error) {
            console.error('Error fetching student:', error);
            setError(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // New function: Fetch paid fees for the student
    const fetchPaidFees = async () => {
        if (!admissionId) {
            toast.error('Admission ID not available.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const token = sessionStorage.getItem('coordinatorToken');
            if (!token) {
                navigate('/');
                return;
            }
            const res = await fetch(`http://localhost:5000/api/monthly/fees/get/fees/${admissionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                // Handle 404 specifically: it's not an error, just no data yet.
                if (res.status === 404) {
                    setPaidFees([]);
                    setShowPaidFeesModal(true);
                    return;
                }
                throw new Error(`Failed to fetch paid fees: ${res.status}`);
            }

            const data = await res.json();
            setPaidFees(data.payments || []);
            setShowPaidFeesModal(true);
        } catch (error) {
            console.error('Error fetching paid fees:', error);
            toast.error(`Error fetching paid fees: ${error.message}`);
            setError(`Error fetching paid fees: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Add payment to list
    const addPayment = () => {
        if (!paymentForm.amountPaid) {
            alert('Please enter payment amount');
            return;
        }

        const newPayment = {
            ...paymentForm,
            amountPaid: parseFloat(paymentForm.amountPaid),
            id: Date.now() // Temporary ID for frontend
        };

        setFeeData(prev => ({
            ...prev,
            payments: [...prev.payments, newPayment]
        }));

        // Reset payment form
        setPaymentForm({
            month: 'January',
            year: new Date().getFullYear(),
            amountPaid: '',
            paymentMode: 'Cash',
            remarks: ''
        });
    };

    // Remove payment from list
    const removePayment = (id) => {
        setFeeData(prev => ({
            ...prev,
            payments: prev.payments.filter(p => p.id !== id)
        }));
    };

    // Generate receipt ID
    const generateReceiptId = () => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `REC${timestamp}${random}`;
    };

    // Submit fee data
    const submitFeeData = async () => {
        if (!student || feeData.payments.length === 0) {
            alert('Please add at least one payment');
            return;
        }

        setLoading(true);
        try {
            const token = sessionStorage.getItem('coordinatorToken');
            if (!token) {
                navigate('/');
                return;
            }
            const res = await fetch(`http://localhost:5000/api/monthly/fees/paid/fees/${admissionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...feeData,
                    totalFee: parseFloat(feeData.totalFee),
                    monthlyFee: parseFloat(feeData.monthlyFee),
                    paymentStartYear: parseInt(feeData.paymentStartYear),
                    payments: feeData.payments.map(p => ({
                        month: p.month,
                        year: p.year,
                        amountPaid: p.amountPaid,
                        paymentMode: p.paymentMode,
                        remarks: p.remarks
                    }))
                })
            });

            if (!res.ok) {
                throw new Error('Failed to update fee data');
            }

            const result = await res.json();
            toast.success('Fee data updated successfully!');

            // Generate receipt
            const receiptId = generateReceiptId();
            const receipt = {
                receiptId,
                student: student,
                payments: feeData.payments,
                totalAmount: feeData.payments.reduce((sum, p) => sum + p.amountPaid, 0),
                generatedDate: new Date().toLocaleString(),
                generatedBy: 'Coordinator'
            };

            setGeneratedReceipt(receipt);
            setShowReceiptModal(true);

            // Reset form
            setFeeData({
                className: student.class || '',
                section: student.section || 'A',
                totalFee: '',
                monthlyFee: '',
                paymentStartMonth: 'January',
                paymentStartYear: new Date().getFullYear(),
                payments: []
            });

        } catch (error) {
            console.error('Error updating fee data:', error);
            toast.error('Error updating fee data');
        } finally {
            setLoading(false);
        }
    };

    // Send receipt to WhatsApp
    const sendToWhatsApp = (phoneNumber) => {
        if (!generatedReceipt) return;

        const message = `
🎓 *FEE RECEIPT*
Receipt ID: ${generatedReceipt.receiptId}
Student: ${generatedReceipt.student.name}
Admission ID: ${generatedReceipt.student.admissionId}
Class: ${generatedReceipt.student.class}

💰 *Payment Details:*
${generatedReceipt.payments.map(p =>
            `${p.month} ${p.year}: ₹${p.amountPaid} (${p.paymentMode})`
        ).join('\n')}

Total Paid: ₹${generatedReceipt.totalAmount}
Generated: ${generatedReceipt.generatedDate}

Thank you!
    `.trim();

        let cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
        if (cleanNumber.length === 10) {
            cleanNumber = '91' + cleanNumber;
        }

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    const generatePDFReceipt = (receipt) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("FEE RECEIPT", 80, 15);

        doc.setFontSize(12);
        let y = 30;
        doc.text(`Receipt ID: ${receipt.receiptId}`, 15, y);
        doc.text(`Student: ${receipt.student.name}`, 15, y += 8);
        doc.text(`Admission ID: ${receipt.student.admissionId}`, 15, y += 8);
        doc.text(`Class: ${receipt.student.class}`, 15, y += 8);

        y += 8;
        doc.text("Payment Details:", 15, y);

        receipt.payments.forEach((p) => {
            y += 8;
            doc.text(`${p.month} ${p.year}: ₹${p.amountPaid} (${p.paymentMode})${p.remarks ? " - " + p.remarks : ""}`, 20, y);
        });

        y += 12;
        doc.text(`Total Paid: ₹${receipt.totalAmount}`, 15, y);
        doc.text(`Generated: ${receipt.generatedDate}`, 15, y + 8);
        doc.text("Thank you!", 15, y + 16);

        doc.save(`Fee_Receipt_${receipt.receiptId}.pdf`);
    };

    // Download receipt as text
    const downloadReceipt = () => {
        if (!generatedReceipt) return;
        generatePDFReceipt(generatedReceipt);
    };

    useEffect(() => {
        fetchStudent();
    }, []);

    return (
        <div>
            <CoordinatorNavbar />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                            <Receipt className="text-blue-600" />
                            Student Fee Management
                        </h1>

                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading student data...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                {error}
                            </div>
                        )}

                        {/* Student Details and Fee Management */}
                        {student && !loading && (
                            <div className="space-y-6">
                                {/* Student Details Card */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <User className="h-6 w-6 text-blue-600" />
                                        <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-white p-3 rounded-lg">
                                            <p className="text-sm text-gray-600">Admission ID</p>
                                            <p className="font-semibold text-lg">{student.admissionId}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg">
                                            <p className="text-sm text-gray-600">Class</p>
                                            <p className="font-semibold text-lg">{student.class}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg">
                                            <p className="text-sm text-gray-600">Roll No</p>
                                            <p className="font-semibold text-lg">{student.rollNo}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg">
                                            <p className="text-sm text-gray-600">Section</p>
                                            <p className="font-semibold text-lg">{student.section || 'A'}</p>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white p-3 rounded-lg flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-blue-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Father's Mobile</p>
                                                <p className="font-medium">{student.fatherMobile}</p>
                                            </div>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-pink-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Mother's Mobile</p>
                                                <p className="font-medium">{student.motherMobile}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* New "View Paid Fees" Button */}
                                    <button
                                        onClick={fetchPaidFees}
                                        className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CreditCard className="h-4 w-4" />
                                        View Paid Fees
                                    </button>
                                </div>

                                {/* Fee Structure */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Fee Structure</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Class
                                            </label>
                                            <input
                                                type="text"
                                                value={feeData.className}
                                                onChange={(e) => setFeeData(prev => ({ ...prev, className: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Section
                                            </label>
                                            <input
                                                type="text"
                                                value={feeData.section}
                                                onChange={(e) => setFeeData(prev => ({ ...prev, section: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Total Fee
                                            </label>
                                            <input
                                                type="number"
                                                value={feeData.totalFee}
                                                onChange={(e) => setFeeData(prev => ({ ...prev, totalFee: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Monthly Fee
                                            </label>
                                            <input
                                                type="number"
                                                value={feeData.monthlyFee}
                                                onChange={(e) => setFeeData(prev => ({ ...prev, monthlyFee: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Payment Start Month
                                            </label>
                                            <select
                                                value={feeData.paymentStartMonth}
                                                onChange={(e) => setFeeData(prev => ({ ...prev, paymentStartMonth: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {months.map(month => (
                                                    <option key={month} value={month}>{month}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Payment Start Year
                                            </label>
                                            <input
                                                type="number"
                                                value={feeData.paymentStartYear}
                                                onChange={(e) => setFeeData(prev => ({ ...prev, paymentStartYear: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Entry */}
                                <div className="bg-white border rounded-lg p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Payment</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Month
                                            </label>
                                            <select
                                                value={paymentForm.month}
                                                onChange={(e) => setPaymentForm(prev => ({ ...prev, month: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {months.map(month => (
                                                    <option key={month} value={month}>{month}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Year
                                            </label>
                                            <input
                                                type="number"
                                                value={paymentForm.year}
                                                onChange={(e) => setPaymentForm(prev => ({ ...prev, year: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Amount Paid
                                            </label>
                                            <input
                                                type="number"
                                                value={paymentForm.amountPaid}
                                                onChange={(e) => setPaymentForm(prev => ({ ...prev, amountPaid: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Payment Mode
                                            </label>
                                            <select
                                                value={paymentForm.paymentMode}
                                                onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentMode: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="Cash">Cash</option>
                                                <option value="UPI">UPI</option>
                                                <option value="Bank Transfer">Bank Transfer</option>
                                                <option value="Card">Card</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Remarks
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentForm.remarks}
                                                onChange={(e) => setPaymentForm(prev => ({ ...prev, remarks: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={addPayment}
                                        className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                                    >
                                        Add Payment
                                    </button>
                                </div>

                                {/* Payment List */}
                                {feeData.payments.length > 0 && (
                                    <div className="bg-white border rounded-lg p-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Payments to Process</h3>
                                        <div className="space-y-2">
                                            {feeData.payments.map((payment, index) => (
                                                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                                    <div>
                                                        <p className="font-medium">{payment.month} {payment.year}</p>
                                                        <p className="text-sm text-gray-600">
                                                            ₹{payment.amountPaid} via {payment.paymentMode}
                                                            {payment.remarks && ` - ${payment.remarks}`}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => removePayment(payment.id)}
                                                        className="text-red-600 hover:text-red-700 text-sm px-3 py-1 rounded border border-red-200 hover:bg-red-50"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 text-right">
                                            <p className="text-xl font-bold text-green-600">
                                                Total: ₹{feeData.payments.reduce((sum, p) => sum + p.amountPaid, 0)}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    onClick={submitFeeData}
                                    disabled={loading || feeData.payments.length === 0}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <Receipt className="h-4 w-4" />
                                            Update Fee & Generate Receipt
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Receipt Modal */}
                {showReceiptModal && generatedReceipt && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <div className="text-center mb-6">
                                <Receipt className="h-12 w-12 text-green-600 mx-auto mb-2" />
                                <h2 className="text-2xl font-bold text-gray-800">Receipt Generated</h2>
                                <p className="text-gray-600">Receipt ID: {generatedReceipt.receiptId}</p>
                            </div>

                            <div className="border-t border-b py-4 my-4">
                                <h3 className="font-semibold mb-2">Student: {generatedReceipt.student.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    Admission ID: {generatedReceipt.student.admissionId}
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                    Class: {generatedReceipt.student.class}
                                </p>
                                <p className="text-lg font-semibold text-green-600">
                                    Total Paid: ₹{generatedReceipt.totalAmount}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={downloadReceipt}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Download Receipt
                                </button>

                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => sendToWhatsApp(generatedReceipt.student.fatherMobile)}
                                        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Send className="h-4 w-4" />
                                        Send to Father
                                    </button>
                                    <button
                                        onClick={() => sendToWhatsApp(generatedReceipt.student.motherMobile)}
                                        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Send className="h-4 w-4" />
                                        Send to Mother
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowReceiptModal(false)}
                                    className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* New: Paid Fees Modal */}
                {showPaidFeesModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                                Previous Paid Fees for {student?.name}
                            </h2>
                            {paidFees.length === 0 ? (
                                <p className="text-center text-gray-600">No paid fees found for this student.</p>
                            ) : (
                                <div className="max-h-96 overflow-y-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Month & Year
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount Paid
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Payment Mode
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Paid On
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Remarks
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {paidFees
                                                .sort((a, b) => {
                                                    const dateA = new Date(a.paidOn);
                                                    const dateB = new Date(b.paidOn);
                                                    return dateB - dateA; // Sort by most recent first
                                                })
                                                .map((payment, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {payment.month} {payment.year}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            ₹{payment.amountPaid}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {payment.paymentMode}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(payment.paidOn).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {payment.remarks || '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setShowPaidFeesModal(false)}
                                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeeManagementPage;