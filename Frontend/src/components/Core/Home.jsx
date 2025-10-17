import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const { token, user } = useSelector(state => state.auth);

  const handleGetStarted = () => {
    navigate('/signup-login');
  };

  const handleGoToProfile = () => {
    if (user?.role === 'farmer') {
      navigate('/farmer/profile');
    } else if (user?.role === 'dealer') {
      navigate('/dealer/profile');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-green-400 flex flex-col items-center justify-center">
      {/* Card Container */}
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-10 text-center max-w-md w-[90%] transition-transform hover:scale-105">
        {/* Title */}
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          🌾 Kisan Mitra
        </h1>

        {/* Subtitle */}
        <p className="text-gray-700 text-lg mb-6">
          Empowering Farmers with Smart Solutions for a Sustainable Future.
        </p>

        {/* Conditional Buttons */}
        <div className="space-y-3">
          {!token ? (
            <button 
              onClick={handleGetStarted}
              className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition-all w-full"
            >
              Get Started
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Welcome back, {user?.firstName || user?.FullName || 'User'}!
              </p>
              <button 
                onClick={handleGoToProfile}
                className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition-all w-full"
              >
                Go to Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-sm text-green-900 opacity-80">
        © {new Date().getFullYear()} Kisan Mitra. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;