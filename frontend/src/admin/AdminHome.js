import AdminNavbar from './AdminNavbar';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

// ✅ Define StatCard
const StatCard = ({ title, value, percentage, icon, color }) => {
  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '15px',
      borderRadius: '10px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      flex: '1',
      minWidth: '200px'
    }}>
      <div style={{ fontSize: '24px' }}>{icon}</div>
      <h3 style={{ margin: '10px 0 5px' }}>{title}</h3>
      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{value}</p>
      {percentage !== undefined && (
        <p style={{ color: color }}>{Math.round(percentage)}%</p>
      )}
    </div>
  );
};

// ✅ Action Button Component
function ActionButton({ to, icon, label }) {
  return (
    <Link to={to} style={{
      backgroundColor: '#ffffff',
      padding: '15px',
      borderRadius: '10px',
      textAlign: 'center',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      textDecoration: 'none',
      color: '#333',
      fontWeight: 'bold',
      transition: '0.2s ease-in-out',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ fontSize: '24px' }}>{icon}</div>
      <div style={{ marginTop: '8px' }}>{label}</div>
    </Link>
  );
}

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

  // ✅ Dummy stats for testing
  const dummyStats = {
    totalStudents: 10,
    totalTeachers: 20,
    presentStudents: 2,
    absentStudents: 2,
    presentTeachers: 4,
  };

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
          value={dummyStats.totalStudents} 
          percentage={100}
          icon="👥"
          color="#4CAF50"
        />
        <StatCard 
          title="Present Today"
          value={`${dummyStats.presentStudents}/${dummyStats.totalStudents}`}
          percentage={presentStudentPercentage}
          icon="✅"
          color="#2196F3"
        />
        <StatCard 
          title="Absent Today"
          value={`${dummyStats.absentStudents}/${dummyStats.totalStudents}`}
          percentage={absentStudentPercentage}
          icon="❌"
          color="#F44336"
        />
        <StatCard 
          title="Teachers Present"
          value={`${dummyStats.presentTeachers}/${dummyStats.totalTeachers}`}
          percentage={presentTeacherPercentage}
          icon="👨‍🏫"
          color="#9C27B0"
        />
        <StatCard 
          title="Total Teachers" 
          value={dummyStats.totalTeachers} 
          percentage={100}
          icon="👨‍🏫"
          color="#4CAF50"
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
        <ActionButton to="/admin/employee/form" icon="👩‍🏫" label="Add New Employee" />
        <ActionButton to="/admin/employees" icon="👨‍🎓" label="All Employees" />
        <ActionButton to="/admin/teacher/:empId" icon="🔍" label="Find an Employee" />
        <ActionButton to="/admin/allteachers" icon="👨‍🏫" label="All Teachers" />
        <ActionButton to="/admin/allstudents" icon="👥" label="All Students" />
        <ActionButton to="/admin/examschedule" icon="🔍" label="Exam Schedule" />
        <ActionButton to="/admin/attendance" icon="📅" label="Attendance" />
        <ActionButton to="/admin/weeklyschedule" icon="�" label="Weekly Schedule" />
        <ActionButton to="/admin/leaveapproval" icon="📝" label="Leave Approval" />
      </div>

      {/* Recent Activity Section */}
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
  );
};

export default AdminHome;
