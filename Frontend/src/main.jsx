import React from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import rootReducer from "./reducer/index.js";
import { configureStore } from '@reduxjs/toolkit';
import { Toaster } from "react-hot-toast";

const store=configureStore({
  reducer: rootReducer,
});

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster position="top-right"
          toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed88',
            },
          },
        }}/>
      </BrowserRouter>
    </Provider>
  // </StrictMode>, 
)
