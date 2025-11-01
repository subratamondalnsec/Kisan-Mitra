import React from 'react';

const FarmerInfoCard = ({ farmerId }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-fade-in card-shadow">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl mr-4">
                        <i className="fas fa-user"></i>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{farmerId}</h2>
                        <p className="text-gray-500">Farmer Profile</p>
                    </div>
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                    <i className="fas fa-check-circle mr-2"></i>Active
                </div>
            </div>
        </div>
    );
};

export default FarmerInfoCard;
