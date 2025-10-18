import { toast } from 'react-hot-toast';
import { apiConnector } from '../apiconnector';
import { DealerAuthAPI, FarmerAuthAPI } from '../apis';
import { setPreferredLanguage, setLanguageLoading, setLanguageError, clearLanguageError } from '../../slices/languageSlice';

// Update dealer preferred language
export const updateDealerLanguage = (preferredLanguage, token) => {
  return async (dispatch) => {
    const toastId = toast.loading('Updating language...');
    dispatch(setLanguageLoading(true));

    try {
      const response = await apiConnector('PUT', DealerAuthAPI.UPDATE_LANGUAGE_API, {
        preferredLanguage
      }, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });

      console.log('UPDATE_DEALER_LANGUAGE API RESPONSE:', response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Update Redux state with the new language
      dispatch(setPreferredLanguage(preferredLanguage));
      toast.success(`Language updated to ${preferredLanguage} successfully`);

      return response.data;
    } catch (error) {
      console.log('UPDATE_DEALER_LANGUAGE API ERROR:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to update language';
      dispatch(setLanguageError(errorMessage));
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLanguageLoading(false));
      toast.dismiss(toastId);
    }
  };
};

// Update farmer preferred language
export const updateFarmerLanguage = (preferredLanguage, token) => {
  return async (dispatch) => {
    const toastId = toast.loading('Updating language...');
    dispatch(setLanguageLoading(true));

    try {
      const response = await apiConnector('PUT', FarmerAuthAPI.UPDATE_LANGUAGE_API, {
        preferredLanguage
      }, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });

      console.log('UPDATE_FARMER_LANGUAGE API RESPONSE:', response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Update Redux state with the new language
      dispatch(setPreferredLanguage(preferredLanguage));
      toast.success(`Language updated to ${preferredLanguage} successfully`);

      return response.data;
    } catch (error) {
      console.log('UPDATE_FARMER_LANGUAGE API ERROR:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to update language';
      dispatch(setLanguageError(errorMessage));
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLanguageLoading(false));
      toast.dismiss(toastId);
    }
  };
};

// Get dealer preferred language
export const getDealerLanguage = (token) => {
  return async (dispatch) => {
    dispatch(setLanguageLoading(true));
    dispatch(clearLanguageError()); // Clear any previous errors

    try {
      const response = await apiConnector('GET', DealerAuthAPI.GET_LANGUAGE_API, null, {
        Authorization: `Bearer ${token}`,
      });

      console.log('GET_DEALER_LANGUAGE API RESPONSE:', response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Extract language from response and update Redux state
      const language = response.data.data.preferredLanguage || 'English';
      dispatch(setPreferredLanguage(language));
      
      return response.data;

    } catch (error) {
      console.log('GET_DEALER_LANGUAGE API ERROR:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to get language preference';
      dispatch(setLanguageError(errorMessage));
      // Don't show toast for GET operations to avoid spam
      throw error;
    } finally {
      dispatch(setLanguageLoading(false));
    }
  };
};

// Get farmer preferred language
export const getFarmerLanguage = (token) => {
  return async (dispatch) => {
    dispatch(setLanguageLoading(true));
    dispatch(clearLanguageError()); // Clear any previous errors

    try {
      const response = await apiConnector('GET', FarmerAuthAPI.GET_LANGUAGE_API, null, {
        Authorization: `Bearer ${token}`,
      });

      console.log('GET_FARMER_LANGUAGE API RESPONSE:', response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Extract language from response and update Redux state
      const language = response.data.data.preferredLanguage || 'English';
      dispatch(setPreferredLanguage(language));
      
      return response.data;

    } catch (error) {
      console.log('GET_FARMER_LANGUAGE API ERROR:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to get language preference';
      dispatch(setLanguageError(errorMessage));
      // Don't show toast for GET operations to avoid spam
      throw error;
    } finally {
      dispatch(setLanguageLoading(false));
    }
  };
};