import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../../../contexts/DarkModeContext';

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDarkMode } = useDarkMode();

  const languages = [
    { code: 'english', name: 'English' },
    { code: 'hindi', name: 'हिंदी' },
    { code: 'bengali', name: 'বাংলা' }
  ];

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language.code);
    setIsDropdownOpen(false);
    console.log('Language changed to:', language.code);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.language-dropdown') && !event.target.closest('.language-button')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="language-button flex items-center space-x-2 backdrop-blur-md border pl-4 pr-2 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] bg-gray-800/30 border-gray-600/60 text-gray-400 hover:bg-gray-700/30 hover:text-gray-300"
      >
        {/* <span className="text-lg">
          {languages.find(lang => lang.code === selectedLanguage)?.flag}
        </span> */}
        <span className="text-sm font-medium hidden sm:block">
          {languages.find(lang => lang.code === selectedLanguage)?.name}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="language-dropdown absolute right-0 mt-2 w-48 backdrop-blur-md rounded-xl shadow-xl border py-2 animate-fadeIn transition-all duration-300 bg-[#010101] border-gray-600">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 transition-all duration-300 ${
                selectedLanguage === language.code 
                  ? 'bg-brand-teal/20 text-gray-300 border border-brand-teal/40' 
                  : 'text-gray-400 hover:bg-gray-600/30'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
              {selectedLanguage === language.code && (
                <svg className="w-4 h-4 ml-auto text-brand-teal" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
