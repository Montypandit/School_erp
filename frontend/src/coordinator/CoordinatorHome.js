import React, { useState } from 'react';
import CoordinatorNavbar from '../component/coordinator/CoordinatorNavbar';

const CoordinatorDashboard = () => {
  const inquiriesData = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "Pending", date: "2025-06-01" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Processed", date: "2025-06-02" },
    { id: 3, name: "Alice Brown", email: "alice@example.com", status: "Forwarded", date: "2025-06-03" },
    { id: 4, name: "Bob Wilson", email: "bob@example.com", status: "Pending", date: "2025-06-04" },
    { id: 5, name: "Emma Davis", email: "emma@example.com", status: "Processed", date: "2025-06-05" },
    { id: 6, name: "Tom Clark", email: "tom@example.com", status: "Forwarded", date: "2025-06-06" },
  ];

  const admissionsData = [
    { id: 1, name: "John Doe", status: "Approved", date: "2025-06-01" },
    { id: 2, name: "Jane Smith", status: "Pending", date: "2025-06-02" },
    { id: 3, name: "Alice Brown", status: "Rejected", date: "2025-06-03" },
    { id: 4, name: "Bob Wilson", status: "Approved", date: "2025-06-04" },
    { id: 5, name: "Emma Davis", status: "Pending", date: "2025-06-05" },
    { id: 6, name: "Tom Clark", status: "Rejected", date: "2025-06-06" },
  ];

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

  const InquiryTable = ({ inquiries, title }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(5);

    const filteredInquiries = inquiries
      .filter(
        (inquiry) =>
          inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inquiry.status.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, visibleCount);

    const handleShowMore = () => {
      setVisibleCount((prev) => prev + 5);
    };

    return (
      <div className="mt-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
          <div className="p-6">
            <SearchBar
              placeholder="Search inquiries by name, email, or status"
              onSearch={setSearchQuery}
            />
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">{inquiry.id}</td>
                      <td className="py-4 px-4 text-sm text-gray-900">{inquiry.name}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{inquiry.email}</td>
                      <td className="py-4 px-4 text-sm">
                        <StatusBadge status={inquiry.status} />
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{inquiry.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visibleCount < inquiries.filter(
              (inquiry) =>
                inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inquiry.status.toLowerCase().includes(searchQuery.toLowerCase())
            ).length && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleShowMore}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
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
      .filter(
        (admission) =>
          admission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          admission.status.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, visibleCount);

    const handleShowMore = () => {
      setVisibleCount((prev) => prev + 5);
    };

    return (
      <div className="mt-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
          <div className="p-6">
            <SearchBar
              placeholder="Search admissions by name or status"
              onSearch={setSearchQuery}
            />
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAdmissions.map((admission) => (
                    <tr key={admission.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">{admission.id}</td>
                      <td className="py-4 px-4 text-sm text-gray-900">{admission.name}</td>
                      <td className="py-4 px-4 text-sm">
                        <StatusBadge status={admission.status} />
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{admission.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visibleCount < admissions.filter(
              (admission) =>
                admission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                admission.status.toLowerCase().includes(searchQuery.toLowerCase())
            ).length && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleShowMore}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
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

  // Calculate statistics
  const totalInquiries = inquiriesData.length;
  const processedInquiries = inquiriesData.filter(
    (i) => i.status === "Processed" || i.status === "Forwarded"
  ).length;
  const forwardedInquiries = inquiriesData.filter(
    (i) => i.status === "Forwarded"
  );
  const totalApprovedAdmissions = admissionsData.filter(
    (a) => a.status === "Approved"
  ).length;
  const totalPendingAdmissions = admissionsData.filter(
    (a) => a.status === "Pending"
  ).length;
  const totalRejectedAdmissions = admissionsData.filter(
    (a) => a.status === "Rejected"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <CoordinatorNavbar/>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Coordinator Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Manage inquiries and admissions efficiently
            </p>
          </div>

          {/* Main Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <DashboardCard
              title="Total Inquiries"
              value={totalInquiries}
              color="blue"
              icon="📝"
            />
            <DashboardCard
              title="Processed Inquiries"
              value={processedInquiries}
              color="green"
              icon="✅"
            />
            <DashboardCard
              title="Approved Admissions"
              value={totalApprovedAdmissions}
              color="emerald"
              icon="🎓"
            />
            <DashboardCard
              title="Pending Reviews"
              value={totalPendingAdmissions}
              color="yellow"
              icon="⏳"
            />
          </div>

          {/* Tables */}
          <InquiryTable inquiries={inquiriesData} title="All Inquiry Details" />
          <InquiryTable
            inquiries={forwardedInquiries}
            title="Forwarded Inquiry Details"
          />
          <AdmissionTable
            admissions={admissionsData}
            title="Admission Status Details"
          />
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;