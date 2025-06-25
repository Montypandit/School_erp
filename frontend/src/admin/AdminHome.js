import React from 'react';
import AdminNavbar from './AdminNavbar';
import { Link } from 'react-router-dom';

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
  // ✅ Dummy stats for testing
  const stats = {
    totalStudents: 10,
    totalTeachers: 20,
    presentStudents: 2,
    absentStudents: 2,
    presentTeachers: 4,
  };

  const presentStudentPercentage = (stats.presentStudents / stats.totalStudents) * 100;
  const absentStudentPercentage = (stats.absentStudents / stats.totalStudents) * 100;
  const presentTeacherPercentage = (stats.presentTeachers / stats.totalTeachers) * 100;

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
        <StatCard 
          title="Total Teachers" 
          value={stats.totalTeachers} 
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
        <ActionButton to="/admin/teacher/:id" icon="🔍" label="Find an Employee" />
        <ActionButton to="/admin/allteachers" icon="👥" label="All Teachers" />
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
