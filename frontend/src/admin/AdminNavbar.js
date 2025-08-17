import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
 
const AdminNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState({ name: '', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem('adminInfo');
    if (stored) {
      setAdminInfo(JSON.parse(stored));
    }
  }, []);


  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('email')
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                <Link to="/">ERP</Link>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-800 hidden sm:block">
                Admin Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/home"
                className="bg-blue-100 hover:bg-blue-200 text-black-800 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/employee/page"
                className="text-gray-600 hover:bg-blue-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Employees
              </Link>
              <Link
                to="/admin/allstudents"
                className="text-gray-600 hover:bg-blue-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Students
              </Link>
              <Link
                to="/admin/examschedule"
                className="text-gray-600 hover:bg-blue-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Exam Schedule
              </Link>
              <Link
                to="/admin/leaveapproval"
                className="text-gray-600 hover:bg-blue-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Leave Approval
              </Link>
            </div>
          </div>

          {/* Right Section - User Icon and Logout */}
          <div className="flex items-center justify-end gap-4">
            {/* User Icon */}
            <Link
              to="/employee/profile"
              className="w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center font-semibold shadow-md"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <svg
                className={`h-6 w-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-gray-50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
                to="/admin/home"
                className="bg-blue-100 text-blue-800 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/employees"
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Employees
              </Link>
              <Link
                to="/admin/allstudents"
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Students
              </Link>
              <Link
                to="/admin/examschedule"
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Exam Schedule
              </Link>
              <Link
                to="/admin/leaveapproval"
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Leave Approval
              </Link>
            </div>
          </div>
        )}
    </nav>
  );
};

export default AdminNavbar;






// import React, { useState, useEffect } from 'react';

// const AdminNavbar = () => {
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
//   const [adminInfo, setAdminInfo] = useState({ name: '', email: '' });
//   const [announcementData, setAnnouncementData] = useState({
//     title: '',
//     content: '',
//     targetAudience: 'all',
//     priority: 'medium',
//     expiryDate: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     // Demo data - in real app this would come from sessionStorage
//     setAdminInfo({ name: 'Admin User', email: 'admin@erp.com' });
//   }, []);

//   const handleLogout = () => {
//     alert('Logout clicked - would normally clear session and redirect');
//   };

//   const handleAnnouncementSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // Demo simulation - in real app this would be an actual API call
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
//       // In a real app, you would make an API call like this:
//       /*
//       const token = sessionStorage.getItem('adminToken');
//       const response = await fetch('/api/announcements', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           title: announcementData.title.trim(),
//           content: announcementData.content.trim(),
//           targetAudience: announcementData.targetAudience,
//           priority: announcementData.priority,
//           expiryDate: announcementData.expiryDate || null,
//           createdBy: adminInfo.email,
//           createdAt: new Date().toISOString(),
//           isActive: true
//         })
//       });
//       */
      
//       alert(`Announcement created successfully!
// Title: ${announcementData.title}
// Target: ${announcementData.targetAudience}
// Priority: ${announcementData.priority}`);
      
//       // Reset form
//       setAnnouncementData({
//         title: '',
//         content: '',
//         targetAudience: 'all',
//         priority: 'medium',
//         expiryDate: ''
//       });
//       setIsAnnouncementModalOpen(false);
      
//     } catch (error) {
//       console.error('Error creating announcement:', error);
//       alert('Error creating announcement. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const resetAnnouncementForm = () => {
//     setAnnouncementData({
//       title: '',
//       content: '',
//       targetAudience: 'all',
//       priority: 'medium',
//       expiryDate: ''
//     });
//   };

//   const handleModalClose = () => {
//     setIsAnnouncementModalOpen(false);
//     resetAnnouncementForm();
//   };

//   return (
//     <>
//       <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo Section */}
//             <div className="flex items-center flex-shrink-0">
//               <div className="flex items-center">
//                 <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-xl shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
//                   ERP
//                 </div>
//                 <span className="ml-3 text-xl font-semibold text-gray-800 hidden sm:block">
//                   Admin Portal
//                 </span>
//               </div>
//             </div>

//             {/* Desktop Navigation Links */}
//             <div className="hidden md:block">
//               <div className="flex items-center space-x-4">
//                 <a
//                   href="#"
//                   className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
//                 >
//                   Dashboard
//                 </a>
//                 <a
//                   href="#"
//                   className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
//                 >
//                   Employees
//                 </a>
//                 <a
//                   href="#"
//                   className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
//                 >
//                   Students
//                 </a>
//                 <a
//                   href="#"
//                   className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
//                 >
//                   Exam Schedule
//                 </a>
//                 <a
//                   href="#"
//                   className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
//                 >
//                   Leave Approval
//                 </a>
//               </div>
//             </div>

//             {/* Right Section - Announcement, User Icon and Logout */}
//             <div className="flex items-center justify-end gap-4">
//               {/* Announcement Button */}
//               <button
//                 onClick={() => setIsAnnouncementModalOpen(true)}
//                 className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
//               >
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
//                   />
//                 </svg>
//                 <span className="hidden sm:inline">Announce</span>
//               </button>

//               {/* Logout Button */}
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
//               >
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                   />
//                 </svg>
//                 <span>Logout</span>
//               </button>

//               {/* Mobile menu button */}
//               <div className="md:hidden">
//                 <button
//                   onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                   className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
//                 >
//                   <svg
//                     className={`h-6 w-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     {isMobileMenuOpen ? (
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                     ) : (
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                     )}
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Navigation Menu */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden border-t border-gray-200 bg-gray-50">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               <a
//                 href="#"
//                 className="bg-blue-100 text-blue-800 block px-3 py-2 rounded-md text-base font-medium"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Dashboard
//               </a>
//               <a
//                 href="#"
//                 className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Employees
//               </a>
//               <a
//                 href="#"
//                 className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Students
//               </a>
//               <a
//                 href="#"
//                 className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Exam Schedule
//               </a>
//               <a
//                 href="#"
//                 className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Leave Approval
//               </a>
//               {/* Mobile Announcement Button */}
//               <button
//                 onClick={() => {
//                   setIsAnnouncementModalOpen(true);
//                   setIsMobileMenuOpen(false);
//                 }}
//                 className="text-green-600 hover:bg-green-50 hover:text-green-800 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 w-full text-left"
//               >
//                 Create Announcement
//               </button>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Announcement Modal */}
//       {isAnnouncementModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800">Create Announcement</h2>
//                 <button
//                   onClick={handleModalClose}
//                   className="text-gray-500 hover:text-gray-700 transition-colors"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 {/* Title */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Announcement Title *
//                   </label>
//                   <input
//                     type="text"
//                     value={announcementData.title}
//                     onChange={(e) => setAnnouncementData({...announcementData, title: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter announcement title"
//                     required
//                     maxLength={100}
//                   />
//                 </div>

