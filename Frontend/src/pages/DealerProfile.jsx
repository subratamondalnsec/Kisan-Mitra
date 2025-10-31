import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDealerProfile, updateDealerProfile } from '../services/operations/DealerAuthApI';
import DealerNavbar from '../components/Common/DealerNavbar';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Edit } from 'lucide-react';

const DealerProfile = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const { isDarkMode } = useDarkMode();
  const [profileData, setProfileData] = useState({
    FullName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    whatsappNumber: '',
    businessAddress: {
      businessName: '',
      street: '',
      area: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
      landmark: '',
      coordinates: {
        longitude: '',
        latitude: ''
      }
    },
    image: ''
  });

  useEffect(() => {
    if (token) {
      dispatch(getDealerProfile(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (user && user.role === 'dealer') {
      setProfileData({
        FullName: user.FullName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        contactNumber: user.contactNumber || '',
        whatsappNumber: user.whatsappNumber || '',
        businessAddress: user.businessAddress || {
          businessName: '',
          street: '',
          area: '',
          city: '',
          district: '',
          state: '',
          pincode: '',
          landmark: '',
          coordinates: {
            longitude: '',
            latitude: ''
          }
        },
        image: user.image || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('businessAddress.')) {
      const field = name.split('.')[1];
      if (field === 'longitude' || field === 'latitude') {
        setProfileData({
          ...profileData,
          businessAddress: {
            ...profileData.businessAddress,
            coordinates: {
              ...profileData.businessAddress.coordinates,
              [field]: value
            }
          }
        });
      } else {
        setProfileData({
          ...profileData,
          businessAddress: {
            ...profileData.businessAddress,
            [field]: value
          }
        });
      }
    } else {
      setProfileData({
        ...profileData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (token) {
      dispatch(updateDealerProfile(profileData, token));
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    // Reset to original user data
    if (user) {
      setProfileData({
        FullName: user.FullName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        contactNumber: user.contactNumber || '',
        whatsappNumber: user.whatsappNumber || '',
        businessAddress: user.businessAddress || {
          businessName: '',
          street: '',
          area: '',
          city: '',
          district: '',
          state: '',
          pincode: '',
          landmark: '',
          coordinates: {
            longitude: '',
            latitude: ''
          }
        },
        image: user.image || ''
      });
    }
    setIsEditing(false);
  };

  if (!user || user.role !== 'dealer') {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center px-4 py-8">
        <div className="relative z-10 w-full max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl p-8 shadow-2xl text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              🚫 Access Denied
            </h2>
            <p className="text-gray-700 mb-6">
              Please login as a dealer to view this page.
            </p>
            <button
              onClick={() => (window.location.href = "/auth")}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
            >
              🏢 Login as Dealer
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
        : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50'
    }`}>
      {/* Overlay for better contrast */}
      <div className={`absolute inset-0 z-0 transition-all duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-r from-slate-900/50 via-transparent to-gray-900/50'
          : 'bg-gradient-to-r from-blue-50/50 via-transparent to-cyan-50/50'
      }`}></div>

      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <DealerNavbar />
      </div>

      {/* Main Profile Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto mt-20 space-y-6">
        {!isEditing ? (
          // View Mode
          <div className="space-y-6">
            {/* Top Profile Header Card */}
            <div className={`rounded-2xl p-6 text-white shadow-lg border transition-all duration-300 ${
              isDarkMode
                ? 'bg-gradient-to-r from-slate-700 via-blue-600 to-slate-800 border-gray-600'
                : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 border-gray-400'
            }`}>
              <div className="flex flex-col md:flex-row items-center justify-between">
                {/* Left Side - Profile Info */}
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-3 border-white shadow-lg overflow-hidden">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt="Profile"
                        className="w-24 h-24 object-cover"
                      />
                    ) : (
                      <span>
                        {(user.FullName?.charAt(0) || "D") +
                          (user.lastName?.charAt(0) || "E")}
                      </span>
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {user.FullName} {user.lastName}
                    </h1>
                    <p className="text-blue-100 text-sm">
                      Business Partner since Oct 2025
                    </p>
                  </div>
                </div>

                {/* Right Side - Business Stats Card */}
                <div className="bg-white/20 backdrop-blur-md rounded-xl flex flex-col items-center justify-center p-4 min-w-[200px]">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-300 text-xl">🏢</span>
                    <span className="text-3xl font-bold text-gray-100">
                      A+
                    </span>
                  </div>
                  <p className="text-gray-200 text-sm mb-3">Business Rating</p>
                </div>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Orders */}
              <div className={`rounded-xl border p-6 transition-all duration-300 hover:shadow-lg ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">📦</span>
                  </div>
                  <span className="text-blue-500 text-sm font-semibold">
                    +18
                  </span>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>387</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Orders</p>
                </div>
              </div>

              {/* Active Listings */}
              <div className={`rounded-xl border p-6 transition-all duration-300 hover:shadow-lg ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🌾</span>
                  </div>
                  <span className="text-green-500 text-sm font-semibold">
                    Active
                  </span>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>24</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active Listings</p>
                </div>
              </div>

              {/* Total Revenue */}
              <div className={`rounded-xl border p-6 transition-all duration-300 hover:shadow-lg ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">💰</span>
                  </div>
                  <span className="text-green-500 text-sm font-semibold">
                    +25%
                  </span>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>₹12,45,200</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Revenue</p>
                </div>
              </div>

              {/* Farmer Connections */}
              <div className={`rounded-xl border p-6 transition-all duration-300 hover:shadow-lg ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🤝</span>
                  </div>
                  <span className="text-purple-500 text-sm font-semibold">
                    +12
                  </span>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>156</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Farmer Connections</p>
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
                    ? 'from-blue-400 to-blue-500'
                    : 'from-blue-600 to-blue-700'
                }`}>
                  Profile Information
                </h2>

                {/* Edit Button - Top Right Corner */}
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform flex items-center justify-center"
                    title="Edit Profile"
                  >
                    <span className="text-sm"><Edit /></span>
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
                    isDarkMode ? 'text-blue-400' : 'text-blue-700'
                  }`}>
                    👤 Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 flex-1">
                    <div>
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Full Name:
                      </span>
                      <p className={`mt-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {user.FullName || "Not provided"}
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
                    <div>
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        WhatsApp Number:
                      </span>
                      <p className={`mt-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {user.whatsappNumber || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Role:
                      </span>
                      <p className={`font-semibold mt-1 ${
                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        🏢 Dealer
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Information Card */}
                {user.businessAddress && (
                  <div className={`border rounded-xl p-6 flex flex-col h-full transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <h3 className={`text-xl font-semibold mb-4 flex items-center ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-700'
                    }`}>
                      🏢 Business Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 flex-1">
                      <div className="sm:col-span-2">
                        <span className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Business Name:
                        </span>
                        <p className={`mt-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {user.businessAddress.businessName || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <span className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Street:
                        </span>
                        <p className={`mt-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {user.businessAddress.street || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <span className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Area:
                        </span>
                        <p className={`mt-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {user.businessAddress.area || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <span className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          City:
                        </span>
                        <p className={`mt-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {user.businessAddress.city || "Not provided"}
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
                          {user.businessAddress.district || "Not provided"}
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
                          {user.businessAddress.state || "Not provided"}
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
                          {user.businessAddress.pincode || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <span className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Landmark:
                        </span>
                        <p className={`mt-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {user.businessAddress.landmark || "Not provided"}
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
            <h2 className={`text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r ${
              isDarkMode
                ? 'from-blue-400 to-blue-500'
                : 'from-blue-600 to-blue-700'
            }`}>
              Edit Dealer Profile
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Card */}
              <div className={`border rounded-xl p-6 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gray-50 border-gray-300'
              }`}>
                <h3 className={`text-xl font-semibold mb-4 flex items-center ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-700'
                }`}>
                  👤 Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="FullName"
                      value={profileData.FullName}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                      }`}
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                      }`}
                      placeholder="Enter last name"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                      }`}
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={profileData.contactNumber}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                      }`}
                      placeholder="Enter contact number"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={profileData.whatsappNumber}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                      }`}
                      placeholder="Enter WhatsApp number"
                    />
                  </div>
                </div>
              </div>

              {/* Business Information Card */}
              <div className={`border rounded-xl p-6 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gray-50 border-gray-300'
              }`}>
                <h3 className={`text-xl font-semibold mb-4 flex items-center ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-700'
                }`}>
                  🏢 Business Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Business Name
                    </label>
                    <input
                      type="text"
                      name="businessAddress.businessName"
                      value={profileData.businessAddress.businessName}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                      }`}
                      placeholder="Enter business name"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Street
                    </label>
                    <input
                      type="text"
                      name="businessAddress.street"
                      value={profileData.businessAddress.street}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                      }`}
                      placeholder="Enter street address"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Area
                    </label>
                    <input
                      type="text"
                      name="businessAddress.area"
                      value={profileData.businessAddress.area}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                      }`}
                      placeholder="Enter area"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      City
                    </label>
                    <input
                      type="text"
                      name="businessAddress.city"
                      value={profileData.businessAddress.city}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                      }`}
                      placeholder="Enter city"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      District
                    </label>
                    <input
                      type="text"
                      name="businessAddress.district"
                      value={profileData.businessAddress.district}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                      }`}
                      placeholder="Enter district"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      State
                    </label>
                    <input
                      type="text"
                      name="businessAddress.state"
                      value={profileData.businessAddress.state}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                      }`}
                      placeholder="Enter state"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Pin Code
                    </label>
                    <input
                      type="text"
                      name="businessAddress.pincode"
                      value={profileData.businessAddress.pincode}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{6}"
                      title="Please enter a valid 6-digit pin code"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                      }`}
                      placeholder="Enter pin code"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Landmark
                    </label>
                    <input
                      type="text"
                      name="businessAddress.landmark"
                      value={profileData.businessAddress.landmark}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                      }`}
                      placeholder="Enter landmark"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Longitude (Optional)
                    </label>
                    <input
                      type="number"
                      name="businessAddress.longitude"
                      value={profileData.businessAddress.coordinates.longitude}
                      onChange={handleChange}
                      step="any"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                      }`}
                      placeholder="Enter longitude"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Latitude (Optional)
                    </label>
                    <input
                      type="number"
                      name="businessAddress.latitude"
                      value={profileData.businessAddress.coordinates.latitude}
                      onChange={handleChange}
                      step="any"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                      }`}
                      placeholder="Enter latitude"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Profile Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={profileData.image}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={handleCancel}
                  className={`flex-1 px-6 py-3 font-semibold rounded-xl focus:outline-none transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 ${
                    isDarkMode
                      ? 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500/50'
                      : 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500/50'
                  }`}
                >
                  <span>❌</span>
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                >
                  <span>💾</span>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealerProfile;