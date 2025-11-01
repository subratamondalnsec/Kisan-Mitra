import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Camera, Leaf, TrendingUp, Eye, CheckCircle } from "lucide-react";
import { useTranslation } from "../../../hooks/useTranslation";

const CropDiseaseDetectionCard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showOverlay, setShowOverlay] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleNavigate = () => {
    navigate("/crop-disease-detection");
  };

  const handleViewAllImages = () => {
    navigate("/crop-images-gallery");
  };

  const handleConnectDrone = () => {
    setIsConnecting(true);
    // After 5 seconds, hide the overlay and show the content
    setTimeout(() => {
      setShowOverlay(false);
      setIsConnecting(false);
    }, 5000);
  };

  return (
    <Card className="backdrop-blur-md border border-gray-600 relative">
      <CardHeader>
        <CardTitle className="text-gray-400 text-xl font-semibold flex items-center gap-2">
          <Leaf className="h-5 w-5 text-brand-teal" />
          {t('cropDiseaseDetection')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm">
          {/* Recent Images Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 font-medium">{t('recentCaptures') || 'Recent Captures'}</span>
              <Button 
                onClick={handleViewAllImages}
                variant="ghost" 
                size="sm" 
                className="text-xs text-brand-teal p-1 h-auto bg-brand-teal/20 backdrop-blur-md border-brand-teal/40"
              >
                <Eye className="h-3 w-3 mr-1" />
                {t('viewAll') || 'View All'}
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Card className="bg-gray-800/50 border-gray-600">
                <CardContent className="p-2">
                  <div className="aspect-square bg-gradient-to-br from-green-600/20 to-green-800/20 rounded flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="text-gray-400 text-xs mt-1 text-center">Wheat</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-600">
                <CardContent className="p-2">
                  <div className="aspect-square bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 rounded flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="text-gray-400 text-xs mt-1 text-center">Tomato</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-600">
                <CardContent className="p-2">
                  <div className="aspect-square bg-gradient-to-br from-orange-600/20 to-orange-800/20 rounded flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="text-gray-400 text-xs mt-1 text-center">Rice</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Crop Health Status */}
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-medium">{t('cropHealth') || 'Crop Health'}</span>
                </div>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/40">
                  {t('good')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Improvement Process */}
          <div className="border-t border-gray-600 pt-4">
            <div className="text-gray-400 mb-3 font-medium flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t('cropHealthEnhancementPlan') || 'Crop Health Enhancement Plan'}
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-xs font-bold">1</div>
                <div>
                  <div className="text-gray-300 text-sm font-medium mb-1">Pest & Disease Monitoring</div>
                  <div className="text-gray-400 text-xs">Conduct weekly visual inspections for early detection of pests, diseases, and nutrient deficiencies</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold">2</div>
                <div>
                  <div className="text-gray-300 text-sm font-medium mb-1">Irrigation Management</div>
                  <div className="text-gray-400 text-xs">Maintain consistent soil moisture levels with drip irrigation or scheduled watering based on crop growth stage</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-brand-teal/5 rounded-lg border border-brand-teal/20">
                <div className="flex-shrink-0 w-6 h-6 bg-brand-teal/20 rounded-full flex items-center justify-center text-brand-teal text-xs font-bold">3</div>
                <div>
                  <div className="text-gray-300 text-sm font-medium mb-1">Organic Nutrition Program</div>
                  <div className="text-gray-400 text-xs">Apply balanced organic fertilizers every 2-3 weeks and supplement with compost tea for enhanced nutrient uptake</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
                <div className="flex-shrink-0 w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-400 text-xs font-bold">4</div>
                <div>
                  <div className="text-gray-300 text-sm font-medium mb-1">Environmental Control</div>
                  <div className="text-gray-400 text-xs">Ensure proper air circulation, maintain optimal temperature ranges, and provide adequate sunlight exposure</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-xs font-bold">5</div>
                <div>
                  <div className="text-gray-300 text-sm font-medium mb-1">Preventive Care</div>
                  <div className="text-gray-400 text-xs">Implement crop rotation, companion planting, and regular pruning to maintain plant health and prevent disease spread</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-orange-500/5 rounded-lg border border-orange-500/20">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 text-xs font-bold">6</div>
                <div>
                  <div className="text-gray-300 text-sm font-medium mb-1">Regular Documentation</div>
                  <div className="text-gray-400 text-xs">Keep detailed records of growth patterns, treatments applied, and harvest yields for continuous improvement</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Drone Connection Overlay */}
      {showOverlay && (
        <div className="absolute inset-0 bg-[#010101]/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="text-center p-6">
            <div className="mb-4">
              <Camera className="h-12 w-12 text-brand-teal mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">
                Drone Connection Required
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Connect to drone hardware to capture and analyze crop images
              </p>
            </div>
            
            <Button
              onClick={handleConnectDrone}
              disabled={isConnecting}
              className="bg-brand-teal/20 backdrop-blur-md border border-brand-teal/40 hover:bg-brand-teal/30 text-gray-300 px-6 py-2"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-teal mr-2"></div>
                  Connecting...
                </>
              ) : (
                'Connect to Drone'
              )}
            </Button>
            
            {isConnecting && (
              <div className="mt-4 text-xs text-gray-500">
                Establishing drone connection... Please wait 5 seconds
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default CropDiseaseDetectionCard;
