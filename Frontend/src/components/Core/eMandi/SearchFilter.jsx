import React from 'react';
import { useDarkMode } from '../../../contexts/DarkModeContext';

const SearchFilter = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  location,
  setLocation,
  categories,
  onClear,
  isFiltering,
  hasActiveFilters
}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`backdrop-blur-md border rounded-xl p-4 mb-6 transition-all duration-300 ${
      isDarkMode
        ? 'bg-gray-800/80 border-gray-600'
        : 'bg-white/80 border-gray-300'
    }`}>
      
      {/* 8 Column Grid Layout */}
      <div className="space-y-3">
        {/* Grid with filters */}
        <div className="grid grid-cols-8 gap-3 items-end">
          {/* Search Input - col-span-3 */}
          <div className="col-span-3">
            <label className={`block text-xs font-medium mb-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Search:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🌾 Crop name..."
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Category Filter - col-span-1 */}
          <div className="col-span-1">
            <label className={`block text-xs font-medium mb-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full px-2 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="">All</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Min Price - col-span-1 */}
          <div className="col-span-1">
            <label className={`block text-xs font-medium mb-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Min ₹:
            </label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              min="0"
              className={`w-full px-2 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Max Price - col-span-1 */}
          <div className="col-span-1">
            <label className={`block text-xs font-medium mb-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Max ₹:
            </label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="10000"
              min="0"
              className={`w-full px-2 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Location - col-span-2 */}
          <div className="col-span-2">
            <label className={`block text-xs font-medium mb-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Location:
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="📍 City..."
              className={`w-full px-2 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
              }`}
            />
          </div>
        </div>

        {/* Clear Button - Bottom of the line, only show when filters are active */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <button
              onClick={onClear}
              className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none transition-all duration-300 hover:scale-[1.02] shadow-md flex items-center gap-2 ${
                isDarkMode
                  ? 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500/50'
                  : 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500/50'
              }`}
            >
              <span>🗑️</span>
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;