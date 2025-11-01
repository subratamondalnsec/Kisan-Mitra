import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Beaker, Droplets, BarChart3, TrendingUp, AlertTriangle } from "lucide-react";

const SoilHealthTestCard = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/soil-health-test");
  };

  return (
    <Card className="backdrop-blur-md border border-gray-600">
      <CardHeader>
        <CardTitle className="text-gray-400 text-xl font-semibold flex items-center gap-2">
          <Beaker className="h-5 w-5 text-brand-teal" />
          Soil Health Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm">
          {/* NPK Values Section */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-brand-teal/10 border-brand-teal/30">
              <CardContent className="p-3 text-center">
                <div className="text-brand-teal text-xs font-medium mb-1">Nitrogen (N)</div>
                <div className="text-foreground font-bold text-lg">45</div>
                <div className="text-gray-400 text-xs">mg/kg</div>
              </CardContent>
            </Card>
            <Card className="bg-orange-500/10 border-orange-500/30">
              <CardContent className="p-3 text-center">
                <div className="text-orange-400 text-xs font-medium mb-1">Phosphorus (P)</div>
                <div className="text-foreground font-bold text-lg">28</div>
                <div className="text-gray-400 text-xs">mg/kg</div>
              </CardContent>
            </Card>
            <Card className="bg-purple-500/10 border-purple-500/30">
              <CardContent className="p-3 text-center">
                <div className="text-purple-400 text-xs font-medium mb-1">Potassium (K)</div>
                <div className="text-foreground font-bold text-lg">62</div>
                <div className="text-gray-400 text-xs">mg/kg</div>
              </CardContent>
            </Card>
            <Card className="bg-purple-500/10 border-purple-500/30">
              <CardContent className="p-3 text-center">
                <div className="text-purple-400 text-xs font-medium mb-1">Humidity</div>
                <div className="text-foreground font-bold text-lg">62</div>
                <div className="text-gray-400 text-xs">mg/kg</div>
              </CardContent>
            </Card>
            <Card className="bg-orange-500/10 border-orange-500/30">
              <CardContent className="p-3 text-center">
                <div className="text-orange-400 text-xs font-medium mb-1">Temperature</div>
                <div className="text-foreground font-bold text-lg">28</div>
                <div className="text-gray-400 text-xs">mg/kg</div>
              </CardContent>
            </Card>
             <Card className="bg-brand-teal/10 border-brand-teal/30">
              <CardContent className="p-3 text-center">
                <div className="text-brand-teal text-xs font-medium mb-1">pH</div>
                <div className="text-foreground font-bold text-lg">45</div>
                <div className="text-gray-400 text-xs">mg/kg</div>
              </CardContent>
            </Card>
          </div>

          {/* Soil Quality Status */}
          <Card className="bg-yellow-500/10 border-yellow-500/30">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">Soil Quality</span>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/40">
                  Moderate
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Improvement Process */}
          <div className="border-t border-gray-600 pt-4">
            <div className="text-gray-400 mb-3 font-medium flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Soil Improvement Action Plan
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-brand-teal/5 rounded-lg border border-brand-teal/20">
                <div className="flex-shrink-0 w-6 h-6 bg-brand-teal/20 rounded-full flex items-center justify-center text-brand-teal text-xs font-bold">1</div>
                <div>
                  <div className="text-gray-300 text-sm font-medium mb-1">Nitrogen Enhancement</div>
                  <div className="text-gray-400 text-xs">Add 2-3 kg organic compost per square meter to boost nitrogen content and improve soil structure</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-orange-500/5 rounded-lg border border-orange-500/20">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 text-xs font-bold">2</div>
                <div>
                  <div className="text-gray-300 text-sm font-medium mb-1">Phosphorus Supplementation</div>
                  <div className="text-gray-400 text-xs">Apply bone meal or rock phosphate fertilizer 2 weeks before planting season for optimal root development</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-xs font-bold">3</div>
                <div>
                  <div className="text-gray-300 text-sm font-medium mb-1">Potassium Balance</div>
                  <div className="text-gray-400 text-xs">Maintain current potassium levels with wood ash or potassium sulfate as needed during growing season</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold">4</div>
                <div>
                  <div className="text-gray-300 text-sm font-medium mb-1">pH & Drainage Management</div>
                  <div className="text-gray-400 text-xs">Install proper drainage systems and add lime if pH drops below 6.0 to maintain optimal growing conditions</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-xs font-bold">5</div>
                <div>
                  <div className="text-gray-300 text-sm font-medium mb-1">Regular Monitoring</div>
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
