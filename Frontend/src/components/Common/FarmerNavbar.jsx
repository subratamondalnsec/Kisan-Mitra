import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavLinks from './NavbarComponents/NavLinks';
import LanguageSelector from './NavbarComponents/LanguageSelector';
import ProfileDropdown from './NavbarComponents/ProfileDropdown';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useTranslation } from '../../hooks/useTranslation';

const FarmerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('dashboard');
  const { isDarkMode } = useDarkMode();
  const { t } = useTranslation();

  const handleLogoClick = () => {
    navigate('/');
  };

  // Update active section based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('dashboard')) {
      setActiveSection('dashboard');
    } else if (path.includes('crop-analysis')) {
      setActiveSection('crop-analysis');
    } else if (path.includes('loan')) {
      setActiveSection('loan');
    } else if (path.includes('emandi')) {
      setActiveSection('emandi');
    } else if (path.includes('profile')) {
      setActiveSection('profile');
    } else {
      setActiveSection('dashboard');
    }
  }, [location.pathname]);

  const getLinkClasses = (section) => {
    const baseClasses = "px-6 py-2 rounded-lg transition-all duration-300";
    const activeClasses = isDarkMode 
      ? "text-white bg-gray-600/50 border border-gray-500/50"
      : "text-gray-700 bg-gray-200/50 border border-gray-300/50";
    const inactiveClasses = isDarkMode
      ? "text-gray-300 hover:bg-gray-600/30"
      : "text-gray-600 hover:bg-gray-300/30";
    
    return `${baseClasses} ${activeSection === section ? activeClasses : inactiveClasses}`;
  };

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), path: '/farmer/dashboard' },
    { id: 'crop-analysis', label: t('cropAnalysis'), path: '/farmer/crop-analysis' },
    { id: 'loan', label: t('instantLoan'), path: '/farmer/loan' },
    { id: 'emandi', label: t('eEmandi'), path: '/farmer/emandi' }
  ];

  return (
    <>
      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20"></div>

      {/* Fixed Navbar - Exact same structure as navbar.jsx */}
      <nav className="fixed top-0 mx-auto w-full px-8 py-4 flex justify-between items-center z-[100]">
        {/* Logo Section - Left */}
        <div
          onClick={handleLogoClick}
          className="p-2 backdrop-blur-md rounded-md cursor-pointer"
        >
          <img
            src="/logo.png"
            alt="Kisan Mitra Logo"
            className="w-10 h-10 rounded-sm"
          />
        </div>

        {/* Center Navigation - Glassmorphic design with dark mode */}
        <div className={`hidden md:flex space-x-1 backdrop-blur-sm border rounded-xl px-2 py-2 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/30 border-gray-600/60' 
            : 'bg-white/30 border-gray-300'
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
          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavLinks />
          </div>
          
          <LanguageSelector />
          <ProfileDropdown />
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

export default FarmerNavbar;
