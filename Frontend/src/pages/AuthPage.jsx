import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  farmerSignup,
  farmerLogin,
} from "../services/operations/FarmerAuthApi";
import {
  dealerSignup,
  dealerLogin,
} from "../services/operations/DealerAuthApI";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("farmer");
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Farmer form state
  const [farmerData, setFarmerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contactNumber: "",
  });

  // Dealer form state
  const [dealerData, setDealerData] = useState({
    FullName: "",
    lastName: "",
    email: "",
    password: "",
    contactNumber: "",
    whatsappNumber: "",
    businessAddress: {
      businessName: "",
      street: "",
      area: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
      landmark: "",
      coordinates: {
        longitude: "",
        latitude: "",
      },
    },
  });

  const handleFarmerChange = (e) => {
    setFarmerData({
      ...farmerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDealerChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("businessAddress.")) {
      const field = name.split(".")[1];
      if (field === "longitude" || field === "latitude") {
        setDealerData({
          ...dealerData,
          businessAddress: {
            ...dealerData.businessAddress,
            coordinates: {
              ...dealerData.businessAddress.coordinates,
              [field]: value,
            },
          },
        });
      } else {
        setDealerData({
          ...dealerData,
          businessAddress: {
            ...dealerData.businessAddress,
            [field]: value,
          },
        });
      }
    } else {
      setDealerData({
        ...dealerData,
        [name]: value,
      });
    }
  };

  // Clear forms when switching modes
  const handleModeSwitch = (newMode) => {
    setAuthMode(newMode);
    // Clear form data for login mode since we only need one field
    if (newMode === "login") {
      setFarmerData((prev) => ({
        ...prev,
        contactNumber: "", // Clear contact number for login
      }));
      setDealerData((prev) => ({
        ...prev,
        contactNumber: "", // Clear contact number for login
      }));
    }
  };

  const handleFarmerSubmit = (e) => {
    e.preventDefault();
    if (authMode === "signup") {
      dispatch(
        farmerSignup(
          farmerData.firstName,
          farmerData.lastName,
          farmerData.email,
          farmerData.password,
          farmerData.contactNumber,
          navigate
        )
      );
    } else {
      // Use email or contactNumber (whichever is filled)
      const emailOrContact = farmerData.email || farmerData.contactNumber;
      dispatch(farmerLogin(emailOrContact, farmerData.password, navigate));
    }
  };

  const handleDealerSubmit = (e) => {
    e.preventDefault();
    if (authMode === "signup") {
      dispatch(
        dealerSignup(
          dealerData.FullName,
          dealerData.lastName,
          dealerData.email,
          dealerData.password,
          dealerData.contactNumber,
          dealerData.whatsappNumber,
          dealerData.businessAddress,
          navigate
        )
      );
    } else {
      // Use email or contactNumber (whichever is filled)
      const emailOrContact = dealerData.email || dealerData.contactNumber;
      dispatch(dealerLogin(emailOrContact, dealerData.password, navigate));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        backgroundImage: "url(/bg3.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "right",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-black/40 z-0"></div>

      {/* Logo & Title */}
      <div
       onClick={() => navigate("/")}
      className="absolute top-2 left-2 flex items-center justify-center space-x-3 p-2 bg-white/40 backdrop-blur-md rounded-md border border-gray-300 shadow-md z-10 cursor-pointer">
        <div className="w-12 h-12 rounded-sm flex items-center justify-center overflow-hidden">
          <img
            src="/logo.png"
            alt="Kisan Mitra Logo"
            className="w-full h-full"
          />
        </div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-gray-800 to-emerald-500 text-shadow-md">
          Kisan Mitra
        </h1>
      </div>
      {/* Main Auth Container */}
      <div
        className={`relative z-10 w-full ${
          activeTab === "dealer" && authMode === "signup"
            ? "max-w-6xl mx-auto mt-8"
            : "max-w-md ml-auto mr-8"
        }`}
      >
        {/* Auth Card */}
        <div className="bg-gray-100/40 backdrop-blur-md border border-gray-300 rounded-lg p-6 shadow-2xl">
          {/* Tab Switching */}
          <div className="flex space-x-2 mb-4 p-1 bg-gray-100 rounded-lg border border-gray-300">
            <button
              onClick={() => setActiveTab("farmer")}
              className={`flex-1 px-4 py-3 rounded-md font-medium transition-all duration-300 ${
                activeTab === "farmer"
                  ? "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border border-emerald-300"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              🌾 Farmer
            </button>
            <button
              onClick={() => setActiveTab("dealer")}
              className={`flex-1 px-4 py-3 rounded-md font-medium transition-all duration-300 ${
                activeTab === "dealer"
                  ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-300"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              🏪 Dealer
            </button>
          </div>

          {/* Mode Switching */}
          <div className="flex space-x-2 mb-5 p-1 bg-gray-100 rounded-lg border border-gray-300">
            <button
              onClick={() => handleModeSwitch("login")}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                authMode === "login"
                  ? "bg-white text-gray-800 border border-gray-200 shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => handleModeSwitch("signup")}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                authMode === "signup"
                  ? "bg-white text-gray-800 border border-gray-200 shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Farmer Form */}
          {activeTab === "farmer" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-700">
                {authMode === "login" ? "Farmer Login" : "Farmer Sign Up"}
              </h2>

              <form onSubmit={handleFarmerSubmit} className="space-y-4">
                {authMode === "signup" && (
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={farmerData.firstName}
                      onChange={handleFarmerChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={farmerData.lastName}
                      onChange={handleFarmerChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                    />
                  </div>
                )}

                {authMode === "signup" ? (
                  <>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={farmerData.email}
                      onChange={handleFarmerChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                    />
                    <input
                      type="tel"
                      name="contactNumber"
                      placeholder="Contact Number"
                      value={farmerData.contactNumber}
                      onChange={handleFarmerChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                    />
                  </>
                ) : (
                  <input
                    type="text"
                    name="email"
                    placeholder="Email or Contact Number"
                    value={farmerData.email}
                    onChange={handleFarmerChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                  />
                )}

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={farmerData.password}
                  onChange={handleFarmerChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-300"
                />

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-md hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                >
                  {authMode === "login"
                    ? "🌾 Login as Farmer"
                    : "🌾 Sign Up as Farmer"}
                </button>
              </form>
            </div>
          )}

          {/* Dealer Form */}
          {activeTab === "dealer" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-700">
                {authMode === "login" ? "Dealer Login" : "Dealer Sign Up"}
              </h2>

              <form onSubmit={handleDealerSubmit} className="space-y-3">
                {authMode === "signup" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Personal Details */}
                    <div className="space-y-3">
                      <h3 className="text-base font-semibold text-gray-700 mb-2 flex items-center">
                        👤 Personal Information
                      </h3>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="FullName"
                          placeholder="Full Name"
                          value={dealerData.FullName}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all duration-300"
                        />
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          value={dealerData.lastName}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all duration-300"
                        />
                      </div>

                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={dealerData.email}
                        onChange={handleDealerChange}
                        required
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all duration-300"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="tel"
                          name="whatsappNumber"
                          placeholder="WhatsApp Number"
                          value={dealerData.whatsappNumber}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all duration-300"
                        />
                        <input
                          type="tel"
                          name="contactNumber"
                          placeholder="Contact Number"
                          value={dealerData.contactNumber}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all duration-300"
                        />
                      </div>

                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={dealerData.password}
                        onChange={handleDealerChange}
                        required
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all duration-300"
                      />
                    </div>

                    {/* Right Column - Business Address */}
                    <div className="space-y-3">
                      <h3 className="text-base font-semibold text-gray-700 mb-2 flex items-center">
                        🏪 Business Address
                      </h3>

                      <input
                        type="text"
                        name="businessAddress.businessName"
                        placeholder="Business Name"
                        value={dealerData.businessAddress.businessName}
                        onChange={handleDealerChange}
                        required
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all duration-300"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="businessAddress.street"
                          placeholder="Street Address"
                          value={dealerData.businessAddress.street}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all duration-300"
                        />
                        <input
                          type="text"
                          name="businessAddress.area"
                          placeholder="Area/Sector"
                          value={dealerData.businessAddress.area}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all duration-300"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="businessAddress.city"
                          placeholder="City"
                          value={dealerData.businessAddress.city}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all duration-300"
                        />
                        <input
                          type="text"
                          name="businessAddress.district"
                          placeholder="District"
                          value={dealerData.businessAddress.district}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all duration-300"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="businessAddress.state"
                          placeholder="State"
                          value={dealerData.businessAddress.state}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all duration-300"
                        />
                        <input
                          type="text"
                          name="businessAddress.pincode"
                          placeholder="Pin Code"
                          value={dealerData.businessAddress.pincode}
                          onChange={handleDealerChange}
                          required
                          pattern="[0-9]{6}"
                          title="Please enter a valid 6-digit pin code"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all duration-300"
                        />
                      </div>

                      <input
                        type="text"
                        name="businessAddress.landmark"
                        placeholder="Landmark"
                        value={dealerData.businessAddress.landmark}
                        onChange={handleDealerChange}
                        required
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all duration-300"
                      />

                      <div className="space-y-1">
                        <h5 className="text-xs font-medium text-gray-600">
                          📍 Coordinates (Optional)
                        </h5>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="number"
                            name="businessAddress.longitude"
                            placeholder="Longitude"
                            value={
                              dealerData.businessAddress.coordinates.longitude
                            }
                            onChange={handleDealerChange}
                            step="any"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all duration-300"
                          />
                          <input
                            type="number"
                            name="businessAddress.latitude"
                            placeholder="Latitude"
                            value={
                              dealerData.businessAddress.coordinates.latitude
                            }
                            onChange={handleDealerChange}
                            step="any"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Login fields for dealer - only when authMode is login */}
                {authMode === "login" && (
                  <>
                    <input
                      type="text"
                      name="email"
                      placeholder="Email or Contact Number"
                      value={dealerData.email}
                      onChange={handleDealerChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all duration-300"
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={dealerData.password}
                      onChange={handleDealerChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all duration-300"
                    />
                  </>
                )}

                <button
                  type="submit"
                  className={`w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-md hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${
                    authMode === "signup" ? "lg:col-span-2 mt-2" : ""
                  }`}
                >
                  {authMode === "login"
                    ? "🏪 Login as Dealer"
                    : "🏪 Sign Up as Dealer"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
