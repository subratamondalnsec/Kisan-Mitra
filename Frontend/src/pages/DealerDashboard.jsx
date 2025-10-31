import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  getDealerCrops, 
  createCrop, 
  updateCropAction, 
  deleteCropAction 
} from '../services/operations/cropApi';
import { CROP_CATEGORIES } from '../constants/cropCategories';
import DealerNavbar from '../components/Common/DealerNavbar';

const DealerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector(state => state.auth);
  const { dealerCrops, loading } = useSelector(state => state.crop);
  
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    minQuantity: '',
    maxQuantity: '',
    pricePerUnit: '',
    harvestDate: ''
  });

  // Fetch dealer crops on component mount
  useEffect(() => {
    if (token) {
      dispatch(getDealerCrops(token));
    }
  }, [dispatch, token]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCrop) {
        await dispatch(updateCropAction(editingCrop._id, formData, token));
      } else {
        await dispatch(createCrop(formData, token));
      }
      resetForm();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Reset form and close modal
  const resetForm = () => {
    setFormData({
      category: '',
      name: '',
      minQuantity: '',
      maxQuantity: '',
      pricePerUnit: '',
      harvestDate: ''
    });
    setEditingCrop(null);
    setShowForm(false);
  };

  // Handle edit crop
  const handleEdit = (crop) => {
    setFormData({
      category: crop.category,
      name: crop.name,
      minQuantity: crop.minQuantity,
      maxQuantity: crop.maxQuantity,
      pricePerUnit: crop.pricePerUnit,
      harvestDate: crop.harvestDate ? crop.harvestDate.split('T')[0] : ''
    });
    setEditingCrop(crop);
    setShowForm(true);
  };

  // Handle delete crop
  const handleDelete = async (cropId) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        await dispatch(deleteCropAction(cropId, token));
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-5">
      <DealerNavbar />
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dealer Dashboard</h1>
      
      {/* Action Buttons */}
      <div className="flex gap-4 mb-5">
        <button 
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Add Today's Crop Price
        </button>
        
        <button 
          onClick={() => navigate('/dealer/my-reviews')}
          className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          View My Reviews
        </button>
      </div>

      {/* Crop Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-md bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{editingCrop ? 'Edit Crop' : 'Add New Crop'}</h3>
            <form onSubmit={handleSubmit}>
              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category:</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  {CROP_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Min Quantity */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Quantity:</label>
                <input
                  type="number"
                  name="minQuantity"
                  value={formData.minQuantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Max Quantity */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Quantity:</label>
                <input
                  type="number"
                  name="maxQuantity"
                  value={formData.maxQuantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Price Per Unit */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Unit:</label>
                <input
                  type="number"
                  name="pricePerUnit"
                  value={formData.pricePerUnit}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Harvest Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date (Optional):</label>
                <input
                  type="date"
                  name="harvestDate"
                  value={formData.harvestDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  {editingCrop ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Crops List */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">My Crops ({dealerCrops.length})</h2>
        {dealerCrops.length === 0 ? (
          <p className="text-gray-600">No crops added yet. Click "Add Today's Crop Price" to get started.</p>
        ) : (
          <div className="grid gap-4">
            {dealerCrops.map(crop => (
              <div key={crop._id} className="border border-gray-300 p-4 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{crop.name}</h3>
                    <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Category:</span> {crop.category}</p>
                    <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Price:</span> ₹{crop.pricePerUnit} per {crop.unit}</p>
                    <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Quantity Range:</span> {crop.minQuantity} - {crop.maxQuantity} {crop.unit}</p>
                    {crop.harvestDate && (
                      <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Harvest Date:</span> {new Date(crop.harvestDate).toLocaleDateString()}</p>
                    )}
                    <p className="text-sm text-gray-600"><span className="font-medium">Added:</span> {new Date(crop.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(crop)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(crop._id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DealerDashboard;