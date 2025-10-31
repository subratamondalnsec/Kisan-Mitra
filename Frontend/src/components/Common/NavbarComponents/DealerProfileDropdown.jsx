import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../../contexts/DarkModeContext";

const DealerProfileDropdown = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".profile-dropdown") &&
        !event.target.closest(".profile-button")
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={handleProfileClick}
        className="profile-button w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center hover:shadow-lg transition transform hover:scale-[1.02] backdrop-blur-sm border border-white/20"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <div
          className={`profile-dropdown absolute right-0 mt-2 w-56 backdrop-blur-md rounded-xl shadow-xl border py-2 animate-fadeIn transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-800/95 border-gray-600/30"
              : "bg-white/95 border-gray-300/30"
          }`}
        >
          <div
            className={`px-4 py-3 border-b ${
              isDarkMode ? "border-gray-600/50" : "border-gray-200/50"
            }`}
          >
            <p
              className={`text-sm font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              🏢 Dealer Account
            </p>
            <p
              className={`text-xs mt-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              dealer@example.com
            </p>
          </div>

          <button
            onClick={() => navigate("/dealer/profile")}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 transition-all duration-300 ${
              isDarkMode
                ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                : "text-gray-700 hover:bg-gray-200/30"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="font-medium">My Profile</span>
          </button>

          <button
            onClick={() => navigate("/dealer/my-reviews")}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 transition-all duration-300 ${
              isDarkMode
                ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                : "text-gray-700 hover:bg-gray-200/30"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            <span className="font-medium">My Reviews</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`w-full flex items-center justify-between px-4 py-2.5 transition-all duration-300 ${
              isDarkMode
                ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                : "text-gray-700 hover:bg-gray-200/30"
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </span>
              <span className="font-medium">Dark Mode</span>
            </div>

            {/* Animated Toggle Switch */}
            <div
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                isDarkMode ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                  isDarkMode ? "transform translate-x-6" : ""
                }`}
              ></div>
            </div>
          </button>

          <div
            className={`border-t mt-2 ${
              isDarkMode ? "border-gray-600/50" : "border-gray-200/50"
            }`}
          >
            <button
              onClick={() => navigate("/auth")}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 transition-all duration-300 ${
                isDarkMode
                  ? "text-red-400 hover:bg-red-900/30 hover:text-red-300"
                  : "text-red-600 hover:bg-red-50"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerProfileDropdown;
