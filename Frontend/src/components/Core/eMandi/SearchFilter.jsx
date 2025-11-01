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
    <div className="backdrop-blur-md border border-gray-600 rounded-xl p-4 mb-6 transition-all duration-300 bg-[#010101]">
      
      {/* 8 Column Grid Layout */}
      <div className="space-y-3">
        {/* Grid with filters */}
        <div className="grid grid-cols-8 gap-3 items-end">
          {/* Search Input - col-span-3 */}
          <div className="col-span-3">
            <label className="block text-xs font-medium mb-1 text-gray-400">
              Search:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🌾 Crop name..."
              className="w-full px-3 py-2 text-sm border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all duration-300 bg-gray-800/50 text-gray-300 placeholder-gray-400"
            />
          </div>

          {/* Category Filter - col-span-1 */}
          <div className="col-span-1">
            <label className="block text-xs font-medium mb-1 text-gray-400">
              Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2 py-2 text-sm border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all duration-300 bg-gray-800/50 text-gray-300"
            >
              <option value="">All</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Min Price - col-span-1 */}
          <div className="col-span-1">
            <label className="block text-xs font-medium mb-1 text-gray-400">
              Min ₹:
            </label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full px-2 py-2 text-sm border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all duration-300 bg-gray-800/50 text-gray-300 placeholder-gray-400"
            />
          </div>

          {/* Max Price - col-span-1 */}
          <div className="col-span-1">
            <label className="block text-xs font-medium mb-1 text-gray-400">
              Max ₹:
            </label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="10000"
              min="0"
              className="w-full px-2 py-2 text-sm border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all duration-300 bg-gray-800/50 text-gray-300 placeholder-gray-400"
            />
          </div>

          {/* Location - col-span-2 */}
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1 text-gray-400">
              Location:
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="📍 City..."
              className="w-full px-2 py-2 text-sm border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all duration-300 bg-gray-800/50 text-gray-300 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Clear Button - Bottom of the line, only show when filters are active */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <button
              onClick={onClear}
              className="px-4 py-2 text-sm font-medium rounded-lg focus:outline-none transition-all duration-300 hover:scale-[1.02] shadow-md flex items-center gap-2 bg-gray-600/50 text-gray-300 hover:bg-gray-600/70 focus:ring-gray-500/50 border border-gray-600"
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