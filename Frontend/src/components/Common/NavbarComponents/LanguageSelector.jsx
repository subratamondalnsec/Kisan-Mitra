import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../../../contexts/DarkModeContext';
import { useLanguage } from '../../../contexts/LanguageContext';

const LanguageSelector = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDarkMode } = useDarkMode();
  const { currentLanguage, changeLanguage } = useLanguage();

  const languages = [
    { code: 'english', name: 'English', flag: '🇺🇸' },
    { code: 'hindi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'bengali', name: 'বাংলা', flag: '🇧🇩' }
  ];

  const handleLanguageChange = (language) => {
    changeLanguage(language.code);
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
        className={`language-button flex items-center space-x-2 backdrop-blur-md border pl-4 pr-2 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
          isDarkMode
            ? 'bg-gray-800/30 border-gray-600/60 text-gray-300 hover:bg-gray-700/30 hover:text-gray-200'
            : 'bg-white/30 border-gray-300 text-gray-600 hover:bg-gray-100/30 hover:text-gray-700'
        }`}
      >
        <span className="text-lg">
          {languages.find(lang => lang.code === currentLanguage)?.flag}
        </span>
        <span className="text-sm font-medium hidden sm:block">
          {languages.find(lang => lang.code === currentLanguage)?.name}
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
        <div className={`language-dropdown absolute right-0 mt-2 w-48 backdrop-blur-md rounded-xl shadow-xl border py-2 animate-fadeIn transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/95 border-gray-600/30' 
            : 'bg-white/95 border-gray-300/30'
        }`}>
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 transition-all duration-300 ${
                currentLanguage === language.code 
                  ? isDarkMode 
                    ? 'bg-gray-600/50 text-white border border-gray-500/30' 
                    : 'bg-gray-200/50 text-gray-700 border border-gray-300/30'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-600/30'
                    : 'text-gray-600 hover:bg-gray-200/30'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
              {currentLanguage === language.code && (
                <svg className={`w-4 h-4 ml-auto ${
                  isDarkMode ? 'text-white' : 'text-gray-700'
                }`} fill="currentColor" viewBox="0 0 20 20">
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
