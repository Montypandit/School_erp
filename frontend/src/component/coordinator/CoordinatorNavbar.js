import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CoordinatorNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('coordinatorToken');
    navigate('/coordinator/login');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                ERP
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-800 hidden sm:block">
                Coordinator Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/coordinator/home"
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Dashboard
              </Link>
              <Link
                to="/reports"
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Reports
              </Link>
              <Link
                to="/admission-status"
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Admission
              </Link>
              <Link
                to="/coordinator/student-allotment"
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Student Allotment
              </Link>
              <Link
                to="/coordinator/all/fee/details"
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Generate Fees
              </Link>
            </div>
          </div>

          {/* Profile/Logout Section */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-gray-50 px-3 py-2 transition-colors duration-200"
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold shadow-md">
                C
              </div>
              <span className="ml-3 text-gray-700 font-medium hidden sm:block">
                Coordinator
              </span>
              <svg
                className={`ml-2 h-4 w-4 text-gray-500 transition-transform duration-200 ${
                  isProfileOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Desktop Dropdown Menu */}
            {isProfileOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 border border-gray-100">
                <div className="py-2">
                  <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                    <div className="font-semibold text-gray-900">John Coordinator</div>
                    <div className="text-gray-500 text-xs mt-1">coordinator@example.com</div>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </Link>
                  <hr className="my-2 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 rounded-b-xl"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <svg
                className={`h-6 w-6 transition-transform duration-200 ${
                  isMobileMenuOpen ? 'rotate-90' : ''
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

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-gray-50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/coordinator/home"
                className="bg-blue-100 text-blue-800 block px-3 py-2 rounded-md text-base font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/reports"
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                Reports
              </Link>
              <Link
                to="/admission-status"
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                Admission Status
              </Link>
              <Link
                to="/coordinator/enquiry"
                className="bg-green-100 text-green-800 hover:bg-green-200 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                Enquiry
              </Link>
              <hr className="my-2 border-gray-200" />
              <div className="px-3 py-2">
                <div className="text-sm font-medium text-gray-800">John Coordinator</div>
                <div className="text-xs text-gray-500">coordinator@example.com</div>
              </div>
              <Link
                to="/profile"
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                Your Profile
              </Link>
              <Link
                to="/settings"
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:bg-red-50 hover:text-red-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default CoordinatorNavbar;