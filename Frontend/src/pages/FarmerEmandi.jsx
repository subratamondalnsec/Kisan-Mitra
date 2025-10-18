import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAllCrops, 
  getFilteredCrops 
} from '../services/operations/cropApi';
import { CROP_CATEGORIES } from '../constants/cropCategories';

const FarmerEmandi = () => {
  const dispatch = useDispatch();
  const { allCrops, filteredCrops, loading } = useSelector(state => state.crop);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [location, setLocation] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  // Get crops to display (filtered or all)
  const cropsToDisplay = isFiltering ? filteredCrops : allCrops;

  // Fetch all crops on component mount
  useEffect(() => {
    dispatch(getAllCrops());
  }, [dispatch]);

  // Handle search
  const handleSearch = () => {
    const filterParams = {
      search: searchTerm,
      category: selectedCategory,
      minPrice: minPrice,
      maxPrice: maxPrice,
      location: location
    };

    // Remove empty filters
    const cleanFilters = Object.fromEntries(
      Object.entries(filterParams).filter(([_, value]) => value !== '')
    );

    if (Object.keys(cleanFilters).length > 0) {
      setIsFiltering(true);
      dispatch(getFilteredCrops(cleanFilters));
    } else {
      // If no filters, show all crops
      setIsFiltering(false);
      dispatch(getAllCrops());
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setLocation('');
    setIsFiltering(false);
    dispatch(getAllCrops());
  };

  // Handle Enter key in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return <div>Loading crops...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Farmer E-Mandi</h1>
      
      {/* Search and Filter Section */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>Search & Filter Crops</h3>
        
        {/* Search Input */}
        <div style={{ marginBottom: '15px' }}>
          <label>Search by crop name:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., rice, wheat, tomato..."
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>

        {/* Filter Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px',
          marginBottom: '15px'
        }}>
          {/* Category Filter */}
          <div>
            <label>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="">All Categories</option>
              {CROP_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label>Min Price (₹):</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              min="0"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          {/* Max Price */}
          <div>
            <label>Max Price (₹):</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="10000"
              min="0"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          {/* Location */}
          <div>
            <label>Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, District, Area, Street, Pincode, or Landmark"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSearch}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Search & Filter
          </button>
          <button
            onClick={clearFilters}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear Filters
          </button>
        </div>
        
        {isFiltering && (
          <p style={{ marginTop: '10px', color: '#666' }}>
            Showing filtered results. <button onClick={clearFilters} style={{ color: 'blue', background: 'none', border: 'none', cursor: 'pointer' }}>View all crops</button>
          </p>
        )}
      </div>

      {/* Results Summary */}
      <div style={{ marginBottom: '20px' }}>
        <h2>
          {isFiltering ? 'Filtered Results' : 'All Available Crops'} 
          ({cropsToDisplay.length} {cropsToDisplay.length === 1 ? 'dealer' : 'dealers'})
        </h2>
      </div>

      {/* Crops Display - Grouped by Dealer */}
      {cropsToDisplay.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No crops found matching your criteria.</p>
          {isFiltering && (
            <button onClick={clearFilters} style={{ 
              padding: '10px 20px', 
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              View All Crops
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {cropsToDisplay.map((dealerData, index) => (
            <div key={index} style={{ 
              border: '2px solid #e0e0e0', 
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: 'white'
            }}>
          {/* Dealer Information */}
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid #e0e0e0'
          }}>
            {/* Dealer Header with Image */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                overflow: 'hidden',
                marginRight: '15px',
                border: '2px solid #4CAF50'
              }}>
                <img 
                  src={dealerData.dealerInfo.image || `https://api.dicebear.com/5.x/initials/svg?seed=${dealerData.dealerInfo.FullName}%20${dealerData.dealerInfo.lastName}`}
                  alt="Dealer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '20px' }}>
                  {dealerData.dealerInfo.FullName} {dealerData.dealerInfo.lastName}
                  {dealerData.dealerInfo.isVerified && <span style={{ color: 'green', marginLeft: '10px', fontSize: '16px' }}>✓ Verified</span>}
                </h3>
                <p style={{ margin: '0', color: '#666', fontSize: '16px', fontWeight: 'bold' }}>
                  {dealerData.dealerInfo.businessAddress.businessName}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '15px', 
              borderRadius: '8px',
              marginBottom: '15px',
              border: '1px solid #e9ecef'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>📞 Contact Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                <p style={{ margin: '0' }}><strong>Phone:</strong> {dealerData.dealerInfo.contactNumber}</p>
                {dealerData.dealerInfo.whatsappNumber && (
                  <p style={{ margin: '0' }}><strong>WhatsApp:</strong> {dealerData.dealerInfo.whatsappNumber}</p>
                )}
                <p style={{ margin: '0' }}><strong>Rating:</strong> ⭐ {dealerData.dealerInfo.averageRating}/5</p>
              </div>
            </div>

            {/* Full Address */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '15px', 
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>📍 Business Address</h4>
              <div style={{ lineHeight: '1.6' }}>
                <p style={{ margin: '0 0 5px 0' }}>
                  <strong>Street:</strong> {dealerData.dealerInfo.businessAddress.street}
                </p>
                <p style={{ margin: '0 0 5px 0' }}>
                  <strong>Area:</strong> {dealerData.dealerInfo.businessAddress.area}
                </p>
                <p style={{ margin: '0 0 5px 0' }}>
                  <strong>City:</strong> {dealerData.dealerInfo.businessAddress.city}, {dealerData.dealerInfo.businessAddress.district}
                </p>
                <p style={{ margin: '0 0 5px 0' }}>
                  <strong>State:</strong> {dealerData.dealerInfo.businessAddress.state} - <strong>PIN:</strong> {dealerData.dealerInfo.businessAddress.pincode}
                </p>
                {dealerData.dealerInfo.businessAddress.landmark && (
                  <p style={{ margin: '0', color: '#666' }}>
                    <strong>Landmark:</strong> {dealerData.dealerInfo.businessAddress.landmark}
                  </p>
                )}
              </div>
            </div>
          </div>              {/* Dealer's Crops */}
              <div>
                <h4 style={{ marginBottom: '15px' }}>Available Crops ({dealerData.totalCrops})</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                  {dealerData.crops.map(crop => (
                    <div key={crop._id} style={{ 
                      border: '1px solid #ddd', 
                      padding: '15px', 
                      borderRadius: '8px',
                      backgroundColor: '#fafafa'
                    }}>
                      <h5 style={{ margin: '0 0 10px 0', color: '#34495e' }}>{crop.name}</h5>
                      <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                        <p><strong>Category:</strong> <span style={{ 
                          backgroundColor: '#e3f2fd', 
                          padding: '2px 8px', 
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>{crop.category}</span></p>
                        <p><strong>Price:</strong> <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#27ae60' }}>₹{crop.pricePerUnit}</span> per {crop.unit}</p>
                        <p><strong>Available:</strong> {crop.minQuantity} - {crop.maxQuantity} {crop.unit}</p>
                        {crop.harvestDate && (
                          <p><strong>Harvest Date:</strong> {new Date(crop.harvestDate).toLocaleDateString()}</p>
                        )}
                        <p><strong>Listed:</strong> {new Date(crop.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerEmandi;