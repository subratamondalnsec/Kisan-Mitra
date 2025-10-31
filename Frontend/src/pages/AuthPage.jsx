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
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("farmer");
  const [authMode, setAuthMode] = useState("login");
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
    <div className="min-h-screen">
      {/* Two Column Grid Layout - Hidden on mobile */}
      <div className="hidden lg:grid lg:grid-cols-8 min-h-screen">
        {/* Left Column - Background Image */}
        <div 
          className="col-span-5 relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/bg-auth2.jpg)",
          }}
        >
          {/* Dark overlay for better contrast */}
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Gradient overlay from background to transparent */}
          <div className="absolute inset-0 bg-gradient-to-l from-black via-black/10 to-transparent"></div>
          
          {/* Logo positioned on background */}
          <div
            onClick={() => navigate("/")}
            className="absolute top-6 left-6 flex items-center space-x-3 p-3 bg-black/20 backdrop-blur-md rounded-lg shadow-lg z-10 cursor-pointer hover:bg-black/30 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-sm flex items-center justify-center overflow-hidden">
              <img
                src="/logo.png"
                alt="Kisan Mitra Logo"
                className="w-full h-full"
              />
            </div>
            <h1 className="text-xl font-bold text-gray-400">
              Kisan Mitra
            </h1>
          </div>
        </div>

        {/* Right Column - Auth Card with Dark Theme */}
        <div className="col-span-3 bg-background dark flex items-center justify-center p-6 pr-14">
          <div className="w-full max-w-lg">
            {/* Auth Card */}
            <div className="bg-card border border-border rounded-lg p-8 shadow-2xl">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* User Type Tabs */}
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="farmer" variant="farmer" className="px-4 py-3">
                    🌾 Farmer
                  </TabsTrigger>
                  <TabsTrigger value="dealer" variant="dealer" className="px-4 py-3">
                    🏪 Dealer
                  </TabsTrigger>
                </TabsList>

                {/* Auth Mode Tabs */}
                <div className="mb-6">
                  <Tabs value={authMode} onValueChange={handleModeSwitch} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-14">
                      <TabsTrigger value="login" variant="mode" className="px-4 py-3 text-sm">
                        Login
                      </TabsTrigger>
                      <TabsTrigger value="signup" variant="mode" className="px-4 py-2 text-sm">
                        Sign Up
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Farmer Form */}
                <TabsContent value="farmer" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-center text-foreground">
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
                          className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all duration-300"
                        />
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          value={farmerData.lastName}
                          onChange={handleFarmerChange}
                          required
                          className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all duration-300"
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
                          className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all duration-300"
                        />
                        <input
                          type="tel"
                          name="contactNumber"
                          placeholder="Contact Number"
                          value={farmerData.contactNumber}
                          onChange={handleFarmerChange}
                          required
                          className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all duration-300"
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
                        className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all duration-300"
                      />
                    )}

                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={farmerData.password}
                      onChange={handleFarmerChange}
                      required
                      className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all duration-300"
                    />

                    <Button 
                      type="submit" 
                      variant="farmer" 
                      size="lg" 
                      className="w-full"
                    >
                      {authMode === "login"
                        ? "🌾 Login as Farmer"
                        : "🌾 Sign Up as Farmer"}
                    </Button>
                  </form>
                </div>
                </TabsContent>

                {/* Dealer Form */}
                <TabsContent value="dealer" className="mt-0">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-center text-foreground">
                    {authMode === "login" ? "Dealer Login" : "Dealer Sign Up"}
                  </h2>

              <form onSubmit={handleDealerSubmit} className="space-y-3">
                {authMode === "signup" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Personal Details */}
                    <div className="space-y-3">
                      <h3 className="text-base font-semibold text-foreground mb-2 flex items-center">
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
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          value={dealerData.lastName}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />
                      </div>

                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={dealerData.email}
                        onChange={handleDealerChange}
                        required
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="tel"
                          name="whatsappNumber"
                          placeholder="WhatsApp Number"
                          value={dealerData.whatsappNumber}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />
                        <input
                          type="tel"
                          name="contactNumber"
                          placeholder="Contact Number"
                          value={dealerData.contactNumber}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />
                      </div>

                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={dealerData.password}
                        onChange={handleDealerChange}
                        required
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    {/* Right Column - Business Address */}
                    <div className="space-y-3">
                      <h3 className="text-base font-semibold text-foreground mb-2 flex items-center">
                        🏪 Business Address
                      </h3>

                      <input
                        type="text"
                        name="businessAddress.businessName"
                        placeholder="Business Name"
                        value={dealerData.businessAddress.businessName}
                        onChange={handleDealerChange}
                        required
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="businessAddress.street"
                          placeholder="Street Address"
                          value={dealerData.businessAddress.street}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />
                        <input
                          type="text"
                          name="businessAddress.area"
                          placeholder="Area/Sector"
                          value={dealerData.businessAddress.area}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
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
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />
                        <input
                          type="text"
                          name="businessAddress.district"
                          placeholder="District"
                          value={dealerData.businessAddress.district}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
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
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
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
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />
                      </div>

                      <input
                        type="text"
                        name="businessAddress.landmark"
                        placeholder="Landmark"
                        value={dealerData.businessAddress.landmark}
                        onChange={handleDealerChange}
                        required
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                      />

                      <div className="space-y-1">
                        <h5 className="text-xs font-medium text-muted-foreground">
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
                            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
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
                            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
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
                      className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={dealerData.password}
                      onChange={handleDealerChange}
                      required
                      className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                    />
                  </>
                )}

                <Button 
                  type="submit" 
                  variant="dealer" 
                  size="lg" 
                  className={`w-full ${authMode === "signup" ? "lg:col-span-2 mt-2" : ""}`}
                >
                  {authMode === "login"
                    ? "🏪 Login as Dealer"
                    : "🏪 Sign Up as Dealer"}
                </Button>
                  </form>
                </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Full viewport auth card */}
      <div className="lg:hidden min-h-screen bg-background dark flex items-center justify-center p-4">
        {/* Logo positioned at top for mobile */}
        <div
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 flex items-center space-x-2 p-2 bg-card border border-border rounded-lg shadow-lg z-10 cursor-pointer hover:bg-muted/50 transition-all duration-300"
        >
          <div className="w-8 h-8 rounded-sm flex items-center justify-center overflow-hidden">
            <img
              src="/logo.png"
              alt="Kisan Mitra Logo"
              className="w-full h-full"
            />
          </div>
          <h1 className="text-lg font-bold text-foreground">
            Kisan Mitra
          </h1>
        </div>

        <div className="w-full max-w-md mt-16">
          {/* Auth Card for Mobile */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-2xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* User Type Tabs */}
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="farmer" variant="farmer" className="px-4 py-3">
                  🌾 Farmer
                </TabsTrigger>
                <TabsTrigger value="dealer" variant="dealer" className="px-4 py-3">
                  🏪 Dealer
                </TabsTrigger>
              </TabsList>

              {/* Auth Mode Tabs */}
              <div className="mb-6">
                <Tabs value={authMode} onValueChange={handleModeSwitch} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-14">
                    <TabsTrigger value="login" variant="mode" className="px-4 py-2 text-sm">
                      Login
                    </TabsTrigger>
                    <TabsTrigger value="signup" variant="mode" className="px-4 py-2 text-sm">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Farmer Form - Mobile */}
              <TabsContent value="farmer" className="mt-0">
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-center text-foreground">
                  {authMode === "login" ? "Farmer Login" : "Farmer Sign Up"}
                </h2>

                <form onSubmit={handleFarmerSubmit} className="space-y-4">
                  {authMode === "signup" && (
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={farmerData.firstName}
                        onChange={handleFarmerChange}
                        required
                        className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all duration-300"
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={farmerData.lastName}
                        onChange={handleFarmerChange}
                        required
                        className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all duration-300"
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
                        className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all duration-300"
                      />
                      <input
                        type="tel"
                        name="contactNumber"
                        placeholder="Contact Number"
                        value={farmerData.contactNumber}
                        onChange={handleFarmerChange}
                        required
                        className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all duration-300"
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
                      className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all duration-300"
                    />
                  )}

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={farmerData.password}
                    onChange={handleFarmerChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all duration-300"
                  />

                  <Button 
                    type="submit" 
                    variant="farmer" 
                    size="lg" 
                    className="w-full"
                  >
                    {authMode === "login"
                      ? "🌾 Login as Farmer"
                      : "🌾 Sign Up as Farmer"}
                  </Button>
                </form>
              </div>
              </TabsContent>

              {/* Dealer Form - Mobile */}
              <TabsContent value="dealer" className="mt-0">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-center text-foreground">
                  {authMode === "login" ? "Dealer Login" : "Dealer Sign Up"}
                </h2>

                <form onSubmit={handleDealerSubmit} className="space-y-4">
                  {authMode === "signup" && (
                    <div className="space-y-4">
                      {/* Personal Information */}
                      <div className="space-y-3">
                        <h3 className="text-base font-semibold text-foreground mb-2 flex items-center">
                          👤 Personal Information
                        </h3>

                        <input
                          type="text"
                          name="FullName"
                          placeholder="Full Name"
                          value={dealerData.FullName}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          value={dealerData.lastName}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={dealerData.email}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />
                        <input
                          type="tel"
                          name="whatsappNumber"
                          placeholder="WhatsApp Number"
                          value={dealerData.whatsappNumber}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />
                        <input
                          type="tel"
                          name="contactNumber"
                          placeholder="Contact Number"
                          value={dealerData.contactNumber}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={dealerData.password}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />
                      </div>

                      {/* Business Address */}
                      <div className="space-y-3">
                        <h3 className="text-base font-semibold text-foreground mb-2 flex items-center">
                          🏪 Business Address
                        </h3>

                        <input
                          type="text"
                          name="businessAddress.businessName"
                          placeholder="Business Name"
                          value={dealerData.businessAddress.businessName}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />
                        <input
                          type="text"
                          name="businessAddress.street"
                          placeholder="Street Address"
                          value={dealerData.businessAddress.street}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />
                        <input
                          type="text"
                          name="businessAddress.area"
                          placeholder="Area/Sector"
                          value={dealerData.businessAddress.area}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />
                        <input
                          type="text"
                          name="businessAddress.city"
                          placeholder="City"
                          value={dealerData.businessAddress.city}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />
                        <input
                          type="text"
                          name="businessAddress.district"
                          placeholder="District"
                          value={dealerData.businessAddress.district}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />
                        <input
                          type="text"
                          name="businessAddress.state"
                          placeholder="State"
                          value={dealerData.businessAddress.state}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
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
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />
                        <input
                          type="text"
                          name="businessAddress.landmark"
                          placeholder="Landmark"
                          value={dealerData.businessAddress.landmark}
                          onChange={handleDealerChange}
                          required
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                        />

                        <div className="space-y-1">
                          <h5 className="text-xs font-medium text-muted-foreground">
                            📍 Coordinates (Optional)
                          </h5>
                          <div className="space-y-3">
                            <input
                              type="number"
                              name="businessAddress.longitude"
                              placeholder="Longitude"
                              value={
                                dealerData.businessAddress.coordinates.longitude
                              }
                              onChange={handleDealerChange}
                              step="any"
                              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
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
                              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Login fields for dealer - mobile */}
                  {authMode === "login" && (
                    <>
                      <input
                        type="text"
                        name="email"
                        placeholder="Email or Contact Number"
                        value={dealerData.email}
                        onChange={handleDealerChange}
                        required
                        className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={dealerData.password}
                        onChange={handleDealerChange}
                        required
                        className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-golden focus:border-transparent transition-all duration-300"
                      />
                    </>
                  )}

                  <Button 
                    type="submit" 
                    variant="dealer" 
                    size="lg" 
                    className="w-full"
                  >
                    {authMode === "login"
                      ? "🏪 Login as Dealer"
                      : "🏪 Sign Up as Dealer"}
                  </Button>
                </form>
              </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
