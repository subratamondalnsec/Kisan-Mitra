import React, { useState, useEffect } from 'react';

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const languages = [
    { code: 'english', name: 'English', flag: '🇬🇧' },
    { code: 'hindi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'bengali', name: 'বাংলা', flag: '🇮🇳' }
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
        className="language-button flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition"
      >
        <span className="text-lg">
          {languages.find(lang => lang.code === selectedLanguage)?.flag}
        </span>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {languages.find(lang => lang.code === selectedLanguage)?.name}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="language-dropdown absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-fadeIn">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-100 transition ${
                selectedLanguage === language.code ? 'bg-gray-100 text-[#010101]' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
              {selectedLanguage === language.code && (
                <svg className="w-4 h-4 ml-auto text-[#010101]" fill="currentColor" viewBox="0 0 20 20">
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
