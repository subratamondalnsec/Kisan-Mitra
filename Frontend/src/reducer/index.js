import { combineReducers } from "@reduxjs/toolkit"
import authSlice from "../slices/authSlice"


const rootReducer = combineReducers({
  // your reducers go here
     auth:authSlice,
});

export default rootReducer;