import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LanguageSelector from './NavbarComponents/LanguageSelector';
import DealerProfileDropdown from './NavbarComponents/DealerProfileDropdown';
import { useDarkMode } from '../../contexts/DarkModeContext';

const DealerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('dashboard');
  const { isDarkMode } = useDarkMode();

  const handleLogoClick = () => {
    navigate('/');
  };

  // Update active section based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('dashboard')) {
      setActiveSection('dashboard');
    } else if (path.includes('crops')) {
      setActiveSection('crops');
    } else if (path.includes('orders')) {
      setActiveSection('orders');
    } else if (path.includes('analytics')) {
      setActiveSection('analytics');
    } else if (path.includes('profile')) {
      setActiveSection('profile');
    } else {
      setActiveSection('dashboard');
    }
  }, [location.pathname]);

  const getLinkClasses = (section) => {
    const baseClasses = "px-6 py-2 rounded-lg transition-all duration-300 font-medium";
    
    if (activeSection === section) {
      return `${baseClasses} ${
        isDarkMode
          ? 'text-white bg-gray-600/50 border border-gray-500/50'
          : 'text-gray-700 bg-gray-200/50 border border-gray-300/50'
      }`;
    } else {
      return `${baseClasses} ${
        isDarkMode
          ? 'text-gray-300 hover:bg-gray-600/30'
          : 'text-gray-600 hover:bg-gray-300/30'
      }`;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dealer/dashboard' },
    { id: 'crops', label: 'My Crops', path: '/dealer/crops' },
    { id: 'orders', label: 'Orders', path: '/dealer/orders' },
    { id: 'analytics', label: 'Analytics', path: '/dealer/analytics' }
  ];

  return (
    <>
      {/* Fixed Navbar with Glassmorphic Design */}
      <nav className="fixed top-0 mx-auto w-full px-8 py-4 flex justify-between items-center z-50">
        {/* Logo Section - Left */}
        <div
          onClick={handleLogoClick}
          className={`p-2 backdrop-blur-md rounded-md cursor-pointer transition-all duration-300 hover:scale-110 ${
            isDarkMode
              ? 'bg-gray-800/50 border border-gray-600/30 hover:bg-gray-700/60'
              : 'bg-white/30 border border-gray-200/30 hover:bg-white/50'
          }`}
        >
          <img
            src="/logo.png"
            alt="Kisan Mitra Logo"
            className="w-10 h-10 rounded-sm"
          />
        </div>

        {/* Center Navigation - Glassmorphic Design */}
        <div className={`hidden md:flex space-x-1 backdrop-blur-md rounded-xl px-2 py-2 transition-all duration-300 ${
          isDarkMode
            ? 'bg-gray-800/50 border border-gray-600/30'
            : 'bg-white/20 border border-gray-300'
        }`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={getLinkClasses(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Section - Profile & Language */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className={`p-2 rounded-lg transition-all duration-300 ${
              isDarkMode
                ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <LanguageSelector />
          <DealerProfileDropdown />
        </div>
      </nav>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default DealerNavbar;
