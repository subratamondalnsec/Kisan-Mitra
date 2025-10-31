import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllCrops, getFilteredCrops } from "../services/operations/cropApi";
import { CROP_CATEGORIES } from "../constants/cropCategories";
import FarmerNavbar from "../components/Common/FarmerNavbar";
import DealerDetailCard from "../components/Core/eMandi/DealerDetailCard";
import SearchFilter from "../components/Core/eMandi/SearchFilter";
import { useDarkMode } from "../contexts/DarkModeContext";

const FarmerEmandi = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allCrops, filteredCrops, loading } = useSelector(
    (state) => state.crop
  );
  const { isDarkMode } = useDarkMode();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);

  // Get crops to display (filtered or all)
  const cropsToDisplay = isFiltering ? filteredCrops : allCrops;

  // Check if any filters are active
  const hasActiveFilters = searchTerm || selectedCategory || minPrice || maxPrice || location;

  // Fetch all crops on component mount
  useEffect(() => {
    dispatch(getAllCrops());
  }, [dispatch]);

  // Handle search
  const handleSearch = React.useCallback(() => {
    const filterParams = {
      search: searchTerm,
      category: selectedCategory,
      minPrice: minPrice,
      maxPrice: maxPrice,
      location: location,
    };

    // Remove empty filters
    const cleanFilters = Object.fromEntries(
      Object.entries(filterParams).filter(([_, value]) => value !== "")
    );

    if (Object.keys(cleanFilters).length > 0) {
      setIsFiltering(true);
      dispatch(getFilteredCrops(cleanFilters));
    } else {
      // If no filters, show all crops
      setIsFiltering(false);
      dispatch(getAllCrops());
    }
  }, [dispatch, searchTerm, selectedCategory, minPrice, maxPrice, location]);

  // Real-time search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [handleSearch]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setLocation("");
    setIsFiltering(false);
    dispatch(getAllCrops());
  };

  if (loading) {
    return (
      <>
        <FarmerNavbar />
        <div
          className={`min-h-screen flex items-center justify-center ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900"
              : "bg-gradient-to-br from-blue-50 via-white to-cyan-50"
          }`}
        >
          <div className="text-center">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${
                isDarkMode ? "border-blue-400" : "border-blue-600"
              }`}
            ></div>
            <p
              className={`mt-4 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Loading E-Mandi...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-white to-cyan-50"
      }`}
    >
      {/* Overlay for better contrast */}
      <div
        className={`absolute inset-0 -z-10 transition-all duration-300 ${
          isDarkMode
            ? "bg-gradient-to-r from-slate-900/50 via-transparent to-gray-900/50"
            : "bg-gradient-to-r from-blue-50/50 via-transparent to-cyan-50/50"
        }`}
      ></div>

      {/* Navbar */}
      <div className="relative z-[100]">
        <FarmerNavbar />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-8 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <h1
            className={`text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r ${
              isDarkMode
                ? "from-blue-400 to-cyan-400"
                : "from-blue-600 to-cyan-600"
            }`}
          >
            🌾 Farmer E-Mandi
          </h1>

          {/* Compact Search Filter */}
          <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            location={location}
            setLocation={setLocation}
            categories={CROP_CATEGORIES}
            onClear={clearFilters}
            isFiltering={isFiltering}
            hasActiveFilters={hasActiveFilters}
          />


          {/* Crops Display - Grouped by Dealer */}
          {cropsToDisplay.length === 0 ? (
            <div
              className={`backdrop-blur-md border rounded-xl p-12 text-center transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800/80 border-gray-600"
                  : "bg-white/80 border-gray-300"
              }`}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3
                className={`text-xl font-semibold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                No crops found
              </h3>
              <p
                className={`mb-6 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                No crops found matching your search criteria.
              </p>
              {isFiltering && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                >
                  🌾 View All Crops
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {cropsToDisplay.map((dealerData, index) => (
                <div
                  key={index}
                  className={`backdrop-blur-md border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    isDarkMode
                      ? "bg-gray-800/80 border-gray-600"
                      : "bg-white/80 border-gray-300"
                  }`}
                >
                  {/* Dealer Information */}
                  <DealerDetailCard dealerInfo={dealerData.dealerInfo} />

                  {/* Dealer's Crops */}
                  <div className="p-6 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4
                        className={`text-lg font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        🌾 Available Crops
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isDarkMode
                            ? "bg-green-600/20 text-green-400 border border-green-500/30"
                            : "bg-green-100 text-green-600 border border-green-200"
                        }`}
                      >
                        {dealerData.totalCrops} crops
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dealerData.crops.map((crop) => (
                        <div
                          key={crop._id}
                          className={`border rounded-lg p-4 transition-all duration-300 hover:shadow-md ${
                            isDarkMode
                              ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700/70"
                              : "bg-gray-200/50 border-gray-300 hover:bg-gray-100/80"
                          }`}
                        >
                          <h5
                            className={`font-semibold mb-3 ${
                              isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {crop.name}
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span
                                className={
                                  isDarkMode ? "text-gray-300" : "text-gray-600"
                                }
                              >
                                Category:
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  isDarkMode
                                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                                    : "bg-blue-100 text-blue-600 border border-blue-200"
                                }`}
                              >
                                {crop.category}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span
                                className={
                                  isDarkMode ? "text-gray-300" : "text-gray-600"
                                }
                              >
                                Price:
                              </span>
                              <span
                                className={`font-bold ${
                                  isDarkMode
                                    ? "text-green-400"
                                    : "text-green-600"
                                }`}
                              >
                                ₹{crop.pricePerUnit}/{crop.unit}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span
                                className={
                                  isDarkMode ? "text-gray-300" : "text-gray-600"
                                }
                              >
                                Available:
                              </span>
                              <span
                                className={
                                  isDarkMode ? "text-gray-200" : "text-gray-700"
                                }
                              >
                                {crop.minQuantity} - {crop.maxQuantity}{" "}
                                {crop.unit}
                              </span>
                            </div>

                            {crop.harvestDate && (
                              <div className="flex items-center justify-between">
                                <span
                                  className={
                                    isDarkMode
                                      ? "text-gray-300"
                                      : "text-gray-600"
                                  }
                                >
                                  Harvest:
                                </span>
                                <span
                                  className={
                                    isDarkMode
                                      ? "text-gray-200"
                                      : "text-gray-700"
                                  }
                                >
                                  {new Date(
                                    crop.harvestDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <span
                                className={
                                  isDarkMode ? "text-gray-300" : "text-gray-600"
                                }
                              >
                                Listed:
                              </span>
                              <span
                                className={
                                  isDarkMode ? "text-gray-200" : "text-gray-700"
                                }
                              >
                                {new Date(crop.createdAt).toLocaleDateString()}
                              </span>
                            </div>
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
      </div>
    </div>
  );
};

export default FarmerEmandi;
