import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { farmerSignup, farmerLogin } from '../services/operations/FarmerAuthApi';
import { dealerSignup, dealerLogin } from '../services/operations/DealerAuthApI';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('farmer');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Farmer form state
  const [farmerData, setFarmerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    contactNumber: ''
  });

  // Dealer form state
  const [dealerData, setDealerData] = useState({
    FullName: '',
    lastName: '',
    email: '',
    password: '',
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
    }
  });

  const handleFarmerChange = (e) => {
    setFarmerData({
      ...farmerData,
      [e.target.name]: e.target.value
    });
  };

  const handleDealerChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('businessAddress.')) {
      const field = name.split('.')[1];
      if (field === 'longitude' || field === 'latitude') {
        setDealerData({
          ...dealerData,
          businessAddress: {
            ...dealerData.businessAddress,
            coordinates: {
              ...dealerData.businessAddress.coordinates,
              [field]: value
            }
          }
        });
      } else {
        setDealerData({
          ...dealerData,
          businessAddress: {
            ...dealerData.businessAddress,
            [field]: value
          }
        });
      }
    } else {
      setDealerData({
        ...dealerData,
        [name]: value
      });
    }
  };

  // Clear forms when switching modes
  const handleModeSwitch = (newMode) => {
    setAuthMode(newMode);
    // Clear form data for login mode since we only need one field
    if (newMode === 'login') {
      setFarmerData(prev => ({
        ...prev,
        contactNumber: '', // Clear contact number for login
      }));
      setDealerData(prev => ({
        ...prev,
        contactNumber: '', // Clear contact number for login
      }));
    }
  };

  const handleFarmerSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'signup') {
      dispatch(farmerSignup(
        farmerData.firstName,
        farmerData.lastName,
        farmerData.email,
        farmerData.password,
        farmerData.contactNumber,
        navigate
      ));
    } else {
      // Use email or contactNumber (whichever is filled)
      const emailOrContact = farmerData.email || farmerData.contactNumber;
      dispatch(farmerLogin(
        emailOrContact,
        farmerData.password,
        navigate
      ));
    }
  };

  const handleDealerSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'signup') {
      dispatch(dealerSignup(
        dealerData.FullName,
        dealerData.lastName,
        dealerData.email,
        dealerData.password,
        dealerData.contactNumber,
        dealerData.whatsappNumber,
        dealerData.businessAddress,
        navigate
      ));
    } else {
      // Use email or contactNumber (whichever is filled)
      const emailOrContact = dealerData.email || dealerData.contactNumber;
      dispatch(dealerLogin(
        emailOrContact,
        dealerData.password,
        navigate
      ));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Kisan Mitra Authentication</h1>
      
      {/* Tab Switching */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('farmer')}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: activeTab === 'farmer' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'farmer' ? 'white' : 'black',
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
        >
          Farmer
        </button>
        <button 
          onClick={() => setActiveTab('dealer')}
          style={{ 
            padding: '10px 20px',
            backgroundColor: activeTab === 'dealer' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'dealer' ? 'white' : 'black',
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
        >
          Dealer
        </button>
      </div>

      {/* Mode Switching */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => handleModeSwitch('login')}
          style={{ 
            padding: '8px 16px', 
            marginRight: '10px',
            backgroundColor: authMode === 'login' ? '#28a745' : '#f8f9fa',
            color: authMode === 'login' ? 'white' : 'black',
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
        <button 
          onClick={() => handleModeSwitch('signup')}
          style={{ 
            padding: '8px 16px',
            backgroundColor: authMode === 'signup' ? '#28a745' : '#f8f9fa',
            color: authMode === 'signup' ? 'white' : 'black',
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
        >
          Signup
        </button>
      </div>

      {/* Farmer Form */}
      {activeTab === 'farmer' && (
        <div>
          <h2>{authMode === 'login' ? 'Farmer Login' : 'Farmer Signup'}</h2>
          <form onSubmit={handleFarmerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {authMode === 'signup' && (
              <>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={farmerData.firstName}
                  onChange={handleFarmerChange}
                  required
                  style={{ padding: '10px', border: '1px solid #ccc' }}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={farmerData.lastName}
                  onChange={handleFarmerChange}
                  required
                  style={{ padding: '10px', border: '1px solid #ccc' }}
                />
              </>
            )}
            {authMode === 'signup' ? (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={farmerData.email}
                  onChange={handleFarmerChange}
                  required
                  style={{ padding: '10px', border: '1px solid #ccc' }}
                />
                <input
                  type="tel"
                  name="contactNumber"
                  placeholder="Contact Number"
                  value={farmerData.contactNumber}
                  onChange={handleFarmerChange}
                  required
                  style={{ padding: '10px', border: '1px solid #ccc' }}
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
                style={{ padding: '10px', border: '1px solid #ccc' }}
              />
            )}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={farmerData.password}
              onChange={handleFarmerChange}
              required
              style={{ padding: '10px', border: '1px solid #ccc' }}
            />
            <button 
              type="submit"
              style={{ 
                padding: '12px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer' 
              }}
            >
              {authMode === 'login' ? 'Login as Farmer' : 'Sign Up as Farmer'}
            </button>
          </form>
        </div>
      )}

      {/* Dealer Form */}
      {activeTab === 'dealer' && (
        <div>
          <h2>{authMode === 'login' ? 'Dealer Login' : 'Dealer Signup'}</h2>
          <form onSubmit={handleDealerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {authMode === 'signup' && (
              <>
                <input
                  type="text"
                  name="FullName"
                  placeholder="Full Name"
                  value={dealerData.FullName}
                  onChange={handleDealerChange}
                  required
                  style={{ padding: '10px', border: '1px solid #ccc' }}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={dealerData.lastName}
                  onChange={handleDealerChange}
                  required
                  style={{ padding: '10px', border: '1px solid #ccc' }}
                />
                <input
                  type="tel"
                  name="whatsappNumber"
                  placeholder="WhatsApp Number"
                  value={dealerData.whatsappNumber}
                  onChange={handleDealerChange}
                  required
                  style={{ padding: '10px', border: '1px solid #ccc' }}
                />
                
                <h4 style={{ margin: '20px 0 10px 0', color: '#333' }}>Business Address</h4>
                
                <input
                  type="text"
                  name="businessAddress.businessName"
                  placeholder="Business Name"
                  value={dealerData.businessAddress.businessName}
                  onChange={handleDealerChange}
                  required
                  style={{ padding: '10px', border: '1px solid #ccc' }}
                />
                <input
                  type="text"
                  name="businessAddress.street"
                  placeholder="Street Address"
                  value={dealerData.businessAddress.street}
                  onChange={handleDealerChange}
                  required
                  style={{ padding: '10px', border: '1px solid #ccc' }}
                />
                <input
                  type="text"
                  name="businessAddress.area"
                  placeholder="Area/Sector"
                  value={dealerData.businessAddress.area}
                  onChange={handleDealerChange}
                  required
                  style={{ padding: '10px', border: '1px solid #ccc' }}
                />
                <input
                  type="text"
                  name="businessAddress.city"
                  placeholder="City"
                  value={dealerData.businessAddress.city}
                  onChange={handleDealerChange}
                  required
                  style={{ padding: '10px', border: '1px solid #ccc' }}
                />
                <input
                  type="text"
                  name="businessAddress.district"
                  placeholder="District"
                  value={dealerData.businessAddress.district}
                  onChange={handleDealerChange}
                  required
                  style={{ padding: '10px', border: '1px solid #ccc' }}
                />
                <input
                  type="text"
                  name="businessAddress.state"
                  placeholder="State"
                  value={dealerData.businessAddress.state}
                  onChange={handleDealerChange}
                  required
                  style={{ padding: '10px', border: '1px solid #ccc' }}
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
                  style={{ padding: '10px', border: '1px solid #ccc' }}
                />
                <input
                  type="text"
                  name="businessAddress.landmark"
                  placeholder="Landmark"
                  value={dealerData.businessAddress.landmark}
                  onChange={handleDealerChange}
                  required
                  style={{ padding: '10px', border: '1px solid #ccc' }}
                />
                
                <h5 style={{ margin: '15px 0 5px 0', color: '#666' }}>Coordinates (Optional)</h5>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                    name="businessAddress.longitude"
                    placeholder="Longitude"
                    value={dealerData.businessAddress.coordinates.longitude}
                    onChange={handleDealerChange}
                    step="any"
                    style={{ flex: 1, padding: '10px', border: '1px solid #ccc' }}
                  />
                  <input
                    type="number"
                    name="businessAddress.latitude"
                    placeholder="Latitude"
                    value={dealerData.businessAddress.coordinates.latitude}
                    onChange={handleDealerChange}
                    step="any"
                    style={{ flex: 1, padding: '10px', border: '1px solid #ccc' }}
                  />
                </div>
              </>
            )}
            {authMode === 'signup' ? (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={dealerData.email}
                  onChange={handleDealerChange}
                  required
                  style={{ padding: '10px', border: '1px solid #ccc' }}
                />
                <input
                  type="tel"
                  name="contactNumber"
                  placeholder="Contact Number"
                  value={dealerData.contactNumber}
                  onChange={handleDealerChange}
                  required
                  style={{ padding: '10px', border: '1px solid #ccc' }}
                />
              </>
            ) : (
              <input
                type="text"
                name="email"
                placeholder="Email or Contact Number"
                value={dealerData.email}
                onChange={handleDealerChange}
                required
                style={{ padding: '10px', border: '1px solid #ccc' }}
              />
            )}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={dealerData.password}
              onChange={handleDealerChange}
              required
              style={{ padding: '10px', border: '1px solid #ccc' }}
            />
            <button 
              type="submit"
              style={{ 
                padding: '12px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer' 
              }}
            >
              {authMode === 'login' ? 'Login as Dealer' : 'Sign Up as Dealer'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AuthPage;