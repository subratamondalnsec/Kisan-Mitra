import { combineReducers } from "@reduxjs/toolkit"
import authSlice from "../slices/authSlice"
import cropSlice from "../slices/cropSlice"


const rootReducer = combineReducers({
  // your reducers go here
     auth:authSlice,
     crop:cropSlice,
});

export default rootReducer;