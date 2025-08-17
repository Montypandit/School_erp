import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainNavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - ERP button */}
          <div className="flex-shrink-0">
            <button
              onClick={() => navigate('/')}
              className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors duration-200 px-4 py-2 rounded-md hover:bg-blue-100"
            >
              ERP
            </button>
          </div>

          {/* Right side - Contact and About buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/contact')}
              className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Contact
            </button>
            <button
              onClick={() => navigate('/about')}
              className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              About
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavBar;
