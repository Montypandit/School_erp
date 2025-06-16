<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
=======
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './Home'
import AdminLogin from './admin/AdminLogin';
import AdminHome from './admin/AdminHome';
import CoordinatorLogin from './component/coordinator/CoordinatorLogin';
import CoordinatorHome from './component/coordinator/CoordinatorHome';
>>>>>>> c3779b7c28943b4ae23e64659d66c6570908e2bc

// Importing portals
import CoordinatorHome from "./coordinator/CoordinatorHome";

// Importing Inquiry Form Wrapper
import AddInquiryForm from "./component/coordinator/AddInquiry";

// Optional: Other components
import Home from "./Home";

const App = () => {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        {/* Home page (portal selection screen) */}
        <Route path="/" element={<Home />} />

        {/* Coordinator portal routes */}
        <Route path="/coordinator/home" element={<CoordinatorHome />} />
        <Route path="/coordinator/inquiry" element={<AddInquiryForm />} />

        {/* Add other routes here if needed */}
=======
        <Route path='/' element={<Home/>}/>
        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/admin/home' element = {<AdminHome/>}/>
        <Route path='/coordinator/login' element={<CoordinatorLogin/>}/>
        <Route path='/coordinator/home' element={<CoordinatorHome/>}/>
>>>>>>> c3779b7c28943b4ae23e64659d66c6570908e2bc
      </Routes>
    </Router>
  );
};

export default App;
