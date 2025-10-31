import { createSlice } from "@reduxjs/toolkit";

// Helper function to get token from localStorage with expiration check
const getTokenFromStorage = () => {
  try {
    const tokenData = localStorage.getItem("tokenData");
    if (!tokenData) return null;
    
    const { token, expiresAt } = JSON.parse(tokenData);
    
    // Check if token has expired
    if (new Date().getTime() > expiresAt) {
      localStorage.removeItem("tokenData");
      localStorage.removeItem("token"); // Remove old token if exists
      return null;
    }
    
    return token;
  } catch (error) {
    // Fallback for old token format (just string)
    const oldToken = localStorage.getItem("token");
    if (oldToken) {
      // Migrate to new format - assume it expires in 7 days from now
      const expiresAt = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
      const tokenData = { token: oldToken, expiresAt };
      localStorage.setItem("tokenData", JSON.stringify(tokenData));
      localStorage.removeItem("token"); // Remove old format
      return oldToken;
    }
    return null;
  }
};

// Helper function to get user from localStorage
const getUserFromStorage = () => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    return null;
  }
};

const initialState = {
  loading: false,
  token: getTokenFromStorage(),
  user: getUserFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setUser(state, value) {
      state.user = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
      
      if (value.payload) {
        // Set token with 7 days expiration
        const expiresAt = new Date().getTime() + (7 * 24 * 60 * 60 * 1000); // 7 days from now
        const tokenData = {
          token: value.payload,
          expiresAt: expiresAt
        };
        localStorage.setItem("tokenData", JSON.stringify(tokenData));
      } else {
        // Remove token data when logging out
        localStorage.removeItem("tokenData");
        localStorage.removeItem("token"); // Remove old format if exists
      }
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("tokenData");
      localStorage.removeItem("token"); // Remove old format if exists
      localStorage.removeItem("user");
    },
  },
});

export const { setLoading, setToken, setUser, logout } = authSlice.actions;

export default authSlice.reducer;
