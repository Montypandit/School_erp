import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import { toast } from 'react-toastify';

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    presentStudents: 0,
    presentTeachers: 0,
    absentStudents: 0
  });

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (!token) {
      toast.error('Please login to continue');
      console.error('Admin token not found');
      // Handle missing token, e.g., redirect to login
      return;
    }
    const fetchActiveStudentCount = async () => {
      try {

        const response = await fetch('http://localhost:5000/student/status/active/count', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to fetch active student count and parse error' }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Assuming the backend returns { activeStudents: count }
        
        setStats(prevStats => ({
          ...prevStats,
          totalStudents: data.activeStudents, // Or a new field like activeStudents: data.activeStudents
          // You'll likely fetch other stats (teachers, present, absent) separately
        }));

      } catch (error) {
        toast.error('Failed to fetch student data')
        console.error('Error fetching active student count:', error);
        // Optionally, display an error to the user (e.g., using a toast notification)
      }
    };

    const fetchTotalTeachers = async ()=>{
      try{
        const res = await fetch('http://localhost:5000/teachers',{
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
          }
        });

        if(!res.ok){
          const errorData = res.json().catch(()=>({
            message:'Failed to fetch active teacher count'
          }));
          throw new Error(errorData.message);
        }
        const data = await res.json();
        setStats(prevStat=>({
          ...prevStat,
          totalTeachers:data.totalActiveTeacher,
        }))
      }catch(err){
        toast.error('There is an error to fetch teacher data');
      }
    }

    fetchActiveStudentCount();
    fetchTotalTeachers();
  }, []);

  // Calculate percentages
  const presentStudentPercentage = Math.round((stats.presentStudents / stats.totalStudents) * 100) || 0;
  const presentTeacherPercentage = Math.round((stats.presentTeachers / stats.totalTeachers) * 100) || 0;
  const absentStudentPercentage = Math.round((stats.absentStudents / stats.totalStudents) * 100) || 0;

  // Card component for statistics
  const StatCard = ({ title, value, percentage, icon, color }) => (
    
    <div style={{
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minWidth: '200px',
      margin: '10px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#666', margin: '0 0 5px 0', fontSize: '0.9em' }}>{title}</p>
          <h2 style={{ margin: '0', color: '#333' }}>{value}</h2>
        </div>
        <div style={{
          backgroundColor: `${color}20`,
          color: color,
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5em'
        }}>
          {icon}
        </div>
      </div>
      {percentage !== undefined && (
        <div style={{ marginTop: '15px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px',
            fontSize: '0.9em'
          }}>
            <span>Progress</span>
            <span>{percentage}%</span>
          </div>
          <div style={{
            width: '100%',
            backgroundColor: '#f0f0f0',
            borderRadius: '10px',
            height: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${percentage}%`,
              backgroundColor: color,
              height: '100%',
              borderRadius: '10px',
              transition: 'width 0.5s ease-in-out'
            }}></div>
          </div>
        </div>
      )}
    </div>
  );

  // Button component for actions
  const ActionButton = ({ to, icon, label }) => (
    <Link to={to} style={{
      backgroundColor: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '10px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      color: '#333',
      transition: 'all 0.3s ease',
      textAlign: 'center',
      minHeight: '120px',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        borderColor: '#007bff',
        color: '#007bff'
      }
    }}>
      <div style={{
        fontSize: '2em',
        marginBottom: '10px',
        color: 'inherit'
      }}>
        {icon}
      </div>
      <span style={{ fontSize: '0.9em' }}>{label}</span>
    </Link>
  );

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
          label="Find a Teacher" 
        />
        <ActionButton 
          to="/admin/all-teachers" 
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
  );
};

export default AdminHome;
