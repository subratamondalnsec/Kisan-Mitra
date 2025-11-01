import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  testSoilQuality,
  getSoilHealthHistory,
  deleteSoilHealthRecord,
} from "../../../services/operations/SoilHealthApi";
import SoilHealthForm from "../SoilHealth/SoilHealthForm";
import SoilHealthResult from "../SoilHealth/SoilHealthResult";
import SoilHealthHistory from "../SoilHealth/SoilHealthHistory";

const SoilHealthCard = () => {
  const { user, token } = useSelector((state) => state.auth);
  
  // Local state management
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("test"); // "test" or "history"

  useEffect(() => {
    // Fetch history on component mount or when switching to history tab
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab]);

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

  const handleDeleteRecord = async (soilHealthId) => {
    try {
      await deleteSoilHealthRecord(soilHealthId, token);
      setHistory((prev) => prev.filter((record) => record._id !== soilHealthId));
    } catch (error) {
      console.error("Failed to delete record:", error);
      setError("Failed to delete record. Please try again.");
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-golden flex items-center gap-2">
          🌱 Soil Health Test
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="test" variant="mode">
              New Test
            </TabsTrigger>
            <TabsTrigger value="history" variant="mode">
              History
            </TabsTrigger>
          </TabsList>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          <TabsContent value="test" className="mt-0">
            {!currentResult ? (
              <SoilHealthForm onSubmit={handleSubmit} analyzing={analyzing} />
            ) : (
              <SoilHealthResult result={currentResult} onNewTest={handleNewTest} />
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <SoilHealthHistory
              history={history}
              onDelete={handleDeleteRecord}
              loading={loading}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SoilHealthCard;
