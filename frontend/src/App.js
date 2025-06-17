import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './Home';
import AdminLogin from './admin/AdminLogin';
import AdminHome from './admin/AdminHome';
import InquiryForm from "./component/coordinator/InquiryForm";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/admin/home' element={<AdminHome/>}/>
        <Route path='/parent/inquiry/form' element={<InquiryForm/>}/>
      </Routes>
    </Router>
  );
};

export default App;

