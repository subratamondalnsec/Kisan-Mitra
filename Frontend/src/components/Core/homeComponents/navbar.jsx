import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'about'];
      const scrollPosition = window.scrollY + 100; // Offset for navbar height

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getLinkClasses = (section) => {
    const baseClasses = "px-6 py-2 rounded-lg transition-all duration-300";
    const activeClasses = "text-gray-300 bg-gray-700/50 border border-gray-400/30";
    const inactiveClasses = "text-gray-400 hover:bg-gray-700/30";
    
    return `${baseClasses} ${activeSection === section ? activeClasses : inactiveClasses}`;
  };
  return (
    <nav className="fixed top-0 mx-auto w-full p-4 flex justify-between items-center z-50">
      <div
        onClick={() => navigate('/')}
       className="p-2 backdrop-blur-md rounded-md ml-6 cursor-pointer">
        <img
          src="/logo.png"
          alt="Kisan Mitra Logo"
          className="w-10 h-10 rounded-sm"
        />
      </div>

      <div className="hidden md:flex space-x-1 bg-[#010101]/20 backdrop-blur-sm rounded-xl px-2 py-2">
        <a
          href="#hero"
          className={getLinkClasses('hero')}
        >
          Home
        </a>
        <a
          href="#features"
          className={getLinkClasses('features')}
        >
          Service
        </a>
        <a
          href="#about"
          className={getLinkClasses('about')}
        >
          About
        </a>
      </div>

      <button 
        onClick={() => navigate('/auth')}
        className="flex items-center space-x-2 backdrop-blur-md border border-gray-400 text-gray-400 px-6 py-3 rounded-xl hover:bg-gray-400 hover:text-primary transition-all duration-300 transform hover:scale-[1.02]"
      >
        <span className="font-semibold">Get Started</span>
      </button>
    </nav>
  );
};

export default Navbar;
