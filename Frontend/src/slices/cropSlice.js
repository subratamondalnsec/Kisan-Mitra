import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Loading states
  loading: false,
  
  // Dealer-specific crops
  dealerCrops: [],
  selectedCrop: null,
  
  // Public crops (for farmers)
  allCrops: [],
  filteredCrops: [],
  
  // Filters
  filters: {
    category: "",
    search: "",
    minPrice: "",
    maxPrice: "",
    location: ""
  },
  
  // Pagination (if needed later)
  totalCrops: 0,
  
  // Error handling
  error: null
};

const cropSlice = createSlice({
  name: "crop",
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Error handling
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    
    // Dealer crop operations
    setDealerCrops: (state, action) => {
      state.dealerCrops = action.payload;
    },
    
    addCrop: (state, action) => {
      state.dealerCrops.unshift(action.payload);
    },
    
    updateCrop: (state, action) => {
      const index = state.dealerCrops.findIndex(crop => crop._id === action.payload._id);
      if (index !== -1) {
        state.dealerCrops[index] = action.payload;
      }
      // Update selected crop if it's the same
      if (state.selectedCrop && state.selectedCrop._id === action.payload._id) {
        state.selectedCrop = action.payload;
      }
    },
    
    deleteCrop: (state, action) => {
      state.dealerCrops = state.dealerCrops.filter(crop => crop._id !== action.payload);
      // Clear selected crop if it's the deleted one
      if (state.selectedCrop && state.selectedCrop._id === action.payload) {
        state.selectedCrop = null;
      }
    },
    
    setSelectedCrop: (state, action) => {
      state.selectedCrop = action.payload;
    },
    
    clearSelectedCrop: (state) => {
      state.selectedCrop = null;
    },
    
    // Public crops (for farmers)
    setAllCrops: (state, action) => {
      state.allCrops = action.payload;
    },
    
    setFilteredCrops: (state, action) => {
      state.filteredCrops = action.payload;
    },
    
    // Filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    // Clear all crops
    clearCrops: (state) => {
      state.dealerCrops = [];
      state.allCrops = [];
      state.filteredCrops = [];
      state.selectedCrop = null;
    },
    
    // Set total crops count
    setTotalCrops: (state, action) => {
      state.totalCrops = action.payload;
    }
  }
});

export const {
  setLoading,
  setError,
  clearError,
  setDealerCrops,
  addCrop,
  updateCrop,
  deleteCrop,
  setSelectedCrop,
  clearSelectedCrop,
  setAllCrops,
  setFilteredCrops,
  setFilters,
  clearFilters,
  clearCrops,
  setTotalCrops
} = cropSlice.actions;

export default cropSlice.reducer;