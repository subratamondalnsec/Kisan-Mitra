import { toast } from "react-hot-toast";
import { setLoading, setToken, setUser } from "../../slices/authSlice";
import { apiConnector } from "../apiconnector";
import { FarmerAuthAPI } from "../apis";

// Farmer Signup
export function farmerSignup(
  firstName,
  lastName,
  email,
  password,
  contactNumber,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Creating account...");
    dispatch(setLoading(true));
    
    try {
      const response = await apiConnector("POST", FarmerAuthAPI.SIGNUP_API, {
        firstName,
        lastName,
        email,
        password,
        contactNumber,
      });

      console.log("FARMER SIGNUP API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Farmer account created successfully");
      
      // Set token and user data
      dispatch(setToken(response.data.token));
      
      const userImage = response.data?.user?.image || 
        `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`;
      
      const userData = { 
        ...response.data.user,
        image: userImage,
        role: 'farmer'
      };
      
      dispatch(setUser(userData));
      
      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Navigate to farmer profile (dashboard doesn't exist yet)
      navigate("/farmer/profile");
      
    } catch (error) {
      console.log("FARMER SIGNUP API ERROR............", error);
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    }
    
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// Farmer Login
export function farmerLogin(
  emailOrContact,
  password,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Logging in...");
    dispatch(setLoading(true));
    
    try {
      const loginData = { password };
      
      // Determine if it's email or contact number
      const isEmail = emailOrContact.includes('@');
      if (isEmail) {
        loginData.email = emailOrContact;
      } else {
        loginData.contactNumber = emailOrContact;
      }

      const response = await apiConnector("POST", FarmerAuthAPI.LOGIN_API, loginData);

      console.log("FARMER LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login successful");
      
      // Set token and user data
      dispatch(setToken(response.data.token));
      
      const userImage = response.data?.user?.image || 
        `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName}%20${response.data.user.lastName}`;
      
      const userData = { 
        ...response.data.user,
        image: userImage,
        role: 'farmer'
      };
      
      dispatch(setUser(userData));
      
      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Navigate to farmer profile (dashboard doesn't exist yet)
      navigate("/farmer/profile");
      
    } catch (error) {
      console.log("FARMER LOGIN API ERROR............", error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    }
    
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// Get Farmer Profile
export function getFarmerProfile(token) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading profile...");
    dispatch(setLoading(true));
    
    try {
      const response = await apiConnector(
        "GET", 
        FarmerAuthAPI.GET_PROFILE_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log("GET FARMER PROFILE API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const userData = { 
        ...response.data.data.farmer, 
        role: 'farmer'
      };
      
      dispatch(setUser(userData));
      localStorage.setItem("user", JSON.stringify(userData));
      
    } catch (error) {
      console.log("GET FARMER PROFILE API ERROR............", error);
      toast.error(error.response?.data?.message || "Failed to load profile");
    }
    
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// Update Farmer Profile
export function updateFarmerProfile(profileData, token) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating profile...");
    dispatch(setLoading(true));
    
    try {
      const response = await apiConnector(
        "PUT", 
        FarmerAuthAPI.UPDATE_PROFILE_API,
        profileData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log("UPDATE FARMER PROFILE API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Profile updated successfully");
      
      const userData = { 
        ...response.data.data.farmer, 
        role: 'farmer'
      };
      
      dispatch(setUser(userData));
      localStorage.setItem("user", JSON.stringify(userData));
      
    } catch (error) {
      console.log("UPDATE FARMER PROFILE API ERROR............", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
    
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}
