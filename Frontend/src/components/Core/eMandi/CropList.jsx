import React from 'react';
import DealerDetailCard from './DealerDetailCard';

const CropList = ({ cropsData, isFiltering, onClearFilters }) => {
  if (cropsData.length === 0) {
    return (
      <div className="text-center p-10">
        <p className="text-gray-600 mb-4">No crops found matching your criteria.</p>
        {isFiltering && (
          <button onClick={onClearFilters} className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            View All Crops
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {cropsData.map((dealerData, index) => (
        <div key={index} className="border-2 border-gray-200 rounded-xl p-5 bg-white shadow-sm">
          {/* Dealer Information */}
          <DealerDetailCard dealerInfo={dealerData.dealerInfo} />

          {/* Dealer's Crops */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Available Crops ({dealerData.totalCrops})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dealerData.crops.map(crop => (
                <div key={crop._id} className="border border-gray-300 p-4 rounded-lg bg-gray-50">
                  <h5 className="text-base font-medium mb-2 text-gray-700">{crop.name}</h5>
                  <div className="text-sm leading-relaxed space-y-1">
                    <p><span className="font-medium">Category:</span> <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{crop.category}</span></p>
                    <p><span className="font-medium">Price:</span> <span className="text-base font-bold text-green-600">₹{crop.pricePerUnit}</span> per {crop.unit}</p>
                    <p><span className="font-medium">Available:</span> {crop.minQuantity} - {crop.maxQuantity} {crop.unit}</p>
                    {crop.harvestDate && (
                      <p><span className="font-medium">Harvest Date:</span> {new Date(crop.harvestDate).toLocaleDateString()}</p>
                    )}
                    <p><span className="font-medium">Listed:</span> {new Date(crop.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CropList;