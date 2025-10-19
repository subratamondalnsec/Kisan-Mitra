import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDealerProfile, updateDealerProfile } from '../services/operations/DealerAuthApI';
import DealerNavbar from '../components/Common/DealerNavbar';

const DealerProfile = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
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
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>Please login as a dealer to view this page.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <DealerNavbar />
      <h1>Dealer Profile</h1>
      
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
            <p><strong>Full Name:</strong> {user.FullName || 'Not provided'}</p>
            <p><strong>Last Name:</strong> {user.lastName || 'Not provided'}</p>
            <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
            <p><strong>Contact Number:</strong> {user.contactNumber || 'Not provided'}</p>
            <p><strong>WhatsApp Number:</strong> {user.whatsappNumber || 'Not provided'}</p>
            <p><strong>Role:</strong> Dealer</p>
          </div>

          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3>Business Information</h3>
            <p><strong>Business Name:</strong> {user.businessAddress?.businessName || 'Not provided'}</p>
            <p><strong>Street:</strong> {user.businessAddress?.street || 'Not provided'}</p>
            <p><strong>Area:</strong> {user.businessAddress?.area || 'Not provided'}</p>
            <p><strong>City:</strong> {user.businessAddress?.city || 'Not provided'}</p>
            <p><strong>District:</strong> {user.businessAddress?.district || 'Not provided'}</p>
            <p><strong>State:</strong> {user.businessAddress?.state || 'Not provided'}</p>
            <p><strong>Pin Code:</strong> {user.businessAddress?.pincode || 'Not provided'}</p>
            <p><strong>Landmark:</strong> {user.businessAddress?.landmark || 'Not provided'}</p>
            {user.businessAddress?.coordinates && (user.businessAddress.coordinates.longitude || user.businessAddress.coordinates.latitude) && (
              <p><strong>Coordinates:</strong> {user.businessAddress.coordinates.latitude}, {user.businessAddress.coordinates.longitude}</p>
            )}
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
              Full Name:
            </label>
            <input
              type="text"
              name="FullName"
              value={profileData.FullName}
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
              WhatsApp Number:
            </label>
            <input
              type="tel"
              name="whatsappNumber"
              value={profileData.whatsappNumber}
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

          <h4 style={{ margin: '20px 0 10px 0', color: '#333' }}>Business Address</h4>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Business Name:
            </label>
            <input
              type="text"
              name="businessAddress.businessName"
              value={profileData.businessAddress.businessName}
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
              Street Address:
            </label>
            <input
              type="text"
              name="businessAddress.street"
              value={profileData.businessAddress.street}
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
              Area/Sector:
            </label>
            <input
              type="text"
              name="businessAddress.area"
              value={profileData.businessAddress.area}
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
              City:
            </label>
            <input
              type="text"
              name="businessAddress.city"
              value={profileData.businessAddress.city}
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
              District:
            </label>
            <input
              type="text"
              name="businessAddress.district"
              value={profileData.businessAddress.district}
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
              State:
            </label>
            <input
              type="text"
              name="businessAddress.state"
              value={profileData.businessAddress.state}
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
              Pin Code:
            </label>
            <input
              type="text"
              name="businessAddress.pincode"
              value={profileData.businessAddress.pincode}
              onChange={handleChange}
              required
              pattern="[0-9]{6}"
              title="Please enter a valid 6-digit pin code"
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
              Landmark:
            </label>
            <input
              type="text"
              name="businessAddress.landmark"
              value={profileData.businessAddress.landmark}
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

          <h5 style={{ margin: '15px 0 5px 0', color: '#666' }}>Coordinates (Optional)</h5>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Longitude:
              </label>
              <input
                type="number"
                name="businessAddress.longitude"
                value={profileData.businessAddress.coordinates.longitude}
                onChange={handleChange}
                step="any"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ccc',
                  borderRadius: '5px'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Latitude:
              </label>
              <input
                type="number"
                name="businessAddress.latitude"
                value={profileData.businessAddress.coordinates.latitude}
                onChange={handleChange}
                step="any"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ccc',
                  borderRadius: '5px'
                }}
              />
            </div>
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

export default DealerProfile;