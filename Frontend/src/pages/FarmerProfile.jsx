import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFarmerProfile,
  updateFarmerProfile,
} from "../services/operations/FarmerAuthApi";
import FarmerNavbar from "../components/Common/FarmerNavbar";
import { Edit } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";

const FarmerProfile = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const { isDarkMode } = useDarkMode();
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    image: "",
    address: {
      street: "",
      village: "",
      tehsil: "",
      district: "",
      state: "",
      pincode: "",
      country: "India",
    },
  });

  useEffect(() => {
    if (token) {
      dispatch(getFarmerProfile(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (user && user.role === "farmer") {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        contactNumber: user.contactNumber || "",
        image: user.image || "",
        address: user.address || {
          street: "",
          village: "",
          tehsil: "",
          district: "",
          state: "",
          pincode: "",
          country: "India",
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setProfileData({
        ...profileData,
        address: {
          ...profileData.address,
          [field]: value,
        },
      });
    } else {
      setProfileData({
        ...profileData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (token) {
      dispatch(updateFarmerProfile(profileData, token));
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    // Reset to original user data
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        contactNumber: user.contactNumber || "",
        image: user.image || "",
        address: user.address || {
          street: "",
          village: "",
          tehsil: "",
          district: "",
          state: "",
          pincode: "",
          country: "India",
        },
      });
    }
    setIsEditing(false);
  };

  if (!user || user.role !== "farmer") {
    return (
      <div className="min-h-screen bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center px-4 py-8">
        <div className="relative z-10 w-full max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl p-8 shadow-2xl text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              🚫 Access Denied
            </h2>
            <p className="text-gray-700 mb-6">
              Please login as a farmer to view this page.
            </p>
            <button
              onClick={() => (window.location.href = "/auth")}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
            >
              🌾 Login as Farmer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
    }`}>
      {/* Overlay for better contrast */}
      <div className={`absolute inset-0 z-0 transition-all duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-r from-slate-900/50 via-transparent to-gray-900/50'
          : 'bg-gradient-to-r from-emerald-50/50 via-transparent to-emerald-50/50'
      }`}></div>

      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <FarmerNavbar />
      </div>

      {/* Main Profile Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto mt-20 space-y-6">
        {!isEditing ? (
          // View Mode
          <div className="space-y-6">
            {/* Top Profile Header Card */}
            <div className={`rounded-2xl p-6 text-white shadow-lg border transition-all duration-300 ${
              isDarkMode
                ? 'bg-gradient-to-r from-yellow-700 via-gray-600 to-emerald-800 border-gray-600'
                : 'bg-gradient-to-r from-yellow-600 via-gray-400 to-emerald-600 border-gray-400'
            }`}>
              <div className="flex flex-col md:flex-row items-center justify-between">
                {/* Left Side - Profile Info */}
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-3 border-white shadow-lg overflow-hidden">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt="Profile"
                        className="w-24 h-24 object-cover"
                      />
                    ) : (
                      <span>
                        {(user.firstName?.charAt(0) || "F") +
                          (user.lastName?.charAt(0) || "U")}
                      </span>
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-emerald-100 text-sm">
                      Super Kisan since Oct 2025
                    </p>
                  </div>
                </div>

                {/* Right Side - Credit Score Card */}
                <div className="bg-white/20 backdrop-blur-md rounded-xl flex flex-col items-center justify-center p-4 min-w-[200px]">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-300 text-xl">💰</span>
                    <span className="text-3xl font-bold text-gray-100">
                      480
                    </span>
                  </div>
                  <p className="text-gray-200 text-sm mb-3">Current Credits</p>
                </div>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Crops Analyzed */}
              <div className={`rounded-xl border p-6 transition-all duration-300 hover:shadow-lg ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🔬</span>
                  </div>
                  <span className="text-emerald-500 text-sm font-semibold">
                    +15
                  </span>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>142</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Crops Analyzed</p>
                </div>
              </div>

              {/* Loan Amount */}
              <div className={`rounded-xl border p-6 transition-all duration-300 hover:shadow-lg ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🏦</span>
                  </div>
                  <span className="text-orange-500 text-sm font-semibold">
                    Active
                  </span>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>₹2,50,000</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Loan Amount</p>
                </div>
              </div>

              {/* Revenue Made */}
              <div className={`rounded-xl border p-6 transition-all duration-300 hover:shadow-lg ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">💰</span>
                  </div>
                  <span className="text-emerald-500 text-sm font-semibold">
                    +22%
                  </span>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>₹3,85,400</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Revenue</p>
                </div>
              </div>

              {/* Pending Deliveries */}
              <div className={`rounded-xl border p-6 transition-all duration-300 hover:shadow-lg ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🚚</span>
                  </div>
                  <span className="text-red-500 text-sm font-semibold">
                    Urgent
                  </span>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>8</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pending Deliveries</p>
                </div>
              </div>
            </div>

            {/* Profile Cards Container */}
            <div className={`backdrop-blur-md border rounded-xl p-8 relative transition-all duration-300 ${
              isDarkMode
                ? 'bg-gray-800/80 border-gray-600'
                : 'bg-white/80 border-gray-300'
            }`}>
              
              <div className="flex items-center justify-between w-full mb-6">
                <h2 className={`text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r ${
                  isDarkMode
                    ? 'from-emerald-400 to-emerald-500'
                    : 'from-emerald-600 to-emerald-700'
                }`}>
                  Profile Information
                </h2>

                {/* Edit Button - Top Right Corner */}
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-md hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform flex items-center justify-center"
                    title="Edit Profile"
                  >
                    <span className="text-sm text-gray-200"><Edit /></span>
                  </button>
                )}
              </div>

              {/* Two Column Layout for Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information Card */}
                <div className={`border rounded-xl p-6 flex flex-col h-full transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-gray-50 border-gray-300'
                }`}>
                  <h3 className={`text-xl font-semibold mb-4 flex items-center ${
                    isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                  }`}>
                    👤 Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 flex-1">
                    <div>
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        First Name:
                      </span>
                      <p className={`mt-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {user.firstName || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Last Name:
                      </span>
                      <p className={`mt-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {user.lastName || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Email:
                      </span>
                      <p className={`mt-1 break-all ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {user.email || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Contact Number:
                      </span>
                      <p className={`mt-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {user.contactNumber || "Not provided"}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Role:
                      </span>
                      <p className={`font-semibold mt-1 ${
                        isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                      }`}>
                        🌾 Farmer
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address Information Card */}
                {user.address && (
                  <div className={`border rounded-xl p-6 flex flex-col h-full transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <h3 className={`text-xl font-semibold mb-4 flex items-center ${
                      isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                    }`}>
                      📍 Address Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 flex-1">
                      <div>
                        <span className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Street:
                        </span>
                        <p className={`mt-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {user.address.street || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <span className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Village:
                        </span>
                        <p className={`mt-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {user.address.village || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <span className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Tehsil:
                        </span>
                        <p className={`mt-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {user.address.tehsil || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <span className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          District:
                        </span>
                        <p className={`mt-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {user.address.district || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <span className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          State:
                        </span>
                        <p className={`mt-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {user.address.state || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <span className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Pin Code:
                        </span>
                        <p className={`mt-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {user.address.pincode || "Not provided"}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Country:
                        </span>
                        <p className={`mt-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {user.address.country || "India"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <div className={`backdrop-blur-md border rounded-xl p-8 transition-all duration-300 ${
            isDarkMode
              ? 'bg-gray-800/80 border-gray-600'
              : 'bg-white/80 border-gray-300'
          }`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <h3 className={`text-2xl font-semibold mb-6 ${
                  isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                }`}>
                  ✏️ Edit Profile
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Personal Information */}
                <div className="space-y-4">
                  <h4 className={`text-lg font-semibold mb-4 flex items-center ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    👤 Personal Information
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="First Name"
                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:border-emerald-500 transition-all duration-300 ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-600'
                            : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 focus:bg-white'
                        }`}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Last Name"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                      />
                    </div>
                  </div>

                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email Address"
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:border-emerald-500 transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-600'
                        : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 focus:bg-white'
                    }`}
                  />

                  <input
                    type="tel"
                    name="contactNumber"
                    value={profileData.contactNumber}
                    onChange={handleChange}
                    required
                    placeholder="Contact Number"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                  />

                  <input
                    type="url"
                    name="image"
                    value={profileData.image}
                    onChange={handleChange}
                    placeholder="Profile Image URL (https://example.com/image.jpg)"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                  />
                </div>

                {/* Right Column - Address Information */}
                <div className="space-y-4">
                  <h4 className={`text-lg font-semibold mb-4 flex items-center ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    📍 Address Information
                  </h4>

                  <input
                    type="text"
                    name="address.street"
                    value={profileData.address.street}
                    onChange={handleChange}
                    placeholder="Street Address"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="address.village"
                      value={profileData.address.village}
                      onChange={handleChange}
                      placeholder="Village"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                    />
                    <input
                      type="text"
                      name="address.tehsil"
                      value={profileData.address.tehsil}
                      onChange={handleChange}
                      placeholder="Tehsil"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="address.district"
                      value={profileData.address.district}
                      onChange={handleChange}
                      placeholder="District"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                    />
                    <input
                      type="text"
                      name="address.state"
                      value={profileData.address.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="address.pincode"
                      value={profileData.address.pincode}
                      onChange={handleChange}
                      pattern="[0-9]{6}"
                      title="Please enter a valid 6-digit pin code"
                      placeholder="Pin Code (6 digits)"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                    />
                    <input
                      type="text"
                      name="address.country"
                      value={profileData.address.country}
                      onChange={handleChange}
                      placeholder="Country"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-md hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                >
                  ❌ Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-md hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                >
                  💾 Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerProfile;
