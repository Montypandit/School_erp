/**
 * App.js
 * -------------
 * Main entry point for the React application.
 * Sets up routing for all modules: Admin, Coordinator, Teacher, Principal, and Common routes.
 * Uses React Router for navigation.
 * Each route points to a specific component representing a page or feature.
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

// Common Components
import Home from './Home';
import ScheduleForm from "./component/admin/ScheduleForm";

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
import InquiryForm from "./component/coordinator/InquiryForm";
import CoordinatorHome from './coordinator/CoordinatorHome';
import CoordinatorLogin from "./component/coordinator/CoordinatorLogin";
import FeesGeneration from "./coordinator/feesGeneration";
import FeePaid from './coordinator/FeePaid';
import EnquiryStudent from "./coordinator/enquiryStudent";
import Student from './component/coordinator/Student';
import StudentListPage from "./component/coordinator/StudentListPage";
import UpdateStudentInfo from "./component/coordinator/UpdateStudentInfo";
import Allotments from "./component/coordinator/Allotments";
import ActivityPlanner from "./coordinator/ActivityPlanner";
import MonthlyPlanner from "./coordinator/monthlyPlanner";
import Teacher from './component/coordinator/Teacher';
import AdmissionForm from "./component/coordinator/Admission/AdmissionForm";
import AdmissionFees from './component/coordinator/Admission/AdmissionFees';
import MonthlyFeePaid from './coordinator/MonthlyFeePaid';

// Teacher Components
import TeacherLogin from "./teacher/TeacherLogin";
import TeacherDashboard from "./component/teacher/TeacherDashboard";
import GetAttendence from "./component/teacher/GetAttendence";
import Results from "./component/teacher/AddResult";
import TeacherSchedulePage from "./teacher/TeachingSchedule";
import PTMManagement from "./component/teacher/PTMMangement";
import Homework from "./teacher/HomeWork"

// Principal Components
import PrincipalLogin from './principal/PrincipalLogin';
import PrincipalHome from "./component/principal/PrincipalHome";
import PrincipalAdmissionDetail from "./component/principal/PrincipalAdmissionDetail";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Common Routes */}
        <Route path='/' element={<Home/>}/>
        <Route path="/final/admission/form/:inquiryId/:admissionId" element={<AdmissionForm/>}/>

        {/* Admin Module */}
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

        {/* Coordinator Module */}
        <Route path="/coordinator/home" element={<CoordinatorHome/>}/>
        <Route path="/coordinator/login" element={<CoordinatorLogin/>}/>
        <Route path="/parent/inquiry/form" element={<InquiryForm/>}/>
        <Route path="/coordinator/fees/generate/:admissionId" element={<FeesGeneration/>}/>
        <Route path="/coordinator/all/fee/details" element={<FeePaid/>}/>
        <Route path="/coordinator/enquiry/process/:inquiryId" element={<EnquiryStudent/>}/>
        <Route path="/coordinator/enquiry" element={<EnquiryStudent/>}/>
        <Route path="/coordinator/student" element={<Student/>}/>
        <Route path="/students/page" element={<StudentListPage/>}/>
        <Route path="/coordinator/update/student/:admissionId" element={<UpdateStudentInfo/>}/>
        <Route path="/coordinator/allotment" element={<Allotments/>}/>
        <Route path="/coordinator/activity/planner" element={<ActivityPlanner/>}/>
        <Route path="/coordinator/monthly/planner" element={<MonthlyPlanner/>}/>
        <Route path="/coordinator/teacher/page" element={<Teacher/>}/>
        <Route path="/coordinator/admission/fees/:admissionId" element={<AdmissionFees/>}/>
        <Route path="/coordinator/admission-fees/:admissionId" element={<MonthlyFeePaid/>}/>

        {/* Teacher Module */}
        <Route path="/teacher/login" element={<TeacherLogin/>}/>
        <Route path="/teacher/home" element={<TeacherDashboard/>}/>
        <Route path="/teacher/attendence" element={<GetAttendence/>}/>
        <Route path="/teacher/results" element={<Results/>}/>
        <Route path="/teacher/schedule" element={<TeacherSchedulePage/>}/>
        <Route path="/teacher/ptm" element={<PTMManagement/>}/>
        <Route path="/teacher/schedule/form" element={<ScheduleForm/>}/>
        <Route path="/teacher/homework" element={<Homework/>}/>

        {/* Principal Module */}
        <Route path="/principal/login" element={<PrincipalLogin/>}/>
        <Route path="/principal/home" element={<PrincipalHome/>}/>
        <Route path="/principal/admission/detail/:inquiryId" element={<PrincipalAdmissionDetail/>}/>
      </Routes>
    </Router>
  );
};

export default App;