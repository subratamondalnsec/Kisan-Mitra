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
        <div className="min-h-screen bg-background dark flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto border-brand-teal"></div>
            <p className="mt-4 text-gray-400">Loading E-Mandi...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background dark transition-all duration-300">

      {/* Navbar */}
      <div className="relative z-[100]">
        <FarmerNavbar />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-2 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <header className="mb-6">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-400 leading-tight">
              <span className="stroke-text1">Farmer</span> <span className="stroke-text2">E-Mandi</span>
            </h1>
            <p className="text-lg text-gray-400 mt-2">
              Connect with verified dealers and get the best prices for your crops
            </p>
          </header>

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
            <div className="backdrop-blur-md border border-gray-600 rounded-xl p-12 text-center transition-all duration-300 bg-[#010101]">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-400">
                No crops found
              </h3>
              <p className="mb-6 text-gray-400">
                No crops found matching your search criteria.
              </p>
              {isFiltering && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-brand-teal/20 backdrop-blur-md border border-brand-teal/40 hover:bg-brand-teal/30 text-gray-300 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all duration-300 transform hover:scale-[1.02]"
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
                  className="backdrop-blur-md border border-gray-600 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg bg-[#010101]"
                >
                  {/* Dealer Information */}
                  <DealerDetailCard dealerInfo={dealerData.dealerInfo} />

                  {/* Dealer's Crops */}
                  <div className="p-6 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-400">
                        🌾 Available Crops
                      </h4>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-brand-teal/20 text-brand-teal border border-brand-teal/40">
                        {dealerData.totalCrops} crops
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dealerData.crops.map((crop) => (
                        <div
                          key={crop._id}
                          className="border border-gray-600 rounded-lg p-4 transition-all duration-300 hover:shadow-md bg-gray-800/50 hover:bg-gray-700/70"
                        >
                          <h5 className="font-semibold mb-3 text-gray-400">
                            {crop.name}
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">
                                Category:
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-brand-teal/20 text-brand-teal border border-brand-teal/40">
                                {crop.category}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">
                                Price:
                              </span>
                              <span className="font-bold text-brand-golden">
                                ₹{crop.pricePerUnit}/{crop.unit}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">
                                Available:
                              </span>
                              <span className="text-gray-300">
                                {crop.minQuantity} - {crop.maxQuantity}{" "}
                                {crop.unit}
                              </span>
                            </div>

                            {crop.harvestDate && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">
                                  Harvest:
                                </span>
                                <span className="text-gray-300">
                                  {new Date(
                                    crop.harvestDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">
                                Listed:
                              </span>
                              <span className="text-gray-300">
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