//                 {/* Content */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Content *
//                   </label>
//                   <textarea
//                     value={announcementData.content}
//                     onChange={(e) => setAnnouncementData({...announcementData, content: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter announcement content"
//                     rows="4"
//                     required
//                     maxLength={1000}
//                   />
//                   <p className="text-sm text-gray-500 mt-1">
//                     {announcementData.content.length}/1000 characters
//                   </p>
//                 </div>

//                 {/* Target Audience */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Target Audience *
//                   </label>
//                   <select
//                     value={announcementData.targetAudience}
//                     onChange={(e) => setAnnouncementData({...announcementData, targetAudience: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   >
//                     <option value="all">All Users</option>
//                     <option value="students">Students Only</option>
//                     <option value="teachers">Teachers Only</option>
//                     <option value="coordinators">Coordinators Only</option>
//                     <option value="staff">Staff Members</option>
//                     <option value="faculty">Faculty (Teachers + Coordinators)</option>
//                   </select>
//                 </div>

//                 {/* Priority */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Priority
//                   </label>
//                   <select
//                     value={announcementData.priority}
//                     onChange={(e) => setAnnouncementData({...announcementData, priority: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="low">Low</option>
//                     <option value="medium">Medium</option>
//                     <option value="high">High</option>
//                     <option value="urgent">Urgent</option>
//                   </select>
//                 </div>

//                 {/* Expiry Date */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Expiry Date (Optional)
//                   </label>
//                   <input
//                     type="date"
//                     value={announcementData.expiryDate}
//                     onChange={(e) => setAnnouncementData({...announcementData, expiryDate: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     min={new Date().toISOString().split('T')[0]}
//                   />
//                   <p className="text-sm text-gray-500 mt-1">
//                     Leave empty for permanent announcement
//                   </p>
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={handleModalClose}
//                     className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
//                     disabled={isSubmitting}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     disabled={isSubmitting || !announcementData.title.trim() || !announcementData.content.trim()}
//                   >
//                     {isSubmitting ? 'Creating...' : 'Create Announcement'}
//                   </button>
//                 </div>
//                               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AdminNavbar;
