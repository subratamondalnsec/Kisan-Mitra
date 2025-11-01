import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  analyzeCropDisease, 
  getPredictionHistory,
  deleteCropDiseasePrediction
} from "../../../services/operations/CropDiseasesApi";
import ImageUploader from "../CropDiseaseDetection/ImageUploader";
import PredictionResults from "../CropDiseaseDetection/PredictionResults";
import PredictionHistory from "../CropDiseaseDetection/PredictionHistory";
import LoadingSpinner from "../../Common/LoadingSpinner";

const CropDiseaseCard = () => {
  const { user, token } = useSelector((state) => state.auth);
  
  // Local state management
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("detect"); // "detect" or "history"

  useEffect(() => {
    // Fetch prediction history on component mount
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab]);

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

  const handleDeletePrediction = async (diseaseId) => {
    try {
      await deleteCropDiseasePrediction(diseaseId, token);
      setPredictionHistory(prev => prev.filter(pred => pred._id !== diseaseId));
    } catch (error) {
      console.error("Failed to delete prediction:", error);
      setError("Failed to delete prediction. Please try again.");
      fetchHistory();
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-golden flex items-center gap-2">
          🌾 Crop Disease Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="detect" variant="mode">
              🔍 Detect Disease
            </TabsTrigger>
            <TabsTrigger value="history" variant="mode">
              📜 History
            </TabsTrigger>
          </TabsList>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          <TabsContent value="detect" className="mt-0">
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
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <PredictionHistory 
                history={predictionHistory}
                loading={loading}
                onDelete={handleDeletePrediction}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CropDiseaseCard;
