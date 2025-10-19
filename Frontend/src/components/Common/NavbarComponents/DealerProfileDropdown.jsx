import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DealerProfileDropdown = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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
        className="profile-button w-10 h-10 bg-gradient-to-br from-[#010101] to-[#1a1a1a] rounded-full flex items-center justify-center hover:shadow-lg transition transform hover:scale-105"
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

      {isDropdownOpen && (
        <div className="profile-dropdown absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-fadeIn">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">Dealer Account</p>
            <p className="text-xs text-gray-500 mt-1">dealer@example.com</p>
          </div>
          
          <button 
            onClick={() => navigate('/dealer/profile')}
            className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium">My Profile</span>
          </button>

          <div className="border-t border-gray-100 mt-2">
            <button 
              onClick={() => navigate('/auth')}
              className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-red-50 transition text-red-600"
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

export default DealerProfileDropdown;
