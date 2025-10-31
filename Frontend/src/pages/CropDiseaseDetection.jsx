import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  analyzeCropDisease, 
  getPredictionHistory,
  deleteCropDiseasePrediction
} from "../services/operations/CropDiseasesApi";
import ImageUploader from "../components/Core/CropDiseaseDetection/ImageUploader";
import PredictionResults from "../components/Core/CropDiseaseDetection/PredictionResults";
import PredictionHistory from "../components/Core/CropDiseaseDetection/PredictionHistory";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import FarmerNavbar from "../components/Common/FarmerNavbar";

const CropDiseaseDetection = () => {
  const navigate = useNavigate();
  
  const { user, token } = useSelector((state) => state.auth);
  
  // Local state management
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("detect"); // "detect" or "history"

  useEffect(() => {
    // Redirect if not logged in
    if (!user || !token) {
      navigate("/auth");
      return;
    }

    // Fetch prediction history on component mount
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [user, token, navigate, activeTab]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await getPredictionHistory(token);
      setPredictionHistory(response.data || []);
    } catch (error) {
      console.error("Failed to fetch history:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (imageFile, cropType) => {
    try {
      setAnalyzing(true);
      setError(null);
      const response = await analyzeCropDisease(imageFile, cropType, token);
      setCurrentPrediction(response.data);
      // Refresh history if on history tab
      if (activeTab === "history") {
        fetchHistory();
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      setError(error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setCurrentPrediction(null);
    setError(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "history") {
      fetchHistory();
    }
  };

  const handleDeletePrediction = async (diseaseId) => {
    console.log("Deleting prediction with ID:", diseaseId);
    console.log("Using token:", token ? "Token available" : "No token");
    
    try {
      // Call API to delete from backend
      const result = await deleteCropDiseasePrediction(diseaseId, token);
      console.log("Delete result:", result);
      
      // Remove from local state immediately
      setPredictionHistory(prev => prev.filter(pred => pred._id !== diseaseId));
      
      // Optional: Refresh to sync with backend
      // fetchHistory();
    } catch (error) {
      console.error("Failed to delete prediction:", error);
      console.error("Error details:", error.response?.data || error.message);
      setError("Failed to delete prediction. Please try again.");
      // Refresh to restore correct state
      fetchHistory();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50 pb-12">

      {/* Navbar */}
      <FarmerNavbar />

      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="text-center mb-8 mt-2">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            🌾 Crop Disease Detection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload an image of your crop to detect diseases using AI-powered analysis
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => handleTabChange("detect")}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === "detect"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🔍 Detect Disease
            </button>
            <button
              onClick={() => handleTabChange("history")}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === "history"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📜 History
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === "detect" ? (
          <div className="max-w-4xl mx-auto">
            {!currentPrediction ? (
              <ImageUploader 
                onAnalyze={handleAnalyze} 
                analyzing={analyzing}
              />
            ) : (
              <PredictionResults 
                prediction={currentPrediction}
                onNewAnalysis={handleNewAnalysis}
              />
            )}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner />
              </div>
            ) : (
              <PredictionHistory 
                history={predictionHistory}
                loading={loading}
                onDelete={handleDeletePrediction}
              />
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              ℹ️ How it works
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">📸</div>
                <h4 className="font-semibold text-gray-900 mb-2">Upload Image</h4>
                <p className="text-sm text-gray-600">
                  Take or upload a clear photo of your crop
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🤖</div>
                <h4 className="font-semibold text-gray-900 mb-2">AI Analysis</h4>
                <p className="text-sm text-gray-600">
                  Our AI model analyzes the image for diseases
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <h4 className="font-semibold text-gray-900 mb-2">Get Results</h4>
                <p className="text-sm text-gray-600">
                  Receive instant diagnosis and recommendations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDiseaseDetection;
