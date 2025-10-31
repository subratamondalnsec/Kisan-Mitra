import { apiConnector } from "../apiconnector";
import { CropAPI } from "../apis";
import toast from "react-hot-toast";
import { 
  setLoading, 
  addCrop, 
  setDealerCrops, 
  setSelectedCrop, 
  updateCrop, 
  deleteCrop, 
  setAllCrops, 
  setFilteredCrops 
} from "../../slices/cropSlice";

// Crop API operations for dealers
export const createCrop = (cropData, token) => async (dispatch) => {
  const toastId = toast.loading("Creating crop...");
  try {
    dispatch(setLoading(true));
    
    const response = await apiConnector("POST", CropAPI.CREATE_CROP, cropData, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    if (response.data.success) {
      dispatch(addCrop(response.data.data.crop));
      toast.success("Crop created successfully");
      return response.data;
    }
  } catch (error) {
    console.error("Create crop error:", error);
    toast.error(error.response?.data?.message || "Failed to create crop");
    throw error;
  } finally {
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
};

export const getDealerCrops = (token) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await apiConnector("GET", CropAPI.GET_DEALER_CROPS, null, {
      Authorization: `Bearer ${token}`,
    });

    if (response.data.success) {
      dispatch(setDealerCrops(response.data.data.crops));
      return response.data;
    }
  } catch (error) {
    console.error("Get dealer crops error:", error);
    toast.error(error.response?.data?.message || "Failed to fetch crops");
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const getCropById = (cropId, token) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await apiConnector("GET", CropAPI.GET_CROP_BY_ID + cropId, null, {
      Authorization: `Bearer ${token}`,
    });

    if (response.data.success) {
      dispatch(setSelectedCrop(response.data.data.crop));
      return response.data;
    }
  } catch (error) {
    console.error("Get crop by ID error:", error);
    toast.error(error.response?.data?.message || "Failed to fetch crop details");
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateCropAction = (cropId, updateData, token) => async (dispatch) => {
  const toastId = toast.loading("Updating crop...");
  try {
    dispatch(setLoading(true));
    
    const response = await apiConnector("PUT", CropAPI.UPDATE_CROP + cropId, updateData, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    if (response.data.success) {
      dispatch(updateCrop(response.data.data.crop));
      toast.success("Crop updated successfully");
      return response.data;
    }
  } catch (error) {
    console.error("Update crop error:", error);
    toast.error(error.response?.data?.message || "Failed to update crop");
    throw error;
  } finally {
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
};

export const deleteCropAction = (cropId, token) => async (dispatch) => {
  const toastId = toast.loading("Deleting crop...");
  try {
    dispatch(setLoading(true));
    
    const response = await apiConnector("DELETE", CropAPI.DELETE_CROP + cropId, null, {
      Authorization: `Bearer ${token}`,
    });

    if (response.data.success) {
      dispatch(deleteCrop(cropId));
      toast.success("Crop deleted successfully");
      return response.data;
    }
  } catch (error) {
    console.error("Delete crop error:", error);
    toast.error(error.response?.data?.message || "Failed to delete crop");
    throw error;
  } finally {
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
};

// Public API operations for farmers
export const getAllCrops = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await apiConnector("GET", CropAPI.GET_ALL_CROPS);

    if (response.data.success) {
      dispatch(setAllCrops(response.data.data));
      return response.data;
    }
  } catch (error) {
    console.error("Get all crops error:", error);
    toast.error(error.response?.data?.message || "Failed to fetch crops");
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const getFilteredCrops = (filters) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.location) queryParams.append('location', filters.location);
    
    const url = `${CropAPI.GET_FILTERED_CROPS}?${queryParams.toString()}`;
    const response = await apiConnector("GET", url);

    if (response.data.success) {
      dispatch(setFilteredCrops(response.data.data));
      return response.data;
    }
  } catch (error) {
    console.error("Get filtered crops error:", error);
    toast.error(error.response?.data?.message || "Failed to filter crops");
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Clear actions - these don't need to be thunks, just import and use directly
// export const clearSelectedCrop - import from slice
// export const clearCrops - import from slice  
// export const setFilters - import from slice