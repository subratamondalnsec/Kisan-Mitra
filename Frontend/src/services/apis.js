const BASE_URL = import.meta.env.VITE_BASE_URL;

export const FarmerAuthAPI = {
    SIGNUP_API: BASE_URL + "farmer/signup",
    LOGIN_API: BASE_URL + "farmer/login",
    GET_PROFILE_API: BASE_URL + "farmer/profile",
    UPDATE_PROFILE_API: BASE_URL + "farmer/profile",
}

export const DealerAuthAPI = {
    SIGNUP_API: BASE_URL + "dealer/signup",
    LOGIN_API: BASE_URL + "dealer/login",
    GET_PROFILE_API: BASE_URL + "dealer/profile",
    UPDATE_PROFILE_API: BASE_URL + "dealer/profile",
}