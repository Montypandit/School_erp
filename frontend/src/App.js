import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './Home';
import AdminLogin from './admin/AdminLogin';
import AdminHome from './admin/AdminHome';
import InquiryForm from "./component/coordinator/InquiryForm";
import CoordinatorHome from './coordinator/CoordinatorHome';
import CoordinatorLogin from "./component/coordinator/CoordinatorLogin";
import EmployeeForm from "./admin/EmployeeForm";
import FeesGeneration from "./coordinator/feesGeneration";
import TeacherLogin from "./teacher/TeacherLogin";
import TeacherHome from "./teacher/TeacherHome";
import FeePaid from './coordinator/FeePaid'
import EnquiryStudent from "./coordinator/enquiryStudent";
import EmployeeLogin from "./admin/EmployeeLogin";
import PrincipalLogin from './principal/PrincipalLogin'
import PrincipalHome from "./component/principal/PrincipalHome";
import PrincipalAdmissionDetail from "./component/principal/PrincipalAdmissionDetail";
import GetAllTeacher from "./teacher/GetAllTeacher";
import GetAllStudent from "./component/Student/GetAllStudent";
import GetTeacher from "./teacher/GetTeacher";
import AdmissionForm from "./component/coordinator/Admission/AdmissionForm"
import AdmissionFees from './component/coordinator/Admission/AdmissionFees'
import Student from './component/coordinator/Student'
import ScheduleForm from "./component/admin/ScheduleForm";
import Attendence from "./admin/Attendence";


import ExamSchedule from "./admin/ExamSchedule";
import LeaveApproval from "./admin/LeaveApproval";
//import ScheduleForm from "./component/teacher/ScheduleForm";
import WeeklySchedule from "./admin/WeeklySchedule";
import StudentListPage from "./component/coordinator/StudentListPage";
import UpdateStudentInfo from "./component/coordinator/UpdateStudentInfo";
import AllotmentClass from "./component/coordinator/Alottment_class";
import Allotments from "./component/coordinator/Allotments";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/admin/home' element={<AdminHome/>}/>
        <Route path='/parent/inquiry/form' element={<InquiryForm/>}/>
        <Route path="/coordinator/home" element={<CoordinatorHome/>}/>
        <Route path="/coordinator/login" element={<CoordinatorLogin/>}/>
        <Route path="/admin/employee/form" element={<EmployeeForm/>}/>
        <Route path="/parents/inquiry/form" element={<InquiryForm/>}/>
        <Route path="/coordinator/all/fee/details" element={<FeePaid/>}/>
        <Route path="/coordinator/fees/generate/:admissionId" element={<FeesGeneration/>}/>
        <Route path="/teacher/login" element={<TeacherLogin/>}/>
        <Route path="/teacher/home" element={<TeacherHome/>}/>
        <Route path="/coordinator/enquiry/process/:inquiryId" element={<EnquiryStudent/>}/>
        <Route path="/coordinator/enquiry" element={<EnquiryStudent/>}/>
        <Route path="/admin/employees" element={<EmployeeLogin/>}/>
        <Route path="/admin/allteachers" element={<GetAllTeacher/>}/>
        <Route path="/admin/allstudents" element={<GetAllStudent/>}/>
        <Route path="/admin/teacher/:empId" element={<GetTeacher/>}/>
        <Route path="/admin/examschedule" element={<ExamSchedule/>}/>
        <Route path="/admin/leaveapproval" element={<LeaveApproval/>}/>
        <Route path="/teacher/schedule" element={<ScheduleForm/>}/>
        <Route path="/admin/weeklyschedule" element={<WeeklySchedule/>}/>
        <Route path="/final/admission/form/:inquiryId/:admissionId" element={<AdmissionForm/>}/>
        <Route path ="/principal/login" element={<PrincipalLogin/>}/>
        <Route path="/principal/home" element={<PrincipalHome/>}/>
        <Route path="/principal/admission/detail/:inquiryId" element={<PrincipalAdmissionDetail/>}/>

          </Routes>
    </Router>
  );
};

export default App;

