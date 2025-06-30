import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * TeacherNavbar component
 *
 * A responsive navigation bar for the Teacher Portal.
 * Styled with a green and emerald theme to distinguish it from other portals.
 * Features a logo, desktop navigation links for teacher-specific tasks, a user icon, and a logout button.
 * Includes a mobile-friendly hamburger menu.
 *
 * @component
 * @example
 * return (
 *   <TeacherNavbar />
 * )
 */
const TeacherNavbar = () => {
  /**
   * State to manage the visibility of the mobile navigation menu.
   * @type {[boolean, function(boolean): void]}
   */
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles the user logout process.
   * Removes the teacher's token from session storage and navigates to the main login page.
   */
  const handleLogout = () => {
    sessionStorage.removeItem('teacherToken');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                ERP
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-800 hidden sm:block">
                Teacher Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex flex-1 justify-center ">
            <div className="flex items-center">
              <Link
                to="/teacher/home"
                className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Dashboard
              </Link>
              <Link
                to="/teacher/classes"
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                My Classes
              </Link>
              <Link
                to="/teaching/schedule"
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Schedule
              </Link>
              <Link
                to="/teacher/attendance"
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Attendance
              </Link>
              <Link
                to="/teacher/grades"
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Grades
              </Link>
              <Link
                to="/teacher/students"
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Students
              </Link>
              <Link
                to="/teacher/assignments"
                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Assignments
              </Link>
            </div>
          </div>

          {/* Right Section - User Icon and Logout */}
          <div className="flex items-center justify-end gap-4">
            {/* User Icon */}
            <div className="w-9 h-9 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center font-semibold shadow-md">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>

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
              to="/teacher/home"
              className="bg-green-100 text-green-800 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/teaching/schedule"
              className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Classes
            </Link>
            <Link
              to="/teacher/schedule"
              className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Schedule
            </Link>
            <Link
              to="/teacher/attendance"
              className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Attendance
            </Link>
            <Link
              to="/teacher/grades"
              className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Grades
            </Link>
            <Link
              to="/teacher/students"
              className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Students
            </Link>
            <Link
              to="/teacher/assignments"
              className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Assignments
            </Link>
            <hr className="my-2 border-gray-200" />
            <button
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50 hover:text-red-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TeacherNavbar;