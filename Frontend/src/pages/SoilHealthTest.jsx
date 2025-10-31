import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  testSoilQuality,
  getSoilHealthHistory,
  deleteSoilHealthRecord,
} from "../services/operations/SoilHealthApi";
import SoilHealthForm from "../components/Core/SoilHealth/SoilHealthForm";
import SoilHealthResult from "../components/Core/SoilHealth/SoilHealthResult";
import SoilHealthHistory from "../components/Core/SoilHealth/SoilHealthHistory";
import FarmerNavbar from "../components/Common/FarmerNavbar";

const SoilHealthTest = () => {
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.auth);

  // Local state management
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("test"); // "test" or "history"

  useEffect(() => {
    // Redirect if not logged in
    if (!user || !token) {
      navigate("/auth");
      return;
    }

    // Fetch history on component mount or when switching to history tab
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [user, token, navigate, activeTab]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await getSoilHealthHistory(token);
      setHistory(response.data || []);
    } catch (error) {
      console.error("Failed to fetch history:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setAnalyzing(true);
      setError(null);
      const response = await testSoilQuality(formData, token);
      setCurrentResult(response.data);
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

  const handleNewTest = () => {
    setCurrentResult(null);
    setError(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "history") {
      fetchHistory();
    }
  };

  const handleDeleteRecord = async (soilHealthId) => {
    console.log("Deleting soil health record with ID:", soilHealthId);
    console.log("Using token:", token ? "Token available" : "No token");

    try {
      // Call API to delete from backend
      const result = await deleteSoilHealthRecord(soilHealthId, token);
      console.log("Delete result:", result);

      // Remove from local state immediately
      setHistory((prev) => prev.filter((record) => record._id !== soilHealthId));
    } catch (error) {
      console.error("Failed to delete record:", error);
      console.error("Error details:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <FarmerNavbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            🌱 Soil Health Test
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Analyze your soil quality with AI-powered assessment
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg shadow-md p-1">
            <button
              onClick={() => handleTabChange("test")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === "test"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              New Test
            </button>
            <button
              onClick={() => handleTabChange("history")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === "history"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Content Area */}
        <div className="max-w-6xl mx-auto">
          {activeTab === "test" ? (
            <>
              {!currentResult ? (
                <SoilHealthForm onSubmit={handleSubmit} analyzing={analyzing} />
              ) : (
                <SoilHealthResult result={currentResult} onNewTest={handleNewTest} />
              )}
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
              <SoilHealthHistory
                history={history}
                onDelete={handleDeleteRecord}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoilHealthTest;
