import { toast } from "react-hot-toast";
import { setLoading, setToken, setUser } from "../../slices/authSlice";
import { apiConnector } from "../apiconnector";
import { DealerAuthAPI } from "../apis";

// Dealer Signup
export function dealerSignup(
  FullName,
  lastName,
  email,
  password,
  contactNumber,
  whatsappNumber,
  businessAddress,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Creating dealer account...");
    dispatch(setLoading(true));
    
    try {
      const response = await apiConnector("POST", DealerAuthAPI.SIGNUP_API, {
        FullName,
        lastName,
        email,
        password,
        contactNumber,
        whatsappNumber,
        businessAddress,
      });

      console.log("DEALER SIGNUP API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Dealer account created successfully");
      
      // Set token and user data
      dispatch(setToken(response.data.token));
      
      // Use image from response or fallback to generated one
      const userImage = response.data?.user?.image || 
        `https://api.dicebear.com/5.x/initials/svg?seed=${FullName}%20${lastName}`;
      
      const userData = { 
        ...response.data.user,
        image: userImage,
        role: 'dealer'
      };
      
      dispatch(setUser(userData));
      
      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Navigate to dealer profile (dashboard doesn't exist yet)
      navigate("/dealer/profile");
      
    } catch (error) {
      console.log("DEALER SIGNUP API ERROR............", error);
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    }
    
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// Dealer Login
export function dealerLogin(
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

      const response = await apiConnector("POST", DealerAuthAPI.LOGIN_API, loginData);

      console.log("DEALER LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login successful");
      
      // Set token and user data
      dispatch(setToken(response.data.token));
      
      // Use image from response or fallback to generated one
      const userImage = response.data?.user?.image || 
        `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.FullName}%20${response.data.user.lastName}`;
      
      const userData = { 
        ...response.data.user,
        image: userImage,
        role: 'dealer'
      };
      
      dispatch(setUser(userData));
      
      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Navigate to dealer profile (dashboard doesn't exist yet)
      navigate("/dealer/profile");
      
    } catch (error) {
      console.log("DEALER LOGIN API ERROR............", error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    }
    
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// Get Dealer Profile
export function getDealerProfile(token) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading profile...");
    dispatch(setLoading(true));
    
    try {
      const response = await apiConnector(
        "GET", 
        DealerAuthAPI.GET_PROFILE_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log("GET DEALER PROFILE API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const userData = { 
        ...response.data.data.dealer, 
        role: 'dealer'
      };
      
      dispatch(setUser(userData));
      localStorage.setItem("user", JSON.stringify(userData));
      
    } catch (error) {
      console.log("GET DEALER PROFILE API ERROR............", error);
      toast.error(error.response?.data?.message || "Failed to load profile");
    }
    
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// Update Dealer Profile
export function updateDealerProfile(profileData, token) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating profile...");
    dispatch(setLoading(true));
    
    try {
      const response = await apiConnector(
        "PUT", 
        DealerAuthAPI.UPDATE_PROFILE_API,
        profileData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log("UPDATE DEALER PROFILE API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Profile updated successfully");
      
      const userData = { 
        ...response.data.data.dealer, 
        role: 'dealer'
      };
      
      dispatch(setUser(userData));
      localStorage.setItem("user", JSON.stringify(userData));
      
    } catch (error) {
      console.log("UPDATE DEALER PROFILE API ERROR............", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
    
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}
