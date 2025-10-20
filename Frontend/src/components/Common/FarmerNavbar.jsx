import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavLinks from './NavbarComponents/NavLinks';
import LanguageSelector from './NavbarComponents/LanguageSelector';
import ProfileDropdown from './NavbarComponents/ProfileDropdown';

const FarmerNavbar = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <>
      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20"></div>

      {/* Fixed Floating Navbar */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="bg-white/25 backdrop-blur-sm rounded-full border-2 border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            
            {/* Logo - Left Side */}
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition"
              onClick={handleLogoClick}
            >
              <img src="\logo.png" alt="" className='w-8 h-auto rounded-sm' />
              <span className="text-lg font-bold text-gray-900">Kisan Mitra</span>
            </div>

            {/* Center - Navigation Links */}
            <NavLinks />

            {/* Right Side - Language Selector & Profile */}
            <div className="flex items-center space-x-3">
              <LanguageSelector />
              <ProfileDropdown />
            </div>
          </div>
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
