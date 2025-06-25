import React, { useState } from 'react';
import AdminNavbar from './AdminNavbar';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, percentage, icon, color }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    flex: '1 1 200px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.2s, box-shadow 0.2s',
  }} onMouseOver={(e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  }} onMouseOut={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ margin: 0, color: '#555', fontSize: '1rem' }}>{title}</h3>
      <span style={{ fontSize: '24px' }}>{icon}</span>
    </div>
    <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '10px 0', color: color }}>{value}</p>
    <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
      <div style={{
        width: `${percentage}%`,
        backgroundColor: color,
        height: '8px',
        borderRadius: '5px'
      }}></div>
    </div>
  </div>
);

const ActionButton = ({ to, icon, label }) => (
  <Link to={to} style={{
    textDecoration: 'none',
    color: 'inherit',
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  }} onMouseOver={(e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  }} onMouseOut={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  }}>
    <span style={{ fontSize: '36px', marginBottom: '10px' }}>{icon}</span>
    <span style={{ fontWeight: '600', textAlign: 'center' }}>{label}</span>
  </Link>
);

const AdminHome = () => {
  // Placeholder data for stats. In a real app, you would fetch this from an API.
  const [stats, setStats] = useState({
    totalStudents: 1250,
    presentStudents: 1180,
    absentStudents: 70,
    totalTeachers: 75,
    presentTeachers: 72,
  });

  // Calculate percentages, ensuring no division by zero
  const presentStudentPercentage = stats.totalStudents > 0 ? Math.round((stats.presentStudents / stats.totalStudents) * 100) : 0;
  const absentStudentPercentage = stats.totalStudents > 0 ? Math.round((stats.absentStudents / stats.totalStudents) * 100) : 0;
  const presentTeacherPercentage = stats.totalTeachers > 0 ? Math.round((stats.presentTeachers / stats.totalTeachers) * 100) : 0;

  return (
     
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh',
    }}>
     <AdminNavbar />


      <h1 style={{ color: '#333', marginBottom: '25px' }}>Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <StatCard 
          title="Total Students"
          value={stats.totalStudents} 
          percentage={100}
          icon="👥"
          color="#4CAF50"
        />
        <StatCard 
          title="Present Today"
          value={`${stats.presentStudents}/${stats.totalStudents}`}
          percentage={presentStudentPercentage}
          icon="✅"
          color="#2196F3"
        />
        <StatCard 
          title="Absent Today"
          value={`${stats.absentStudents}/${stats.totalStudents}`}
          percentage={absentStudentPercentage}
          icon="❌"
          color="#F44336"
        />
        <StatCard 
          title="Teachers Present"
          value={`${stats.presentTeachers}/${stats.totalTeachers}`}
          percentage={presentTeacherPercentage}
          icon="👨‍🏫"
          color="#9C27B0"
        />
      </div>

      {/* Quick Actions */}
      <h2 style={{ color: '#444', margin: '30px 0 20px 0' }}>Quick Actions</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <ActionButton 
          to="/admin/employee/form"
          icon="👩‍🏫"
          label="Add New Employee"
        />
        <ActionButton 
          to="/admin/employees"
          icon="👨‍🎓"
          label="All Employees"
        />
          <ActionButton 
          to="/admin/teacher/:id"
          icon="🔍"
          label="Find an Employee"
        />
        <ActionButton 
          to="/admin/allteachers"
          icon="👥"
          label="All Teachers"
        />
        <ActionButton 
          to="/admin/allstudents"
          icon="👥"
          label="All Students"
        />
        <ActionButton 
          to="/findstudent"
          icon="🔍"
          label="Find Student"
        />
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#444', marginTop: 0 }}>Recent Activity</h2>
        <p style={{ color: '#666', fontStyle: 'italic' }}>Recent system activities will appear here.</p>
      </div>
    </div>
  )
}

export default AdminHome;
