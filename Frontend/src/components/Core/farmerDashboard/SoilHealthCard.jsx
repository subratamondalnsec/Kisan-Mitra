import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Beaker, Droplets, BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { db } from "../../../firebase";
import { useTranslation } from "../../../hooks/useTranslation";

const SoilHealthTestCard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [firebaseData, setFirebaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const PATH = "farmData/latest";

  // Firebase real-time data subscription
  useEffect(() => {
    console.log("[SoilHealthCard] Setting up Firebase listener");
    const dataRef = ref(db, PATH);
    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        const exists = snapshot.exists();
        const data = snapshot.val();
        console.log("[SoilHealthCard] Firebase data:", data);
        if (exists) {
          setFirebaseData(data);
        } else {
          setFirebaseData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("[SoilHealthCard] Firebase error:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe && unsubscribe();
  }, []);

  // Use Firebase data if available, otherwise fallback to default values
  const sensorData = firebaseData || {
    N: 45,
    P: 28,
    K: 62,
    humidity: 62,
    temperature: 28,
    pH: 7.1
  };

  // Calculate soil quality based on NPK values
  const calculateSoilQuality = () => {
    if (!firebaseData) return { level: t("unknown"), color: "gray" };
    
    const avgNPK = (sensorData.N + sensorData.P + sensorData.K) / 3;
    if (avgNPK >= 50) return { level: t("excellent"), color: "green" };
    if (avgNPK >= 35) return { level: t("good"), color: "blue" };
    if (avgNPK >= 25) return { level: t("moderate"), color: "yellow" };
    return { level: t("poor"), color: "red" };
  };

  const soilQuality = calculateSoilQuality();

  const handleNavigate = () => {
    navigate("/soil-health-test");
  };

  return (
    <Card className="backdrop-blur-md border border-gray-600">
      <CardHeader>
        <CardTitle className="text-gray-400 text-xl font-semibold flex items-center gap-2">
          <Beaker className="h-5 w-5 text-brand-teal" />
          {t('soilHealthTest')}
          {firebaseData && (
            <div className="flex items-center gap-1 ml-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Live</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm">
          {/* NPK Values Section */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-brand-teal/10 border-brand-teal/30">
              <CardContent className="p-3 text-center">
                <div className="text-brand-teal text-xs font-medium mb-1 flex items-center justify-center gap-1">
                  {t('nitrogen')}
                  {loading && <div className="w-2 h-2 bg-brand-teal rounded-full animate-pulse"></div>}
                </div>
                <div className="text-foreground font-bold text-lg">{sensorData.N}</div>
                <div className="text-gray-400 text-xs">mg/kg</div>
              </CardContent>
            </Card>
            <Card className="bg-orange-500/10 border-orange-500/30">
              <CardContent className="p-3 text-center">
                <div className="text-orange-400 text-xs font-medium mb-1 flex items-center justify-center gap-1">
                  {t('phosphorus')}
                  {loading && <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>}
                </div>
                <div className="text-foreground font-bold text-lg">{sensorData.P}</div>
                <div className="text-gray-400 text-xs">mg/kg</div>
              </CardContent>
            </Card>
            <Card className="bg-purple-500/10 border-purple-500/30">
              <CardContent className="p-3 text-center">
                <div className="text-purple-400 text-xs font-medium mb-1 flex items-center justify-center gap-1">
                  {t('potassium')}
                  {loading && <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>}
                </div>
                <div className="text-foreground font-bold text-lg">{sensorData.K}</div>
                <div className="text-gray-400 text-xs">mg/kg</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-500/10 border-blue-500/30">
              <CardContent className="p-3 text-center">
                <div className="text-blue-400 text-xs font-medium mb-1 flex items-center justify-center gap-1">
                  {t('humidity')}
                  {loading && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>}
                </div>
                <div className="text-foreground font-bold text-lg">{sensorData.humidity}</div>
                <div className="text-gray-400 text-xs">%</div>
              </CardContent>
            </Card>
            <Card className="bg-orange-500/10 border-orange-500/30">
              <CardContent className="p-3 text-center">
                <div className="text-orange-400 text-xs font-medium mb-1 flex items-center justify-center gap-1">
                  {t('temperature')}
                  {loading && <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>}
                </div>
                <div className="text-foreground font-bold text-lg">{sensorData.temperature}</div>
                <div className="text-gray-400 text-xs">°C</div>
              </CardContent>
            </Card>
             <Card className="bg-brand-teal/10 border-brand-teal/30">
              <CardContent className="p-3 text-center">
                <div className="text-brand-teal text-xs font-medium mb-1 flex items-center justify-center gap-1">
                  {t('phLevel')}
                  {loading && <div className="w-2 h-2 bg-brand-teal rounded-full animate-pulse"></div>}
                </div>
                <div className="text-foreground font-bold text-lg">{sensorData.pH}</div>
                <div className="text-gray-400 text-xs">pH</div>
              </CardContent>
            </Card>
          </div>

          {/* Soil Quality Status */}
          <Card className={`bg-${soilQuality.color}-500/10 border-${soilQuality.color}-500/30`}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 text-${soilQuality.color}-400`} />
                  <span className={`text-${soilQuality.color}-400 font-medium`}>{t('soilQuality')}</span>
                  {firebaseData && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400">Live</span>
                    </div>
                  )}
                </div>
                <Badge className={`bg-${soilQuality.color}-500/20 text-${soilQuality.color}-300 border-${soilQuality.color}-500/40`}>
                  {soilQuality.level}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Improvement Process */}
          <div className="border-t border-gray-600 pt-4">
            <div className="text-gray-400 mb-3 font-medium flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t('soilImprovementActionPlan')}
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-brand-teal/5 rounded-lg border border-brand-teal/20">
                <div className="flex-shrink-0 w-6 h-6 bg-brand-teal/20 rounded-full flex items-center justify-center text-brand-teal text-xs font-bold">1</div>
                <div>
                  <div className="text-gray-300 text-sm font-medium mb-1">{t('nitrogenEnhancement')}</div>
                  <div className="text-gray-400 text-xs">Add 2-3 kg organic compost per square meter to boost nitrogen content and improve soil structure</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-orange-500/5 rounded-lg border border-orange-500/20">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 text-xs font-bold">2</div>
                <div>
                  <div className="text-gray-300 text-sm font-medium mb-1">{t('phosphorusSupplementation')}</div>
                  <div className="text-gray-400 text-xs">Apply bone meal or rock phosphate fertilizer 2 weeks before planting season for optimal root development</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-xs font-bold">3</div>
                <div>
                  <div className="text-gray-300 text-sm font-medium mb-1">{t('potassiumBalance')}</div>
                  <div className="text-gray-400 text-xs">Maintain current potassium levels with wood ash or potassium sulfate as needed during growing season</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold">4</div>
                <div>
                  <div className="text-gray-300 text-sm font-medium mb-1">{t('phDrainageManagement')}</div>
                  <div className="text-gray-400 text-xs">Install proper drainage systems and add lime if pH drops below 6.0 to maintain optimal growing conditions</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-xs font-bold">5</div>
                <div>
                  <div className="text-gray-300 text-sm font-medium mb-1">{t('regularMonitoring')}</div>
                  <div className="text-gray-400 text-xs">Test soil every 3 months and adjust fertilization based on crop requirements and seasonal changes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoilHealthTestCard;
