import React, { useState, useEffect } from 'react';
import { getFarmerImages } from '../services/operations/firebaseImageApi';
import DashboardHeader from '../components/Core/Dashboard/DashboardHeader';
import DashboardFooter from '../components/Core/Dashboard/DashboardFooter';
import FarmerSearch from '../components/Core/Dashboard/FarmerSearch';
import FarmerInfoCard from '../components/Core/Dashboard/FarmerInfoCard';
import TestsGrid from '../components/Core/Dashboard/TestsGrid';
import ImageGallery from '../components/Core/Dashboard/ImageGallery';
import ImageModal from '../components/Core/Dashboard/ImageModal';
import AnalysisModal from '../components/Core/Dashboard/AnalysisModal';
import LoadingIndicator from '../components/Core/Dashboard/LoadingIndicator';
import ErrorMessage from '../components/Core/Dashboard/ErrorMessage';

const DashboardRefactored = () => {
    const FIXED_FARMER_ID = 'farmer_001'; // Fixed for testing
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [farmerId, setFarmerId] = useState(FIXED_FARMER_ID);
    const [farmerData, setFarmerData] = useState(null);
    const [selectedTest, setSelectedTest] = useState({ name: '', data: null });
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState({ url: '', base64: '', imageId: '' });
    const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);

    /**
     * Fetch farmer images from backend (MongoDB)
     * Backend serves Cloudinary URLs stored in database
     */
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
            // Call backend API to get farmer images from MongoDB
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
        // Scroll to image gallery
        setTimeout(() => {
            document.getElementById('imageGallerySection')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    };

    const handleImageClick = (imageUrl, imageData) => {
        // imageData now contains the MongoDB document data
        setSelectedImage({ 
            url: imageUrl, 
            base64: '', // No base64 needed from frontend
            imageId: imageData._id || ''
        });
        setImageModalOpen(true);
    };

    const handleAnalyze = async (base64Data, cropType) => {
        try {
            // For analysis, we still use the AI API directly
            // You could also proxy this through your backend if desired
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

            // Optionally, update the analysis result in MongoDB
            // if (selectedImage.imageId) {
            //     await updateAnalysisResult(selectedImage.imageId, {
            //         analysisResult: result,
            //         analysisStatus: 'analyzed'
            //     });
            // }
        } catch (err) {
            setError(`Error analyzing image: ${err.message}`);
            setImageModalOpen(false);
        }
    };

    // Auto-load farmer_001 data on component mount
    useEffect(() => {
        fetchFarmerData(FIXED_FARMER_ID);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <DashboardHeader />

            <main className="container mx-auto px-6 py-8 flex-grow">
                <FarmerSearch onSearch={fetchFarmerData} loading={loading} />

                {loading && <LoadingIndicator />}

                <ErrorMessage message={error} />

                {farmerData && (
                    <div>
                        <FarmerInfoCard farmerId={farmerId} />
                        <TestsGrid
                            farmerData={farmerData}
                            onViewImages={handleViewImages}
                        />

                        {selectedTest.data && (
                            <div id="imageGallerySection">
                                <ImageGallery
                                    testName={selectedTest.name}
                                    testData={selectedTest.data}
                                    onImageClick={handleImageClick}
                                />
                            </div>
                        )}
                    </div>
                )}
            </main>

            <DashboardFooter />

            <ImageModal
                isOpen={imageModalOpen}
                imageUrl={selectedImage.url}
                base64Data={selectedImage.base64}
                onClose={() => setImageModalOpen(false)}
                onAnalyze={handleAnalyze}
            />

            <AnalysisModal
                isOpen={analysisModalOpen}
                results={analysisResults}
                onClose={() => setAnalysisModalOpen(false)}
            />
        </div>
    );
};

export default DashboardRefactored;
