import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FarmerNavbar from "../components/Common/FarmerNavbar";
import CropDiseaseCard from "../components/Core/cropDiseaseDetection/CropDiseaseCard";
import SoilHealthCard from "../components/Core/cropDiseaseDetection/SoilHealthCard";
import InfoSection from "../components/Core/cropDiseaseDetection/InfoSection";

const CropDiseaseDetection = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user || !token) {
      navigate("/auth");
    }
  }, [user, token, navigate]);

  if (!user || !token) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background dark">
      {/* Navbar */}
      <FarmerNavbar />

      {/* Main Content */}
      <div className="pt-8 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-golden mb-4">
              🌾 Crop Disease Detection & Soil Health
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive crop analysis with AI-powered disease detection and soil health assessment
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Crop Disease Detection */}
            <CropDiseaseCard />
            
            {/* Right Column - Soil Health Test */}
            <SoilHealthCard />
          </div>

          {/* Info Section */}
          <InfoSection />
        </div>
      </div>
    </div>
  );
};

export default CropDiseaseDetection;
