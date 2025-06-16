import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
        {/* Home page (portal selection screen) */}
        <Route path="/" element={<Home />} />

        {/* Coordinator portal routes */}
        <Route path="/coordinator/home" element={<CoordinatorHome />} />
        <Route path="/coordinator/inquiry" element={<AddInquiryForm />} />

        {/* Add other routes here if needed */}
      </Routes>
    </Router>
  );
};

export default App;
