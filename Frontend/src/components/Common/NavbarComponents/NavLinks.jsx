import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDarkMode } from '../../../contexts/DarkModeContext';

const NavLinks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode } = useDarkMode();

  const navLinks = [
    { name: 'Dashboard', path: '/farmer/dashboard' },
    { name: 'Crop Analysis', path: '/farmer/crop-analysis'},
    { name: 'Instant Loan', path: '/farmer/loan' },
    { name: 'e-Mandi', path: '/farmer/emandi' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const getLinkClasses = (path) => {
    const baseClasses = "w-full text-left px-6 py-2 rounded-lg transition-all duration-300 font-medium";
    const activeClasses = isDarkMode 
      ? "text-white bg-gray-600/50 border border-gray-500/30"
      : "text-gray-700 bg-gray-200/50 border border-gray-300/30";
    const inactiveClasses = isDarkMode
      ? "text-gray-300 hover:bg-gray-600/50"
      : "text-gray-500 hover:bg-gray-300/50";
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  return (
    <>
      {/* Mobile Navigation Toggle - matches navbar.jsx button style */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`md:hidden p-2 backdrop-blur-md rounded-md transition ${
          isDarkMode
            ? 'text-gray-300 hover:text-white hover:bg-gray-600/50'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300/50'
        }`}
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 animate-fadeIn" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className={`fixed right-0 top-0 h-full w-64 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-out ${
              isDarkMode ? 'bg-gray-800/95' : 'bg-white/95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Navigation</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2 rounded-lg transition ${
                    isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-600/30'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/30'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Mobile Navigation - matches center pills design */}
              <div className={`space-y-1 backdrop-blur-sm rounded-xl px-2 py-2 ${
                isDarkMode ? 'bg-gray-700/20' : 'bg-white/20'
              }`}>
                {navLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className={getLinkClasses(link.path)}
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavLinks;
