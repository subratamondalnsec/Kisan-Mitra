import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, Calendar, Eye, Leaf, Download, Search, User, Folder } from "lucide-react";
import FarmerNavbar from "../components/Common/FarmerNavbar";
import { getFarmerImages } from "../services/operations/firebaseImageApi";
import ImageModal from "../components/Core/Dashboard/ImageModal";
import AnalysisModal from "../components/Core/Dashboard/AnalysisModal";

const CropImagesGallery = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Dashboard functionality states
  const FIXED_FARMER_ID = 'farmer_001';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [farmerId, setFarmerId] = useState(FIXED_FARMER_ID);
  const [farmerData, setFarmerData] = useState(null);
  const [selectedTest, setSelectedTest] = useState({ name: '', data: null });
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedDashboardImage, setSelectedDashboardImage] = useState({ url: '', base64: '', imageId: '' });
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Dashboard functionality functions
  const fetchFarmerData = async (searchFarmerId = FIXED_FARMER_ID) => {
    if (!searchFarmerId) {
      setError('Please enter a Farmer ID');
      return;
    }

    setLoading(true);
    setError('');
    setFarmerData(null);
    setSelectedTest({ name: '', data: null });

    try {
      const response = await getFarmerImages(searchFarmerId);
      if (response.success && response.data) {
        setFarmerId(searchFarmerId);
        setFarmerData(response.data);
      } else {
        setError(`Farmer with ID "${searchFarmerId}" not found in database`);
      }
    } catch (err) {
      console.error('Error fetching farmer data:', err);
      setError(`Error fetching data: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewImages = (testName, testData) => {
    setSelectedTest({ name: testName, data: testData });
    setTimeout(() => {
      document.getElementById('dashboardImageGallery')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleImageClick = (imageUrl, imageData) => {
    setSelectedDashboardImage({ 
      url: imageUrl, 
      base64: '',
      imageId: imageData._id || ''
    });
    setImageModalOpen(true);
  };

  const handleAnalyze = async (base64Data, cropType) => {
    try {
      const response = await fetch('https://crop-disease-detection-rice-wheat-tomato.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Data,
          crop_type: cropType
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setAnalysisResults(result);
      setImageModalOpen(false);
      setAnalysisModalOpen(true);
    } catch (err) {
      setError(`Error analyzing image: ${err.message}`);
      setImageModalOpen(false);
    }
  };

  // Auto-load farmer data on component mount
  useEffect(() => {
    fetchFarmerData(FIXED_FARMER_ID);
  }, []);

  return (
    <div className="min-h-screen bg-background dark">
      {/* Navbar */}
      <FarmerNavbar />

      {/* Main Content */}
      <div className="pt-8 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            
            <div>
              <h1 className="text-5xl md:text-6xl text-gray-400 font-bold mb-1">
                <span className="stroke-text1">Crop</span> Images <span className="stroke-text2">Gallery</span>
              </h1>
              <p className="text-lg text-gray-400">
                View and analyze your captured crop images with AI-powered insights
              </p>
            </div>
          </div>

          {/* Farmer Search Section */}
          <div className="mb-8">
            <Card className="backdrop-blur-md border border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <User className="h-6 w-6 text-brand-teal" />
                  <h2 className="text-xl font-semibold text-gray-400">Farmer Data Search</h2>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Enter Farmer ID (e.g., farmer_001)"
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                    />
                  </div>
                  <Button
                    onClick={() => fetchFarmerData(searchTerm || FIXED_FARMER_ID)}
                    disabled={loading}
                    className="bg-brand-teal/20 backdrop-blur-md border border-brand-teal/40 hover:bg-brand-teal/30 text-gray-300"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
                {error && (
                  <div className="mt-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-sm">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Farmer Info Card */}
          {farmerData && (
            <div className="mb-8">
              <Card className="backdrop-blur-md border border-gray-600">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-teal/20 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-brand-teal" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-400">Farmer ID: {farmerId}</h3>
                      <p className="text-gray-400 text-sm">Data loaded successfully</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tests Grid */}
          {farmerData && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-400 mb-4">Available Test Collections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(farmerData).map((testKey, index) => {
                  const testData = farmerData[testKey];
                  const imageCount = Object.keys(testData).length;
                  
                  return (
                    <Card key={testKey} className="backdrop-blur-md border border-gray-600 hover:border-brand-teal/50 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Folder className="h-6 w-6 text-brand-teal" />
                            <h3 className="text-lg font-semibold text-gray-400">{testKey}</h3>
                          </div>
                          <Badge className="bg-brand-teal/20 text-brand-teal border-brand-teal/40">
                            {imageCount} images
                          </Badge>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-400 text-sm">
                            <Camera className="h-4 w-4 mr-2 text-brand-teal" />
                            <span>Drone Collection</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleViewImages(testKey, testData)}
                          className="w-full bg-brand-teal/20 backdrop-blur-md border border-brand-teal/40 hover:bg-brand-teal/30 text-gray-300"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Images
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dashboard Image Gallery */}
          {selectedTest.data && (
            <div id="dashboardImageGallery" className="mb-8">
              <Card className="backdrop-blur-md border border-gray-600">
                <CardHeader>
                  <CardTitle className="text-gray-400 flex items-center gap-2">
                    <Camera className="h-6 w-6 text-brand-teal" />
                    Test: {selectedTest.name} - Drone Imagery
                  </CardTitle>
                  <Badge className="bg-brand-teal/20 text-brand-teal border-brand-teal/40 w-fit">
                    {Object.keys(selectedTest.data).length} Images from {selectedTest.name}
                  </Badge>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.keys(selectedTest.data).map((imageKey, index) => {
                      const imageData = selectedTest.data[imageKey];
                      let imageUrl = '';
                      let timestamp = '';
                      
                      if (imageData.imageUrl) {
                        imageUrl = imageData.imageUrl;
                        timestamp = imageData.timestamp 
                          ? new Date(imageData.timestamp).toLocaleString()
                          : 'No timestamp';
                      } else {
                        return null;
                      }

                      if (!imageUrl) {
                        return null;
                      }

                      return (
                        <Card
                          key={imageKey}
                          className="backdrop-blur-md border border-gray-600 hover:border-brand-teal/50 transition-all cursor-pointer"
                          onClick={() => handleImageClick(imageUrl, imageData)}
                        >
                          <CardContent className="p-3">
                            <div className="aspect-square bg-gray-800 rounded-lg mb-3 overflow-hidden">
                              <img
                                src={imageUrl}
                                alt={imageKey}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Available';
                                }}
                              />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-400 mb-1">{imageKey}</p>
                              <p className="text-xs text-gray-500">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                {timestamp}
                              </p>
                              {imageData.metadata?.cropType && (
                                <p className="text-xs text-brand-teal mt-1">
                                  <Leaf className="h-3 w-3 inline mr-1" />
                                  {imageData.metadata.cropType}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          
        </div>
      </div>

      {/* Dashboard Modals */}
      <ImageModal
        isOpen={imageModalOpen}
        imageUrl={selectedDashboardImage.url}
        base64Data={selectedDashboardImage.base64}
        onClose={() => setImageModalOpen(false)}
        onAnalyze={handleAnalyze}
      />

      <AnalysisModal
        isOpen={analysisModalOpen}
        results={analysisResults}
        onClose={() => setAnalysisModalOpen(false)}
      />

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
