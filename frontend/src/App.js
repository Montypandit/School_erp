import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './Home';
import AdminLogin from './admin/AdminLogin';
import AdminHome from './admin/AdminHome';
import InquiryForm from "./component/coordinator/InquiryForm";
import PrincipalHome from "./component/principal/PrincipalHome";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/admin/home' element={<AdminHome/>}/>
        <Route path='/parent/inquiry/form' element={<InquiryForm/>}/>
        <Route path="/principal/home" element={<PrincipalHome/>}/>
      </Routes>
    </Router>
  );
};

export default App;

