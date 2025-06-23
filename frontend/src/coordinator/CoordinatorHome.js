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
        const admissionRes = await fetch('http://localhost:5000/api/admissions/get/all/admission/approval/status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const inquiryRes = await fetch('http://localhost:5000/api/inquiry/all/inquiries', {
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

        setInquiries(inquiryData.data);
        setAdmissions(admissionData.data);

      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        console.log('hello finally')
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const DashboardCard = ({ title, value, color = "blue", icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
          <p className={`text-4xl font-bold text-${color}-600`}>{value}</p>
        </div>
        {icon && (
          <div className={`text-4xl text-${color}-500 opacity-20`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );

  const SearchBar = ({ placeholder, onSearch }) => (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const getStatusStyle = (status) => {
      if (!status || typeof status !== 'string') return 'bg-gray-100 text-gray-800 border-gray-200';
      switch (status.toLowerCase()) {
        case 'pending':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'processed':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'forwarded':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'approved':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'rejected':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(status)}`}>
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
          inquiry?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inquiry?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inquiry?.status?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, visibleCount);

    const handleShowMore = () => setVisibleCount((prev) => prev + 5);

    return (
      <div className="mt-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
          <div className="p-6">
            <SearchBar placeholder="Search inquiries..." onSearch={setSearchQuery} />
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200" >
                    <th className="py-4 px-4">ID</th>
                    <th className="py-4 px-4">Name</th>
                    <th className="py-4 px-4">Father Name</th>
                    <th className="py-4 px-4">Class</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((i) => (
                    <tr key={i._id} className="hover:bg-gray-50 text-center">
                      <td className="py-4 px-4 ">{i.inquiryId}</td>
                      <td className="py-4 px-4">{i.name}</td>
                      <td className="py-4 px-4">{i.fatherName}</td>
                      <td className="py-4 px-4">{i.currentClass}</td>
                      <td className="py-4 px-4">{new Date(i.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}</td>
                      <td className="py-4 px-4"><button className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700' onClick={() => {
                        navigate('/parents/inquiry/form');
                      }}>Forward</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visibleCount < inquiries.length && (
              <div className="mt-6 text-center">
                <button onClick={handleShowMore} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
      .filter(
        (inquiry) =>
          inquiry?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inquiry?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inquiry?.status?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, visibleCount);

    const handleShowMore = () => setVisibleCount((prev) => prev + 5);

    return (
      <div className="mt-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
          <div className="p-6">
            <SearchBar placeholder="Search admissions..." onSearch={setSearchQuery} />
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 px-4">ID</th>
                    <th className="py-4 px-4">Name</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmissions.map((admission) => (
                    <tr key={admission.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">{admission.id}</td>
                      <td className="py-4 px-4">{admission.name}</td>
                      <td className="py-4 px-4">{admission.date}</td>
                      <td className="py-4 px-4"><StatusBadge status={admission.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visibleCount < admissions.length && (
              <div className="mt-6 text-center">
                <button onClick={handleShowMore} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <CoordinatorNavbar />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Coordinator Dashboard</h1>
          <p className="text-lg text-gray-600">Manage inquiries and admissions efficiently</p>

          {/* Loading state */}
          {loading ? (
            <p className="mt-10 text-center text-gray-500">Loading data...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-10">
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
