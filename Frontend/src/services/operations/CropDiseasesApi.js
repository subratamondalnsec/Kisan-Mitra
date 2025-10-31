import { apiConnector } from "../apiconnector";
import { CropDiseaseAPI } from "../apis";
import toast from "react-hot-toast";

/**
 * Helper: Convert file to Base64 string
 */
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Analyze crop disease with ML model
export const analyzeCropDisease = async (imageFile, cropType, token) => {
  const toastId = toast.loading("Analyzing crop disease...");
  
  try {
    // Validate inputs
    if (!imageFile) {
      throw new Error("Please upload an image");
    }
    if (!cropType) {
      throw new Error("Please select crop type");
    }

    // Convert image to base64
    const base64Image = await convertToBase64(imageFile);
    const pureBase64 = base64Image.startsWith("data:")
  ? base64Image.slice(5) // remove only "data:"
  : base64Image;
    // console.log("Pure Base64 Image String:", pureBase64);
    const payload = {
      image: pureBase64,
      cropType: cropType.toLowerCase(),
    };

    const response = await apiConnector(
      "POST",
      CropDiseaseAPI.CREATE_PREDICTION,
      payload,
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );

    if (response.data.success) {
      toast.success("Disease analysis completed successfully!");
      return response.data;
    }
  } catch (error) {
    console.error("Analyze crop disease error:", error);
    const errorMessage = error?.response?.data?.message || error?.message || "Failed to analyze crop disease";
    toast.error(errorMessage);
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};

// Get farmer's prediction history
export const getPredictionHistory = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      CropDiseaseAPI.GET_PREDICTION_HISTORY,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.error("Get prediction history error:", error);
    const errorMessage = error?.response?.data?.message || "Failed to load history";
    toast.error(errorMessage);
    throw error;
  }
};

// Get specific prediction by ID
export const getPredictionById = async (diseaseId, token) => {
  try {
    const response = await apiConnector(
      "POST",
      CropDiseaseAPI.GET_PREDICTION_BY_ID,
      { DiseaseId: diseaseId },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );

    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.error("Get prediction by ID error:", error);
    const errorMessage = error?.response?.data?.message || "Failed to load prediction";
    toast.error(errorMessage);
    throw error;
  }
};

// Delete a prediction
export const deleteCropDiseasePrediction = async (diseaseId, token) => {
  const toastId = toast.loading("Deleting prediction...");
  
  try {
    const response = await apiConnector(
      "DELETE",
      CropDiseaseAPI.DELETE_PREDICTION,
      { DiseaseId: diseaseId },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );

    if (response.data.success) {
      toast.success("Prediction deleted successfully");
      return response.data;
    }
  } catch (error) {
    console.error("Delete prediction error:", error);
    const errorMessage = error?.response?.data?.message || "Failed to delete prediction";
    toast.error(errorMessage);
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};
