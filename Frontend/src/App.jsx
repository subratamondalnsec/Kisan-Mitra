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
import DealerReviewsPage from './pages/DealerReviewsPage';
import DealerMyReviewsPage from './pages/DealerMyReviewsPage';
import CropDiseaseDetection from './pages/CropDiseaseDetection';
import SoilHealthTest from './pages/SoilHealthTest';
import "./App.css";
import AgentDashboard from './pages/AgentDashboard';
import FarmerDashboard from './pages/FarmerDashboard';
import InstantLoan from './pages/InstantLoan';
import InstallPWA from './components/InstallPWA';
import OfflineIndicator from './components/OfflineIndicator';
import LiveData from "./components/LiveData";

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
        <Route path="/farmer/:dealerId/reviews" element={<DealerReviewsPage />} />
        <Route path="/dealer/my-reviews" element={<DealerMyReviewsPage />} />
        <Route path="/farmer/crop-analysis" element={<CropDiseaseDetection />} />
        <Route path="/farmer/soil-health" element={<SoilHealthTest />} />
        <Route path="/agent/dashboard" element={<AgentDashboard/>} />
        <Route path="/farmer/dashboard" element={<FarmerDashboard/>} />
        <Route path="/farmer/loan" element={<InstantLoan/>} />
        <Route path="/live-data" element={<LiveData/>} />
      </Routes>
      
      {/* PWA Components */}
      <InstallPWA />
      <OfflineIndicator />
    </div>
  );
}

export default App;
