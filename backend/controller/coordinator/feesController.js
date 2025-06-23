const Fees = require('../../models/coordinator/feesModel');

// 📌 Helper function to generate receipt ID
const generateReceiptId = (type = 'FEE') => {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${type}${timestamp}${random}`;
};

// 📌 Helper function to get current academic year
const getCurrentAcademicYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() returns 0-11
  
  // Academic year typically starts in April (month 4)
  if (month >= 4) {
    return `${year}-${(year + 1).toString().slice(-2)}`;
  } else {
    return `${year - 1}-${year.toString().slice(-2)}`;
  }
};

// 📌 Create fees (initial admission-time fee record)
const createFees = async (req, res) => {
  try {
    const {
      admissionId,
      name,
      class: studentClass,
      fatherName,
      gender,
      monthlyFeeAmount,
      registrationFees,
      admissionFees,
      annualCharges,
      activityFees,
      maintenanceFees,
      tuitionFees,
      contactInfo
    } = req.body;

    // Check if admission ID already exists
    const existingFee = await Fees.findOne({ admissionId });
    if (existingFee) {
      return res.status(400).json({ message: 'Fee record already exists for this admission ID' });
    }

    // Generate receipt ID for admission fees
    const admissionReceiptId = generateReceiptId('ADM');

    // Calculate total admission fees
    const totalAdmissionFees = 
      (parseFloat(registrationFees) || 0) +
      (parseFloat(admissionFees) || 0) +
      (parseFloat(annualCharges) || 0) +
      (parseFloat(activityFees) || 0) +
      (parseFloat(maintenanceFees) || 0) +
      (parseFloat(tuitionFees) || 0);

    const feeData = {
      receiptId: admissionReceiptId,
      admissionId,
      name,
      class: studentClass,
      fatherName,
      gender,
      monthlyFeeAmount: parseFloat(monthlyFeeAmount) || 0,
      academicYear: getCurrentAcademicYear(),
      admissionTimeFees: {
        registrationFees: parseFloat(registrationFees) || 0,
        admissionFees: parseFloat(admissionFees) || 0,
        annualCharges: parseFloat(annualCharges) || 0,
        activityFees: parseFloat(activityFees) || 0,
        maintenanceFees: parseFloat(maintenanceFees) || 0,
        tuitionFees: parseFloat(tuitionFees) || 0,
        admissionFeesReceipt: admissionReceiptId,
        admissionFeesPaidDate: new Date(),
        isPaid: totalAdmissionFees > 0
      },
      contactInfo: contactInfo || {}
    };

    const newFee = new Fees(feeData);
    const savedFee = await newFee.save();

    res.status(201).json({ 
      message: 'Fee record created successfully', 
      data: savedFee,
      receiptId: admissionReceiptId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get all fees with optional filtering
const getAllFees = async (req, res) => {
  try {
    const { academicYear, status, class: studentClass } = req.query;
    
    let filter = {};
    if (academicYear) filter.academicYear = academicYear;
    if (status) filter.status = status;
    if (studentClass) filter.class = studentClass;

    const fees = await Fees.find(filter)
      .sort({ createdAt: -1 })
      .select('-__v'); // Exclude version field

    res.status(200).json({ 
      data: fees,
      count: fees.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get student by admission ID (for the React component)
const getStudentByAdmissionId = async (req, res) => {
  try {
    const { admissionId } = req.params;
    
    const student = await Fees.findByAdmissionId(admissionId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Return student data in the format expected by React component
    const studentData = {
      admissionId: student.admissionId,
      name: student.name,
      class: student.class,
      fatherName: student.fatherName,
      gender: student.gender,
      monthlyFeeAmount: student.monthlyFeeAmount,
      academicYear: student.academicYear,
      status: student.status,
      feeSummary: student.feeSummary,
      monthlyPayments: student.monthlyPayments,
      contactInfo: student.contactInfo
    };

    res.status(200).json(studentData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get a single fee record by ID
const getSingleFee = async (req, res) => {
  try {
    const fee = await Fees.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    res.status(200).json(fee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Update admission-time fees
const updateFee = async (req, res) => {
  try {
    const updated = await Fees.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Fee record not found' });
    res.status(200).json({ message: 'Fee updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Delete fee record
const deleteFee = async (req, res) => {
  try {
    const deleted = await Fees.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Fee record not found' });
    res.status(200).json({ message: 'Fee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ NEW: Add monthly fee payment with auto receipt generation
const addMonthlyPayment = async (req, res) => {
  try {
    const {
      admissionId,
      monthsSelected,
      amountPerMonth,
      totalAmount,
      paymentDate,
      paymentMethod,
      remarks,
      createdBy
    } = req.body;

    // Validation
    if (!admissionId || !monthsSelected || !monthsSelected.length || !amountPerMonth || !totalAmount) {
      return res.status(400).json({ 
        message: 'Admission ID, months selected, amount per month, and total amount are required' 
      });
    }

    // Find the student
    const student = await Fees.findOne({ admissionId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Generate receipt ID for this payment
    const receiptId = generateReceiptId('MON');
    const currentYear = new Date().getFullYear();

    // Check for duplicate month payments in the same year
    const existingPayments = student.monthlyPayments.filter(payment => payment.year === currentYear);
    const alreadyPaidMonths = new Set();
    existingPayments.forEach(payment => {
      payment.monthsPaid.forEach(month => alreadyPaidMonths.add(month));
    });

    const duplicateMonths = monthsSelected.filter(month => alreadyPaidMonths.has(month));
    if (duplicateMonths.length > 0) {
      return res.status(400).json({ 
        message: `Payment already exists for months: ${duplicateMonths.join(', ')}` 
      });
    }

    // Create payment data
    const paymentData = {
      receiptId,
      year: currentYear,
      monthsPaid: monthsSelected,
      amountPerMonth: parseFloat(amountPerMonth),
      totalAmount: parseFloat(totalAmount),
      paymentMethod: paymentMethod || 'Cash',
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      remarks: remarks || '',
      createdBy: createdBy || 'System',
      status: 'Paid'
    };

    // Add payment using the model method
    const updatedStudent = await student.addMonthlyPayment(paymentData);

    res.status(200).json({ 
      message: 'Monthly payment recorded successfully', 
      data: updatedStudent,
      receiptId,
      paymentSummary: {
        monthsPaid: monthsSelected,
        totalAmount: parseFloat(totalAmount),
        paymentDate: paymentData.paymentDate
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ NEW: Add additional fee (exam fee, sports fee, etc.)
const addAdditionalFee = async (req, res) => {
  try {
    const { admissionId, feeType, amount, description, dueDate } = req.body;

    if (!admissionId || !feeType || !amount) {
      return res.status(400).json({ 
        message: 'Admission ID, fee type, and amount are required' 
      });
    }

    const receiptId = generateReceiptId('ADD');

    const updated = await Fees.findOneAndUpdate(
      { admissionId },
      {
        $push: {
          additionalFees: {
            feeType,
            amount: parseFloat(amount),
            description: description || '',
            dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            receiptId,
            status: 'Pending'
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ 
      message: 'Additional fee added successfully', 
      data: updated,
      receiptId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ NEW: Get monthly collection report
const getMonthlyCollectionReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    
    if (!year || !month) {
      return res.status(400).json({ 
        message: 'Year and month are required' 
      });
    }

    const report = await Fees.getMonthlyCollectionReport(parseInt(year), month);
    
    res.status(200).json({
      message: 'Monthly collection report generated',
      data: report[0] || { totalCollection: 0, totalStudents: 0, payments: [] }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ NEW: Get fee defaulters (students with pending payments)
const getFeeDefaulters = async (req, res) => {
  try {
    const { academicYear } = req.query;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Get all active students
    let filter = { status: 'Active' };
    if (academicYear) filter.academicYear = academicYear;

    const students = await Fees.find(filter);
    
    const defaulters = students.filter(student => {
      const paidMonths = student.getMonthsPaidInYear(currentYear);
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
      
      // Check if current month fee is paid
      const currentMonthName = monthNames[currentMonth];
      return !paidMonths.includes(currentMonthName);
    });

    const defaultersData = defaulters.map(student => ({
      admissionId: student.admissionId,
      name: student.name,
      class: student.class,
      fatherName: student.fatherName,
      monthlyFeeAmount: student.monthlyFeeAmount,
      pendingMonths: student.getPendingMonthsInYear(currentYear),
      lastPaymentDate: student.feeSummary.lastPaymentDate,
      contactInfo: student.contactInfo
    }));

    res.status(200).json({
      message: 'Fee defaulters list generated',
      data: defaultersData,
      count: defaultersData.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createFees,
  getAllFees,
  getStudentByAdmissionId,
  getSingleFee,
  updateFee,
  deleteFee,
  addMonthlyPayment,
  addAdditionalFee,
  getMonthlyCollectionReport,
  getFeeDefaulters
};