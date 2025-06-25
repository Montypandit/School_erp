import React from 'react'
import AdminNavbar from './AdminNavbar'

const AdminHome = () => {
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
          to="/admin/examschedule" 
          icon="🔍" 
          label="Exam Schedule" 
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

export default AdminHome
