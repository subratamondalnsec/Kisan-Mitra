import React, { useState } from 'react';

const FarmerSearch = ({ onSearch, loading }) => {
    const [farmerId, setFarmerId] = useState('farmer_001');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (farmerId.trim()) {
            onSearch(farmerId.trim());
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-fade-in card-shadow">
            <div className="flex items-center mb-6">
                <i className="fas fa-search text-3xl text-purple-600 mr-4"></i>
                <h2 className="text-2xl font-bold text-gray-800">Farmer Data Lookup</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        value={farmerId}
                        onChange={(e) => setFarmerId(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Fixed: farmer_001 (Testing Mode)"
                        className="w-full px-6 py-4 border-2 border-green-300 rounded-xl focus:border-green-500 focus:outline-none text-lg transition-all bg-green-50"
                        disabled={true}
                        readOnly
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all pulse-hover font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <i className="fas fa-sync-alt mr-2"></i>
                    {loading ? 'Loading...' : 'Reload'}
                </button>
            </form>
        </div>
    );
};

export default FarmerSearch;
