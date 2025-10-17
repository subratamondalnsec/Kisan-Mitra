import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import FarmerProfile from './pages/FarmerProfile';
import DealerProfile from './pages/DealerProfile';
import Home from './components/Core/Home';
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/farmer/profile" element={<FarmerProfile />} />
        <Route path="/dealer/profile" element={<DealerProfile />} />
      </Routes>
    </div>
  );
}

export default App;
