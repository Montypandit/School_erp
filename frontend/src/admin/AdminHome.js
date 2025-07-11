import AdminNavbar from './AdminNavbar';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'

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

  const [allTimeTotalstudents, setAllTimeTotalStudents] = useState(0);
  const [totalStudents, setTotalStudetnts] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [presentStudents, setPresentStudents] = useState(0);
  const [absentStudents, setAbsentStudents] = useState(0);
  const [presentTeachers, setPresentTeachers] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (!token) {
      toast.info('Please login to continue');
      navigate('/');
      return;
    }
    // fetching students data
    const fetchTotalStudents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/final/admission/get/admission/count', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },

        });

        if (!res.ok) {
          throw new Error('Failed to fetch total students data');
        }

        const data = await res.json();
        setTotalStudetnts(data.totalAdmissionCount);
        setAllTimeTotalStudents(data.totalAdmissionAllTime)

      } catch (err) {
        toast.err('Oops! Something went wrong. Please try again later');
        console.error(err);
      }
    }

    const fetchTotalPresntAbsentStudents = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/final/admission/get/all-attendance/${new Date().toISOString().split('T')[0]}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorizartion': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch present stdents data');
        }
        const data = await res.json();
        setPresentStudents(data.presentStudents);
        setAbsentStudents(data.absentStudents);
      } catch (err) {
        console.error(err);
      }
    }

    const fetchTotalTeachers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/employees/get/employee/count/role/teacher',{
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
          }
        });

        if(!res.ok){
          throw new Error('Failed to fetch total teachers data');
        }

        const data = await res.json();
        setTotalTeachers(data.employeeCount)
        setTotalEmployees(data.totalEmployees);
      } catch (err) {
        console.log(err);
      }
    }

    fetchTotalTeachers();
    fetchTotalPresntAbsentStudents();
    fetchTotalStudents();
  }, [])

  // Calculate percentages, ensuring no division by zero
  const presentStudentPercentage = stats.totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0;
  const absentStudentPercentage = stats.totalStudents > 0 ? Math.round((absentStudents / totalStudents) * 100) : 0;
  const presentTeacherPercentage = stats.totalTeachers > 0 ? Math.round((stats.presentTeachers / totalTeachers) * 100) : 0;

  // ✅ Dummy stats for testing
  const dummyStats = {
    totalTeachers: 20,

    presentTeachers: 4,
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh',
    }}>
      <AdminNavbar />

      <h1 style={{textAlign:'left', color: '#333', margin: '15px' , fontSize:'30px', fontWeight:700 }}>Dashboard</h1>

      {/* Stats Overview */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '40px',
        marginBottom: '30px'
      }}>

        <StatCard
          title="Total Students"
          value={allTimeTotalstudents}
          icon="👥"
          color="#4CAF50"
        />
        <StatCard
          title="Current Year Students"
          value={totalStudents}
          icon="👥"
          color="#4CAF50"
        />
         <StatCard 
          title="Total Employees" 
          value={totalEmployees} 
          percentage={100}
          icon="👨‍🏫"
          color="#4CAF50"
        />
         <StatCard
          title="Total Teachers"
          value={totalTeachers}
          percentage={100}
          icon="👨‍🏫"
          color="#4CAF50"
        />
        <StatCard
          title="Present Students"
          value={`${presentStudents}/${totalStudents}`}
          percentage={presentStudentPercentage}
          icon="✅"
          color="#2196F3"
        />
        <StatCard
          title="Absent Students"
          value={ absentStudents === 0 ? `${totalStudents}/${totalStudents}`:  `${absentStudents}/${totalStudents}`}
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
          title="Absent Teachers"
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
        <ActionButton to="/admin/employee/page" icon="👨‍🎓" label="All Employees" />
        <ActionButton to="/admin/teacher/:empId" icon="🔍" label="Find an Employee" />
        <ActionButton to="/admin/allteachers" icon="👨‍🏫" label="All Teachers" />
        <ActionButton to="/admin/allstudents" icon="👥" label="All Students" />
        <ActionButton to="/admin/examschedule" icon="🔍" label="Exam Schedule" />
        <ActionButton to="/admin/attendence" icon="📅" label="Attendance" />
        <ActionButton to="/admin/weeklyschedule" icon="�" label="Weekly Schedule" />
        <ActionButton to="/admin/leaveapproval" icon="📝" label="Leave Approval" />
        <ActionButton to="/admin/announcement" icon="📢" label="Send Announcement" />
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
