import { apiConnector } from "../apiconnector";
import { SoilHealthAPI } from "../apis";
import toast from "react-hot-toast";

/**
 * Test soil quality with ML model
 * @param {Object} data - Soil parameters (Temperature, Humidity, Wind_Speed, Nitrogen, Phosphorous, Potassium, Crop_Type)
 * @param {String} token - Auth token
 */
export const testSoilQuality = async (data, token) => {
  const toastId = toast.loading("Analyzing soil quality...");
  
  try {
    // Validate inputs
    const { Temperature, Humidity, Wind_Speed, Nitrogen, Phosphorous, Potassium, Crop_Type } = data;
    
    if (
      Temperature === undefined ||
      Humidity === undefined ||
      Wind_Speed === undefined ||
      Nitrogen === undefined ||
      Phosphorous === undefined ||
      Potassium === undefined ||
      !Crop_Type
    ) {
      throw new Error("All soil parameters are required");
    }

    const payload = {
      Temperature: parseFloat(Temperature),
      Humidity: parseFloat(Humidity),
      Wind_Speed: parseFloat(Wind_Speed),
      Nitrogen: parseFloat(Nitrogen),
      Phosphorous: parseFloat(Phosphorous),
      Potassium: parseFloat(Potassium),
      Crop_Type: Crop_Type,
    };

    const response = await apiConnector(
      "POST",
      SoilHealthAPI.TEST_SOIL_QUALITY,
      payload,
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );

    if (response.data.success) {
      toast.success("Soil quality analysis completed successfully!");
      return response.data;
    }
  } catch (error) {
    console.error("Test soil quality error:", error);
    const errorMessage = error?.response?.data?.message || error?.message || "Failed to analyze soil quality";
    toast.error(errorMessage);
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};

/**
 * Get farmer's soil health history
 * @param {String} token - Auth token
 */
export const getSoilHealthHistory = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      SoilHealthAPI.GET_HISTORY,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.error("Get soil health history error:", error);
    const errorMessage = error?.response?.data?.message || "Failed to load soil health history";
    toast.error(errorMessage);
    throw error;
  }
};

/**
 * Delete a soil health record
 * @param {String} soilHealthId - ID of the soil health record to delete
 * @param {String} token - Auth token
 */
export const deleteSoilHealthRecord = async (soilHealthId, token) => {
  const toastId = toast.loading("Deleting soil health record...");
  
  try {
    const response = await apiConnector(
      "DELETE",
      SoilHealthAPI.DELETE_RECORD,
      { soilHealthId: soilHealthId },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );

    if (response.data.success) {
      toast.success("Soil health record deleted successfully");
      return response.data;
    }
  } catch (error) {
    console.error("Delete soil health record error:", error);
    const errorMessage = error?.response?.data?.message || "Failed to delete soil health record";
    toast.error(errorMessage);
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};
