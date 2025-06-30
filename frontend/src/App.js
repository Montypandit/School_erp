import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

/**
 * App.js
 * 
 * Main entry point for the React application.
 * Sets up routing for all modules: Admin, Coordinator, Teacher, Principal, and Common routes.
 * 
 * Uses React Router for navigation.
 * 
 * Each route points to a specific component representing a page or feature.
 */


// Admin Components
import AdminLogin from './admin/AdminLogin';
import AdminHome from './admin/AdminHome';
import EmployeeForm from "./admin/EmployeeForm";
import EmployeeLogin from "./admin/EmployeeLogin";
import GetAllTeacher from "./teacher/GetAllTeacher";
import GetAllStudent from "./component/Student/GetAllStudent";
import GetTeacher from "./teacher/GetTeacher";
import ExamSchedule from "./admin/ExamSchedule";
import LeaveApproval from "./admin/LeaveApproval";
import WeeklySchedule from "./admin/WeeklySchedule";
import Attendence from "./admin/Attendence";

// Coordinator Components
import CoordinatorHome from './coordinator/CoordinatorHome';
import CoordinatorLogin from "./component/coordinator/CoordinatorLogin";
import InquiryForm from "./component/coordinator/InquiryForm";
import FeesGeneration from "./coordinator/feesGeneration";
import FeePaid from './coordinator/FeePaid';
import EnquiryStudent from "./coordinator/enquiryStudent";
import Student from './component/coordinator/Student';
import StudentListPage from "./component/coordinator/StudentListPage";
import UpdateStudentInfo from "./component/coordinator/UpdateStudentInfo";
import AllotmentClass from "./component/coordinator/Alottment_class";
import Allotments from "./component/coordinator/Allotments";
import ActivityPlanner from "./coordinator/ActivityPlanner";
import MonthlyPlanner from "./coordinator/monthlyPlanner";
import Teacher from './component/coordinator/Teacher';
import AdmissionForm from "./component/coordinator/Admission/AdmissionForm";
import AdmissionFees from './component/coordinator/Admission/AdmissionFees';

// Teacher Components
import TeacherLogin from "./teacher/TeacherLogin";
import TeacherDashboard from "./component/teacher/TeacherDashboard";
import GetAttendence from "./component/teacher/GetAttendence";
import TeacherSchedulePage from "./teacher/TeachingSchedule";
import PTMManagement from "./component/teacher/PTMMangement";

// Principal Components
import PrincipalLogin from './principal/PrincipalLogin';
import PrincipalHome from "./component/principal/PrincipalHome";
import PrincipalAdmissionDetail from "./component/principal/PrincipalAdmissionDetail";

// Common Components
import Home from './Home';
import ScheduleForm from "./component/admin/ScheduleForm";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ==================== Common Routes ==================== */}
        <Route path='/' element={<Home/>}/>

        {/* ==================== Admin Module ==================== */}
        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/admin/home' element={<AdminHome/>}/>
        <Route path="/admin/employee/form" element={<EmployeeForm/>}/>
        <Route path="/admin/employees" element={<EmployeeLogin/>}/>
        <Route path="/admin/allteachers" element={<GetAllTeacher/>}/>
        <Route path="/admin/allstudents" element={<GetAllStudent/>}/>
        <Route path="/admin/teacher/:empId" element={<GetTeacher/>}/>
        <Route path="/admin/examschedule" element={<ExamSchedule/>}/>
        <Route path="/admin/leaveapproval" element={<LeaveApproval/>}/>
        <Route path="/admin/weeklyschedule" element={<WeeklySchedule/>}/>
        <Route path="/admin/attendence" element={<Attendence/>}/>

        {/* ==================== Coordinator Module ==================== */}
        <Route path="/coordinator/home" element={<CoordinatorHome/>}/>
        <Route path="/coordinator/login" element={<CoordinatorLogin/>}/>
        <Route path="/parent/inquiry/form" element={<InquiryForm/>}/>
        <Route path="/parents/inquiry/form" element={<InquiryForm/>}/>
        <Route path="/coordinator/all/fee/details" element={<FeePaid/>}/>
        <Route path="/coordinator/fees/generate/:admissionId" element={<FeesGeneration/>}/>
        <Route path="/coordinator/enquiry/process/:inquiryId" element={<EnquiryStudent/>}/>
        <Route path="/final/admission/form/:inquiryId/:admissionId" element={<AdmissionForm/>}/>
        <Route path="/coordinator/enquiry" element={<EnquiryStudent/>}/>
        <Route path="/coordinator/student" element={<Student/>}/>
        <Route path="/coordinator/monthly/planner" element={<MonthlyPlanner/>}/>
        <Route path="/coordinator/update/student/:admissionId" element={<UpdateStudentInfo/>}/>
        <Route path="/coordinator/teacher/page" element={<Teacher/>}/>
        <Route path="/coordinator/activity/planner" element={<ActivityPlanner/>}/>
        <Route path="/coordinator/allotment" element={<Allotments/>}/>
        <Route path="/students/page" element={<StudentListPage/>}/>

        {/* ==================== Teacher Module ==================== */}
        <Route path="/teacher/login" element={<TeacherLogin/>}/>
        <Route path="/teacher/home" element={<TeacherDashboard/>}/>
        <Route path="/teacher/attendence" element={<GetAttendence/>}/>
        <Route path="/teacher/schedule" element={<ScheduleForm/>}/>
        <Route path="/teaching/schedule" element={<TeacherSchedulePage/>}/>
        <Route path="/teacher/ptm" element={<PTMManagement/>}/>

        {/* ==================== Principal Module ==================== */}
        <Route path ="/principal/login" element={<PrincipalLogin/>}/>
        <Route path="/principal/home" element={<PrincipalHome/>}/>
        <Route path="/principal/admission/detail/:inquiryId" element={<PrincipalAdmissionDetail/>}/>
      </Routes>
    </Router>
  );
};

export default App;

