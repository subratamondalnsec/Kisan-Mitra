import React from 'react';

const CropForm = ({ 
  formData, 
  categories, 
  isEditing, 
  onSubmit, 
  onInputChange, 
  onCancel 
}) => {
  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-md bg-opacity-50 flex justify-center items-center z-50 ">
      <div className="bg-white p-5 rounded-lg w-96 max-h-screen overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Crop' : 'Add New Crop'}</h3>
        <form onSubmit={onSubmit}>
          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={onInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
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
              onChange={onInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Min Quantity */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Quantity:</label>
            <input
              type="number"
              name="minQuantity"
              value={formData.minQuantity}
              onChange={onInputChange}
              required
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Max Quantity */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Quantity:</label>
            <input
              type="number"
              name="maxQuantity"
              value={formData.maxQuantity}
              onChange={onInputChange}
              required
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Price Per Unit */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Unit:</label>
            <input
              type="number"
              name="pricePerUnit"
              value={formData.pricePerUnit}
              onChange={onInputChange}
              required
              min="0"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Harvest Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date (Optional):</label>
            <input
              type="date"
              name="harvestDate"
              value={formData.harvestDate}
              onChange={onInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Form Buttons */}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              {isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CropForm;