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
  loading: false,
  error: null
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setPreferredLanguage: (state, action) => {
      state.preferredLanguage = action.payload;
      state.error = null;
      // Persist to localStorage
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
  setLanguageLoading,
  setLanguageError,
  clearLanguageError,
  resetLanguageState
} = languageSlice.actions;

export default languageSlice.reducer;