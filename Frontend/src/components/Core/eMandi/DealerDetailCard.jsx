import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DealerDetailCard = ({ dealerInfo }) => {
  const [showFullAddress, setShowFullAddress] = useState(false);
  const navigate = useNavigate();

  // // Debug: Log dealerInfo structure
  // console.log("DealerDetailCard - dealerInfo:", dealerInfo);

  // Add error checking
  if (!dealerInfo) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        <p>Dealer information not available</p>
      </div>
    );
  }

  if (!dealerInfo.businessAddress) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        <p>Dealer address information not available</p>
      </div>
    );
  }

  const handleCallDealer = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleWhatsAppDealer = (whatsappNumber) => {
    window.open(`https://wa.me/91${whatsappNumber}`, '_blank');
  };

  const handleGetDirections = (address) => {
    const fullAddress = `${address.street}, ${address.area}, ${address.city}, ${address.district}, ${address.state} ${address.pincode}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      padding: '20px', 
      borderRadius: '12px',
      marginBottom: '20px',
      border: '1px solid #e0e0e0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* Dealer Header with Image */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{ 
          width: '70px', 
          height: '70px', 
          borderRadius: '50%', 
          overflow: 'hidden',
          marginRight: '15px',
          border: '3px solid #4CAF50',
          boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
        }}>
          <img 
            src={dealerInfo.image || `https://api.dicebear.com/5.x/initials/svg?seed=${dealerInfo.FullName}%20${dealerInfo.lastName}`}
            alt="Dealer"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '22px' }}>
            {dealerInfo.FullName} {dealerInfo.lastName}
            {dealerInfo.isVerified && (
              <span style={{ 
                color: 'white', 
                backgroundColor: '#4CAF50',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                marginLeft: '10px'
              }}>
                ✓ Verified
              </span>
            )}
          </h3>
          <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '16px', fontWeight: 'bold' }}>
            🏪 {dealerInfo.businessAddress.businessName}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <p style={{ margin: '0', color: '#888', fontSize: '14px' }}>
              ⭐ {dealerInfo.averageRating?.toFixed(1) || '0.0'}/5
            </p>
            <span style={{ color: '#666', fontSize: '12px' }}>
              ({dealerInfo.ratingCount || 0} {dealerInfo.ratingCount === 1 ? 'review' : 'reviews'})
            </span>
            {dealerInfo.ratingCount > 0 && (
              <button
                onClick={() => navigate(`/farmer/${dealerInfo._id}/reviews`)}
                style={{
                  background: 'none',
                  border: '1px solid #4CAF50',
                  color: '#4CAF50',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#4CAF50';
                  e.target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#4CAF50';
                }}
              >
                View Reviews
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '15px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => handleCallDealer(dealerInfo.contactNumber)}
          style={{ 
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(76, 175, 80, 0.2)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#45a049';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(76, 175, 80, 0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#4CAF50';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(76, 175, 80, 0.2)';
          }}
        >
          📞 Call Now
        </button>
        
        {dealerInfo.whatsappNumber && (
          <button
            onClick={() => handleWhatsAppDealer(dealerInfo.whatsappNumber)}
            style={{ 
              backgroundColor: '#25D366',
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(37, 211, 102, 0.2)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#20ba5a';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 8px rgba(37, 211, 102, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#25D366';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(37, 211, 102, 0.2)';
            }}
          >
            💬 WhatsApp
          </button>
        )}
        
        <button
          onClick={() => handleGetDirections(dealerInfo.businessAddress)}
          style={{ 
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(33, 150, 243, 0.2)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#1976D2';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(33, 150, 243, 0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#2196F3';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(33, 150, 243, 0.2)';
          }}
        >
          🗺️ Directions
        </button>

        <button
          onClick={() => setShowFullAddress(!showFullAddress)}
          style={{ 
            backgroundColor: showFullAddress ? '#FF9800' : '#6c757d',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(108, 117, 125, 0.2)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = showFullAddress ? '#F57C00' : '#5a6268';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(108, 117, 125, 0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = showFullAddress ? '#FF9800' : '#6c757d';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(108, 117, 125, 0.2)';
          }}
        >
          📍 {showFullAddress ? 'Hide' : 'Show'} Address
        </button>

        <button
          onClick={() => navigate(`/farmer/${dealerInfo._id}/reviews`)}
          style={{ 
            backgroundColor: '#9C27B0',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(156, 39, 176, 0.2)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#7B1FA2';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(156, 39, 176, 0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#9C27B0';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(156, 39, 176, 0.2)';
          }}
        >
          ⭐ View All Reviews ({dealerInfo.ratingCount || 0})
        </button>
      </div>

      {/* Contact Information */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '15px',
        border: '1px solid #e9ecef'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '16px' }}>📞 Contact Information</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
          <p style={{ margin: '0', fontSize: '14px' }}>
            <strong>Phone:</strong> 
            <a href={`tel:${dealerInfo.contactNumber}`} style={{ color: '#4CAF50', textDecoration: 'none', marginLeft: '5px' }}>
              {dealerInfo.contactNumber}
            </a>
          </p>
          {dealerInfo.whatsappNumber && (
            <p style={{ margin: '0', fontSize: '14px' }}>
              <strong>WhatsApp:</strong> 
              <a href={`https://wa.me/91${dealerInfo.whatsappNumber}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', marginLeft: '5px' }}>
                {dealerInfo.whatsappNumber}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Full Address - Collapsible */}
      {showFullAddress && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          transition: 'all 0.3s ease-in-out',
          opacity: showFullAddress ? 1 : 0,
          transform: showFullAddress ? 'translateY(0)' : 'translateY(-10px)'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '16px' }}>📍 Complete Business Address</h4>
          <div style={{ lineHeight: '1.6' }}>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '10px', 
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              <p style={{ margin: '0 0 3px 0' }}>
                <strong>{dealerInfo.businessAddress.businessName}</strong>
              </p>
              <p style={{ margin: '0 0 3px 0' }}>
                {dealerInfo.businessAddress.street}
              </p>
              <p style={{ margin: '0 0 3px 0' }}>
                {dealerInfo.businessAddress.area}
              </p>
              <p style={{ margin: '0 0 3px 0' }}>
                {dealerInfo.businessAddress.city}, {dealerInfo.businessAddress.district}
              </p>
              <p style={{ margin: '0 0 3px 0' }}>
                {dealerInfo.businessAddress.state} - {dealerInfo.businessAddress.pincode}
              </p>
              {dealerInfo.businessAddress.landmark && (
                <p style={{ margin: '0', color: '#666', fontStyle: 'italic' }}>
                  Near: {dealerInfo.businessAddress.landmark}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerDetailCard;