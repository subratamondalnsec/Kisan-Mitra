import { apiConnector } from '../apiconnector';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api/v1';
const FIREBASE_IMAGES_API = `${BASE_URL}/firebase-images`;

/**
 * Upload a single crop image to backend
 * Backend will upload to Cloudinary and save URL to MongoDB
 */
export const uploadCropImage = async (imageData) => {
    try {
        const response = await apiConnector(
            'POST',
            `${FIREBASE_IMAGES_API}/upload`,
            imageData
        );
        return response.data;
    } catch (error) {
        console.error('Error uploading crop image:', error);
        throw error;
    }
};

/**
 * Bulk upload multiple images at once
 */
export const bulkUploadCropImages = async (farmerId, testName, images) => {
    try {
        const response = await apiConnector(
            'POST',
            `${FIREBASE_IMAGES_API}/upload/bulk`,
            {
                farmerId,
                testName,
                images
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error bulk uploading crop images:', error);
        throw error;
    }
};

/**
 * Get all images for a specific farmer
 * Returns organized data by test name
 */
export const getFarmerImages = async (farmerId) => {
    try {
        const response = await apiConnector(
            'GET',
            `${FIREBASE_IMAGES_API}/farmer/${farmerId}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching farmer images:', error);
        throw error;
    }
};

/**
 * Get images for a specific test
 */
export const getTestImages = async (farmerId, testName) => {
    try {
        const response = await apiConnector(
            'GET',
            `${FIREBASE_IMAGES_API}/farmer/${farmerId}/test/${testName}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching test images:', error);
        throw error;
    }
};

/**
 * Update analysis result for an image
 */
export const updateAnalysisResult = async (imageId, analysisData) => {
    try {
        const response = await apiConnector(
            'PUT',
            `${FIREBASE_IMAGES_API}/image/${imageId}/analysis`,
            analysisData
        );
        return response.data;
    } catch (error) {
        console.error('Error updating analysis result:', error);
        throw error;
    }
};

/**
 * Delete a crop image
 */
export const deleteCropImage = async (imageId) => {
    try {
        const response = await apiConnector(
            'DELETE',
            `${FIREBASE_IMAGES_API}/image/${imageId}`
        );
        return response.data;
    } catch (error) {
        console.error('Error deleting crop image:', error);
        throw error;
    }
};

/**
 * Get statistics for farmer's images
 */
export const getImageStats = async (farmerId) => {
    try {
        const response = await apiConnector(
            'GET',
            `${FIREBASE_IMAGES_API}/farmer/${farmerId}/stats`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching image stats:', error);
        throw error;
    }
};

/**
 * Process and upload Firebase images to backend
 * This function takes Firebase data and uploads it to the backend
 */
export const migrateFirebaseImages = async (farmerId, firebaseData) => {
    try {
        const allImages = [];

        // Parse Firebase data structure
        Object.keys(firebaseData).forEach(testName => {
            const testData = firebaseData[testName];
            
            Object.keys(testData).forEach(imageKey => {
                const imageData = testData[imageKey];
                
                // Handle different data structures
                let base64Data = '';
                if (typeof imageData === 'object' && imageData !== null) {
                    base64Data = imageData.image || imageData.base64 || imageData.data || '';
                } else {
                    base64Data = imageData;
                }

                if (base64Data) {
                    allImages.push({
                        imageKey,
                        base64Data,
                        cropType: 'unknown'
                    });
                }
            });
        });

        // Bulk upload all images
        if (allImages.length > 0) {
            const firstTestName = Object.keys(firebaseData)[0];
            const result = await bulkUploadCropImages(farmerId, firstTestName, allImages);
            return result;
        }

        return { success: true, message: 'No images to migrate' };
    } catch (error) {
        console.error('Error migrating Firebase images:', error);
        throw error;
    }
};
