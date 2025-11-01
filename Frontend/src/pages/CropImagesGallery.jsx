import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FarmerNavbar from "../components/Common/FarmerNavbar";
import { ArrowLeft, Calendar, Leaf, Camera, Eye, Download } from "lucide-react";

const CropImagesGallery = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(null);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user || !token) {
      navigate("/auth");
    }
  }, [user, token, navigate]);

  if (!user || !token) {
    return null;
  }

  // Sample crop images data
  const cropImages = [
    {
      id: 1,
      cropType: "Wheat",
      captureDate: "2025-10-28",
      status: "Healthy",
      statusColor: "green",
      image: "/api/placeholder/300/300",
      analysis: "No diseases detected. Good growth pattern observed.",
      recommendations: ["Continue current watering schedule", "Monitor for pest activity"]
    },
    {
      id: 2,
      cropType: "Tomato",
      captureDate: "2025-10-27",
      status: "Moderate",
      statusColor: "yellow",
      image: "/api/placeholder/300/300",
      analysis: "Early signs of leaf spot detected. Requires attention.",
      recommendations: ["Apply fungicide treatment", "Improve air circulation", "Reduce watering frequency"]
    },
    {
      id: 3,
      cropType: "Rice",
      captureDate: "2025-10-26",
      status: "Good",
      statusColor: "green",
      image: "/api/placeholder/300/300",
      analysis: "Healthy rice plants with optimal growth rate.",
      recommendations: ["Maintain current fertilizer schedule", "Monitor water levels"]
    },
    {
      id: 4,
      cropType: "Potato",
      captureDate: "2025-10-25",
      status: "Poor",
      statusColor: "red",
      image: "/api/placeholder/300/300",
      analysis: "Blight infection detected. Immediate treatment required.",
      recommendations: ["Apply copper-based fungicide", "Remove infected plants", "Improve drainage"]
    },
    {
      id: 5,
      cropType: "Maize",
      captureDate: "2025-10-24",
      status: "Healthy",
      statusColor: "green",
      image: "/api/placeholder/300/300",
      analysis: "Excellent growth with no visible diseases or pests.",
      recommendations: ["Continue current care routine", "Prepare for harvest in 2 weeks"]
    },
    {
      id: 6,
      cropType: "Onion",
      captureDate: "2025-10-23",
      status: "Moderate",
      statusColor: "yellow",
      image: "/api/placeholder/300/300",
      analysis: "Slight nutrient deficiency observed in lower leaves.",
      recommendations: ["Apply nitrogen-rich fertilizer", "Increase watering frequency"]
    }
  ];

  const getStatusBadgeClass = (color) => {
    switch (color) {
      case 'green':
        return 'bg-green-500/20 text-green-300 border-green-500/40';
      case 'yellow':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'red':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Navbar */}
      <FarmerNavbar />

      {/* Main Content */}
      <div className="pt-8 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate("/farmer-dashboard")}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-golden mb-2">
                📸 Crop Images Gallery
              </h1>
              <p className="text-lg text-gray-400">
                View and analyze your captured crop images with AI-powered insights
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="backdrop-blur-md border border-gray-600">
              <CardContent className="p-4 text-center">
                <Camera className="h-8 w-8 text-brand-teal mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{cropImages.length}</div>
                <div className="text-gray-400 text-sm">Total Images</div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-md border border-gray-600">
              <CardContent className="p-4 text-center">
                <Leaf className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {cropImages.filter(img => img.statusColor === 'green').length}
                </div>
                <div className="text-gray-400 text-sm">Healthy Crops</div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-md border border-gray-600">
              <CardContent className="p-4 text-center">
                <Eye className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {cropImages.filter(img => img.statusColor === 'yellow').length}
                </div>
                <div className="text-gray-400 text-sm">Need Attention</div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-md border border-gray-600">
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 text-brand-teal mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">7</div>
                <div className="text-gray-400 text-sm">Days Active</div>
              </CardContent>
            </Card>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cropImages.map((image) => (
              <Card key={image.id} className="backdrop-blur-md border border-gray-600 hover:border-brand-teal/50 transition-all duration-300">
                <CardContent className="p-4">
                  {/* Image Placeholder */}
                  <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-4 flex items-center justify-center">
                    <Leaf className="h-16 w-16 text-gray-500" />
                  </div>

                  {/* Image Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-foreground font-semibold">{image.cropType}</h3>
                      <Badge className={getStatusBadgeClass(image.statusColor)}>
                        {image.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="h-4 w-4" />
                      {new Date(image.captureDate).toLocaleDateString()}
                    </div>

                    <p className="text-gray-400 text-sm">{image.analysis}</p>

                    <div className="space-y-2">
                      <div className="text-gray-400 text-xs font-medium">Recommendations:</div>
                      <ul className="space-y-1">
                        {image.recommendations.slice(0, 2).map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-400 text-xs">
                            <span className="text-brand-teal">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => setSelectedImage(image)}
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-brand-teal/20 border-brand-teal/40 text-gray-300 hover:bg-brand-teal/30"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={() => navigate("/crop-disease-detection")}
              className="bg-brand-teal/20 backdrop-blur-md border-brand-teal/40 hover:bg-brand-teal/30 text-gray-300"
              variant="outline"
            >
              <Camera className="h-4 w-4 mr-2" />
              Capture New Image
            </Button>
          </div>
        </div>
      </div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-md border border-gray-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">{selectedImage.cropType} Analysis</h2>
                <Button
                  onClick={() => setSelectedImage(null)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-300"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                  <Leaf className="h-24 w-24 text-gray-500" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    {new Date(selectedImage.captureDate).toLocaleDateString()}
                  </div>
                  <Badge className={getStatusBadgeClass(selectedImage.statusColor)}>
                    {selectedImage.status}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">Analysis Results</h3>
                  <p className="text-gray-400 text-sm">{selectedImage.analysis}</p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">Recommendations</h3>
                  <ul className="space-y-1">
                    {selectedImage.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-400 text-sm">
                        <span className="text-brand-teal">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CropImagesGallery;
