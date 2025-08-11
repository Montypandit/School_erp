import React, { useEffect, useState } from 'react';
import CoordinatorNavbar from '../component/coordinator/CoordinatorNavbar';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CoordinatorDashboard = () => {
  const [inquiries, setInquiries] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const token = sessionStorage.getItem('coordinatorToken');
        if (!token) {
          toast.info('Please login to continue');
          navigate('coordinator/login');
          return;
        }
        const admissionRes = await fetch('https://school-erp-11-mr7k.onrender.com/api/admissions/get/all/admission/approval/status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const inquiryRes = await fetch('https://school-erp-11-mr7k.onrender.com/api/inquiry/all/inquiries', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!inquiryRes.ok || !admissionRes.ok) {
          toast.error('Failed to fetch inquiries');
          throw new Error('Failed to fetch data');
        }

        if (!inquiryRes.ok || !admissionRes.ok) {
          const inquiryErr = await inquiryRes.text();
          const admissionErr = await admissionRes.text();
          console.error('Error details:', { inquiryErr, admissionErr });
          toast.error('Failed to fetch dashboard data');
          throw new Error('Fetch failed');
        }

        const inquiryData = await inquiryRes.json();
        const admissionData = await admissionRes.json();
        
        // Map admission data to include student details from inquiries
        const enrichedAdmissions = admissionData.data.map(admission => {
          const correspondingInquiry = inquiryData.data.find(inq => inq.inquiryId === admission.inquiryId);
          return {
            ...admission,
            name: correspondingInquiry ? correspondingInquiry.name : 'N/A',
            email: correspondingInquiry ? correspondingInquiry.fatherEmail : 'N/A', // Assuming fatherEmail is the relevant email
          };
        });

        setInquiries(inquiryData.data);
        setAdmissions(enrichedAdmissions);

      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const DashboardCard = ({ title, value, color = "blue", icon }) => {
    // Map color prop to styles
    const colorMap = {
      blue: { text: "#2563eb", icon: "#3b82f6" },
      emerald: { text: "#059669", icon: "#10b981" },
      yellow: { text: "#d97706", icon: "#f59e0b" },
      red: { text: "#dc2626", icon: "#ef4444" },
      gray: { text: "#4b5563", icon: "#6b7280" },
    };
    const colorClass = colorMap[color] || colorMap.blue;

    return (
      <div 
        style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6',
          transition: 'all 0.3s',
          transform: 'translateY(0)',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.target.style.boxShadow = '0 25px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          e.target.style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>{title}</h3>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: colorClass.text }}>{value}</p>
          </div>
          {icon && (
            <div style={{ fontSize: '36px', color: colorClass.icon, opacity: 0.2 }}>
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  };

  const SearchBar = ({ placeholder, onSearch }) => (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 12px 12px 48px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            outline: 'none',
            transition: 'all 0.2s',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
          }}
        />
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          bottom: '0',
          paddingLeft: '12px',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          <svg style={{ height: '20px', width: '20px', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const getStatusStyle = (status) => {
      if (!status || typeof status !== 'string') return { backgroundColor: '#f3f4f6', color: '#1f2937', borderColor: '#e5e7eb' };
      switch (status.toLowerCase()) {
        case 'pending':
          return { backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fcd34d' };
        case 'processed':
          return { backgroundColor: '#d1fae5', color: '#065f46', borderColor: '#34d399' };
        case 'forwarded':
          return { backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#60a5fa' };
        case 'approved':
          return { backgroundColor: '#d1fae5', color: '#065f46', borderColor: '#34d399' };
        case 'rejected':
          return { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#f87171' };
        default:
          return { backgroundColor: '#f3f4f6', color: '#1f2937', borderColor: '#e5e7eb' };
      }
    };

    const style = getStatusStyle(status);

    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '14px',
        fontWeight: '500',
        border: `1px solid ${style.borderColor}`,
        backgroundColor: style.backgroundColor,
        color: style.color
      }}>
        {status}
      </span>
    );
  };

  const InquiryTable = ({ enquiries = [], title }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(5);

    const filteredInquiries = enquiries
      .filter(
        (inquiry) =>
          inquiry?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || // Student Name
          inquiry?.fatherName?.toLowerCase().includes(searchQuery.toLowerCase()) // Father Name
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, visibleCount);

    const handleShowMore = () => setVisibleCount((prev) => prev + 5);

    return (
      <div style={{ marginTop: '40px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid #e5e7eb',
            background: 'linear-gradient(to right, #eff6ff, #e0e7ff)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{title}</h2>
          </div>
          <div style={{ padding: '24px' }}>
            <SearchBar placeholder="Search inquiries..." onSearch={setSearchQuery} />
            <div style={{ overflowX: 'auto' }}>
              <table style={{ minWidth: '100%', width: '100%' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>ID</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Name</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Father Name</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Class</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Date</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((i) => (
                    <tr 
                      key={i._id} 
                      style={{ textAlign: 'center', transition: 'background-color 0.2s' }}
                      onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '16px' }}>{i.inquiryId}</td>
                      <td style={{ padding: '16px' }}>{i.name}</td>
                      <td style={{ padding: '16px' }}>{i.fatherName}</td>
                      <td style={{ padding: '16px' }}>{i.currentClass}</td>
                      <td style={{ padding: '16px' }}>{new Date(i.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}</td>
                      {
                        i.createdAt === i.updatedAt ?
                        <td style={{ padding: '16px' }}>
                          <button 
                            style={{
                              padding: '12px 24px',
                              backgroundColor: '#2563eb',
                              color: 'white',
                              borderRadius: '8px',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                            onClick={() => {
                              navigate(`/coordinator/enquiry/process/${i.inquiryId}`);
                            }}
                          >
                            Forward
                          </button>
                        </td> : 
                        <td style={{
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          border: '1px solid #fcd34d',
                          borderRadius: '8px',
                          fontSize: '20px',
                          fontWeight: '300',
                          padding: '16px'
                        }}>
                          Forwarded
                        </td>
                      }
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visibleCount < inquiries.length && (
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <button 
                  onClick={handleShowMore} 
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                  Show More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const AdmissionTable = ({ admissions, title }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(5);

    const filteredAdmissions = admissions
      .filter((admission) =>
          admission?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          admission?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          admission?.admissionApproved?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, visibleCount);

    const handleShowMore = () => setVisibleCount((prev) => prev + 5);

    return (
      <div style={{ marginTop: '40px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid #e5e7eb',
            background: 'linear-gradient(to right, #ecfdf5, #d1fae5)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{title}</h2>
          </div>
          <div style={{ padding: '24px' }}>
            <SearchBar placeholder="Search admissions..." onSearch={setSearchQuery} />
            <div style={{ overflowX: 'auto' }}>
              <table style={{ minWidth: '100%', width: '100%' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>ID</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Name</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Approval Status</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Forwarded Date</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmissions.map((admission) => (
                    <tr 
                      key={admission._id} 
                      style={{ textAlign: 'center', transition: 'background-color 0.2s' }}
                      onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '16px' }}>{admission.admissionId}</td>
                      <td style={{ padding: '16px' }}>{admission.name}</td>
                      <td style={{ padding: '16px' }}><StatusBadge status={admission.admissionApproved} /></td>
                      <td style={{ padding: '16px' }}>{new Date(admission.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}</td>
                      {
                        admission.admissionApproved === 'Approved' ?
                        <td style={{ padding: '16px' }}>
                          <button 
                            style={{
                              padding: '12px 24px',
                              backgroundColor: '#2563eb',
                              color: 'white',
                              borderRadius: '8px',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                            onClick={() => { // Changed onClick
                              // Navigate to the final admission form with inquiryId and admissionId
                              navigate(`/final/admission/form/${admission.inquiryId}/${admission.admissionId}`);
                            }}
                          >
                            Grant Admission
                          </button>
                        </td> : 
                        <td style={{ padding: '16px' }}>
                          <div style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#f87171',
                            textAlign: 'center'
                          }}>
                            Not Approved
                          </div>
                        </td>
                      }
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visibleCount < admissions.length && (
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <button 
                  onClick={handleShowMore} 
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#059669',
                    color: 'white',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#047857'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#059669'}
                >
                  Show More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)'
    }}>
      <CoordinatorNavbar />
      <div style={{ padding: '16px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px', color: '#111827' }}>
            Coordinator Dashboard
          </h1>
          <p style={{ fontSize: '18px', color: '#4b5563' }}>
            Manage inquiries and admissions efficiently
          </p>

          {/* Loading state */}
          {loading ? (
            <p style={{ marginTop: '40px', textAlign: 'center', color: '#6b7280' }}>Loading data...</p>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px',
                margin: '40px 0'
              }}>
                <DashboardCard title="Total Inquiries" value={inquiries.length} color="blue" icon="📝" />
                <DashboardCard title="Approved Admissions" value={admissions.filter(a => a.admissionApproved === "Approved").length} color="emerald" icon="🎓" />
                <DashboardCard title="Pending Reviews" value={admissions.filter(a => a.admissionApproved === "Pending").length} color="yellow" icon="⏳" />
              </div>

              <InquiryTable enquiries={inquiries} title="All Inquiry Details" />
              <AdmissionTable admissions={admissions} title="Admission Status Details" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;