import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../../contexts/DarkModeContext';

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown') && !event.target.closest('.profile-button')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={handleProfileClick}
        className="profile-button w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-md flex items-center justify-center hover:scale-[1.02]"
      >
        <svg 
          className="w-5 h-5 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>

      {/* Profile Dropdown */}
      {isDropdownOpen && (
        <div className={`profile-dropdown absolute right-0 mt-2 w-56 backdrop-blur-md rounded-xl shadow-xl border py-2 animate-fadeIn transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/95 border-gray-600/30' 
            : 'bg-white/95 border-gray-300/30'
        }`}>
          <div className={`px-4 py-3 border-b transition-all duration-300 ${
            isDarkMode ? 'border-gray-600/50' : 'border-gray-200/50'
          }`}>
            <p className={`text-sm font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Farmer Account</p>
            <p className={`text-xs mt-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>farmer@example.com</p>
          </div>
          
          <button 
            onClick={() => navigate('/farmer/profile')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 transition-all duration-300 ${
              isDarkMode 
                ? 'text-gray-300 hover:bg-gray-600/30' 
                : 'text-gray-700 hover:bg-gray-200/30'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium">My Profile</span>
          </button>

          <button 
            onClick={() => navigate('/farmer/my-crops')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 transition-all duration-300 ${
              isDarkMode 
                ? 'text-gray-300 hover:bg-gray-600/30' 
                : 'text-gray-700 hover:bg-gray-200/30'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium">My Crops</span>
          </button>

          <button 
            onClick={() => navigate('/farmer/loan-history')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 transition-all duration-300 ${
              isDarkMode 
                ? 'text-gray-300 hover:bg-gray-600/30' 
                : 'text-gray-700 hover:bg-gray-200/30'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Loan History</span>
          </button>

          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleDarkMode}
            className={`w-full flex items-center justify-between px-4 py-2.5 transition-all duration-300 ${
              isDarkMode 
                ? 'text-gray-300 hover:bg-gray-600/30' 
                : 'text-gray-700 hover:bg-gray-200/30'
            }`}
          >
            <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              <span className="font-medium">Dark Mode</span>
            </div>
            
            {/* Toggle Switch */}
            <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isDarkMode ? 'bg-emerald-600' : 'bg-gray-300'}`}>
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-5' : 'translate-x-1'}`}
              />
            </div>
          </button>

          <div className={`border-t mt-2 transition-all duration-300 ${
            isDarkMode ? 'border-gray-600/50' : 'border-gray-200/50'
          }`}>
            <button 
              onClick={() => navigate('/auth')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 transition-all duration-300 text-red-600 ${
                isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
