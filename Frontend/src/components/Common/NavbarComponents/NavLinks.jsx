import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavLinks = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/farmer/dashboard' },
    { name: 'Crop Analysis', path: '/farmer/crop-analysis'},
    { name: 'Instant Loan', path: '/farmer/loan' },
    { name: 'e-Mandi', path: '/farmer/emandi' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="hidden lg:flex items-center space-x-1">
      {navLinks.map((link) => (
        <button
          key={link.path}
          onClick={() => navigate(link.path)}
          className={`px-5 py-2 rounded-full font-medium transition-all ${
            isActive(link.path)
              ? 'bg-[#010101] text-white shadow-sm'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {link.name}
        </button>
      ))}
    </div>
  );
};

export default NavLinks;
