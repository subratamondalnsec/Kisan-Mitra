import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFarmerProfile, updateFarmerProfile } from '../services/operations/FarmerAuthApi';

const FarmerProfile = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    image: ''
  });

  useEffect(() => {
    if (token) {
      dispatch(getFarmerProfile(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (user && user.role === 'farmer') {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        contactNumber: user.contactNumber || '',
        image: user.image || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
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
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        contactNumber: user.contactNumber || '',
        image: user.image || ''
      });
    }
    setIsEditing(false);
  };

  if (!user || user.role !== 'farmer') {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>Please login as a farmer to view this page.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Farmer Profile</h1>
      
      {!isEditing ? (
        // View Mode
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {user.image && (
            <div style={{ textAlign: 'center' }}>
              <img 
                src={user.image} 
                alt="Profile" 
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #ddd'
                }} 
              />
            </div>
          )}
          
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3>Personal Information</h3>
            <p><strong>First Name:</strong> {user.firstName || 'Not provided'}</p>
            <p><strong>Last Name:</strong> {user.lastName || 'Not provided'}</p>
            <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
            <p><strong>Contact Number:</strong> {user.contactNumber || 'Not provided'}</p>
            <p><strong>Role:</strong> Farmer</p>
          </div>
          
          <button 
            onClick={() => setIsEditing(true)}
            style={{ 
              padding: '12px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              cursor: 'pointer',
              borderRadius: '5px'
            }}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        // Edit Mode
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3>Edit Profile</h3>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              First Name:
            </label>
            <input
              type="text"
              name="firstName"
              value={profileData.firstName}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Last Name:
            </label>
            <input
              type="text"
              name="lastName"
              value={profileData.lastName}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Contact Number:
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={profileData.contactNumber}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Profile Image URL:
            </label>
            <input
              type="url"
              name="image"
              value={profileData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit"
              style={{ 
                flex: 1,
                padding: '12px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer',
                borderRadius: '5px'
              }}
            >
              Save Changes
            </button>
            <button 
              type="button"
              onClick={handleCancel}
              style={{ 
                flex: 1,
                padding: '12px', 
                backgroundColor: '#6c757d', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer',
                borderRadius: '5px'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FarmerProfile;