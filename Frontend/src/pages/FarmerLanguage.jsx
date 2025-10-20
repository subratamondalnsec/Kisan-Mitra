import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LANGUAGE_OPTIONS, LANGUAGE_DISPLAY_NAMES } from '../constants/languageOptions';
import { updateFarmerLanguage, getFarmerLanguage } from '../services/operations/languageApi';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const FarmerLanguage = () => {
  const dispatch = useDispatch();
  const { preferredLanguage, loading } = useSelector((state) => state.language);
  const { token } = useSelector((state) => state.auth);
  const [selectedLanguage, setSelectedLanguage] = useState(preferredLanguage);

  // Fetch current language preference on component mount
  useEffect(() => {
    const fetchLanguagePreference = async () => {
      if (token) {
        try {
          await dispatch(getFarmerLanguage(token));
        } catch (error) {
          console.error('Error fetching language preference:', error);
          // If fetch fails, keep the current Redux state (from localStorage or default)
        }
      }
    };

    fetchLanguagePreference();
  }, [dispatch, token]);

  // Sync local state with Redux state when it changes
  useEffect(() => {
    setSelectedLanguage(preferredLanguage);
  }, [preferredLanguage]);

  const handleLanguageSelection = (language) => {
    setSelectedLanguage(language);
  };

  const handleSaveLanguage = async () => {
    if (selectedLanguage === preferredLanguage) return;
    if (!token) {
      console.error('No authentication token available');
      return;
    }
    
    try {
      await dispatch(updateFarmerLanguage(selectedLanguage, token));
      // After successful update, selectedLanguage will be synced via the useEffect above
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white text-2xl">🌾</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Select Your Preferred Language
          </h1>
          <p className="text-gray-600">
            Choose the language for your farming companion experience
          </p>
        </div>

        {/* Language Selection Cards */}
        <div className="space-y-4">
          {LANGUAGE_OPTIONS.map((language) => (
            <div
              key={language}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedLanguage === language
                  ? 'border-green-500 bg-green-50 shadow-lg scale-[1.02]'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md hover:scale-[1.01]'
              }`}
              onClick={() => handleLanguageSelection(language)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">
                    {language === 'Hindi' && '🇮🇳'}
                    {language === 'English' && '🇬🇧'}
                    {language === 'Bengali' && '🇧🇩'}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {language}
                    </h3>
                    <p className="text-gray-600 text-lg">
                      {LANGUAGE_DISPLAY_NAMES[language]}
                    </p>
                  </div>
                </div>
                
                {/* Radio Button */}
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedLanguage === language
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedLanguage === language && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSaveLanguage}
            disabled={selectedLanguage === preferredLanguage || loading || !token}
            className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
              selectedLanguage === preferredLanguage || loading || !token
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 hover:scale-105 shadow-lg hover:shadow-xl transform'
            }`}
          >
            {loading ? (
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving Language...</span>
              </div>
            ) : !token ? (
              <div className="flex items-center space-x-2">
                <span>🔒</span>
                <span>Please Login First</span>
              </div>
            ) : selectedLanguage === preferredLanguage ? (
              <div className="flex items-center space-x-2">
                <span>✅</span>
                <span>Language Set</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>🌾</span>
                <span>Set Language to {selectedLanguage}</span>
              </div>
            )}
          </button>
        </div>

        {/* Current Selection Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-blue-800 font-medium">
              Current Language: {preferredLanguage} ({LANGUAGE_DISPLAY_NAMES[preferredLanguage]})
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Why Choose Your Language?
          </h3>
          <div className="space-y-2">
            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-sm mt-1">✓</span>
              <p className="text-gray-600 text-sm">
                Get crop recommendations in your preferred language
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-sm mt-1">✓</span>
              <p className="text-gray-600 text-sm">
                Communicate with dealers more effectively
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-sm mt-1">✓</span>
              <p className="text-gray-600 text-sm">
                Better understanding of farming tips and guidance
              </p>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Your language preference will be saved and applied across all Kisan Mitra features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmerLanguage;