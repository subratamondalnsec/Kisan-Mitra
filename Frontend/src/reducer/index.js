import { combineReducers } from "@reduxjs/toolkit"
import authSlice from "../slices/authSlice"
import cropSlice from "../slices/cropSlice"
import languageSlice from "../slices/languageSlice"
import dealerSlice from "../slices/dealerSlice"


const rootReducer = combineReducers({
  // your reducers go here
     auth:authSlice,
     crop:cropSlice,
     language:languageSlice,
     dealer:dealerSlice,
});

export default rootReducer;