import React from 'react';

const DealerCropList = ({ crops, onEdit, onDelete }) => {
  if (crops.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">No crops added yet. Click "Add Today's Crop Price" to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Crops ({crops.length})</h2>
      <div className="grid gap-4">
        {crops.map(crop => (
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
                  onClick={() => onEdit(crop)}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(crop._id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealerCropList;