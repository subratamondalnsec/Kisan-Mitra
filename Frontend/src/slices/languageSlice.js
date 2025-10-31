import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_LANGUAGE } from '../constants/languageOptions';

// Helper function to get language from localStorage
const getLanguageFromStorage = () => {
  try {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    return savedLanguage || DEFAULT_LANGUAGE;
  } catch (error) {
    return DEFAULT_LANGUAGE;
  }
};

const initialState = {
  preferredLanguage: getLanguageFromStorage(),
  selectedLanguage: getLanguageFromStorage(), // Alias for AI Assistant compatibility
  loading: false,
  error: null
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setPreferredLanguage: (state, action) => {
      state.preferredLanguage = action.payload;
      state.selectedLanguage = action.payload; // Keep both in sync
      state.error = null;
      // Persist to localStorage
      try {
        localStorage.setItem('preferredLanguage', action.payload);
      } catch (error) {
        console.error('Failed to save language to localStorage:', error);
      }
    },
    // Alias for AI Assistant compatibility
    setLanguage: (state, action) => {
      state.preferredLanguage = action.payload;
      state.selectedLanguage = action.payload;
      state.error = null;
      try {
        localStorage.setItem('preferredLanguage', action.payload);
      } catch (error) {
        console.error('Failed to save language to localStorage:', error);
      }
    },
    setLanguageLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLanguageError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearLanguageError: (state) => {
      state.error = null;
    },
    resetLanguageState: (state) => {
      state.preferredLanguage = DEFAULT_LANGUAGE;
      state.selectedLanguage = DEFAULT_LANGUAGE;
      state.loading = false;
      state.error = null;
      // Clear from localStorage
      try {
        localStorage.removeItem('preferredLanguage');
      } catch (error) {
        console.error('Failed to clear language from localStorage:', error);
      }
    }
  }
});

export const {
  setPreferredLanguage,
  setLanguage, // Alias for AI Assistant
  setLanguageLoading,
  setLanguageError,
  clearLanguageError,
  resetLanguageState
} = languageSlice.actions;

export default languageSlice.reducer;