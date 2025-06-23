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
        <Route path="/coordinator/enquiry" element={<EnquiryStudent/>}/>
      </Routes>
    </Router>
  );
};

export default App;

