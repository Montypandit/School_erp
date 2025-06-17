import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [hoveredTab, setHoveredTab] = useState(null);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  // Navigation items
  const navItems = [
    { path: '/admin/students/management', label: 'Student' }, // Assuming this is the correct path for adding a teacher
    { path: '/admin/teacher', label: 'Teacher' }, // This might be redundant now or could be for a specific teacher view
    { path: '/report', label: 'Report' },
    {path:'/admin/schedule', label: 'Schedule'},
    {path: '/admin/course', label: 'Course'},
    { path: '/admin/attendance', label: 'Attendance' },
    {path: '/admin/batch', label: 'Batch'},
    { path: '/attendance', label: 'Attendance' },
  ];

  // Nav item hover effect styles
  const navItemStyles = (isActive, isHovered) => ({
    padding: '10px 20px',
    borderRadius: '8px',
    transition: 'all 0.25s ease',
    color: isActive || isHovered ? '#4f46e5' : '#4b5563',
    backgroundColor: isHovered ? '#f3f4f6' : 'transparent',
    fontWeight: isActive ? '600' : '500',
    fontSize: '15px',
    position: 'relative',
    textDecoration: 'none',
    cursor: 'pointer',
  });

  return (
    <nav style={{
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      padding: '0 20px',
      height: '70px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
    }}>
      {/* Logo Section */}
      {/* <div style={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
      }}>
        <span style={{
          fontSize: '24px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginRight: '10px',
        }}>
          ERP
        </span>
      </div> */}

        {/* Logo Section */}
<Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
  <div style={{
    display: 'flex',
    alignItems: 'center',
  }}>
    <span style={{
      fontSize: '24px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginRight: '10px',
    }}>
      ERP
    </span>
  </div>
</Link>


      {/* Navigation Links */}
      <div style={{
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
      }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setActiveTab(item.path)}
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              ...navItemStyles(activeTab === item.path, hoveredTab === item.path),
            }}
            onMouseEnter={() => setHoveredTab(item.path)}
            onMouseLeave={() => setHoveredTab(null)}
          >
            <span style={{ fontSize: '14px' }}>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* User Profile/Logout - Placeholder */}
      <button
        type="button"
        style={{
          width: '80px',
          height: '40px',
          borderRadius: '10%',
          backgroundColor: '#e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: 'none',
          gap: '15px',
        }}
        onClick={() => {
          sessionStorage.removeItem('adminToken');
          window.location.href = '/admin/login'; // Redirect to login page after logout
        }}
        aria-label="Logout"
      >
        <span>Logout</span>
      </button>
    </nav>
  );
};

export default AdminNavbar;
