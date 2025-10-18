import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import FarmerProfile from './pages/FarmerProfile';
import DealerProfile from './pages/DealerProfile';
import DealerDashboard from './pages/DealerDashboard';
import FarmerEmandi from './pages/FarmerEmandi';
import DealerLanguage from './pages/DealerLanguage';
import FarmerLanguage from './pages/FarmerLanguage';
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
        <Route path="/dealer/dashboard" element={<DealerDashboard />} />
        <Route path="/farmer/emandi" element={<FarmerEmandi />} />
        <Route path="/dealer/language" element={<DealerLanguage />} />
        <Route path="/farmer/language" element={<FarmerLanguage />} />
      </Routes>
    </div>
  );
}

export default App;
