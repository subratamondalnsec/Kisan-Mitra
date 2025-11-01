import React from 'react';

const ImageGallery = ({ testName, testData, onImageClick }) => {
    if (!testData) return null;

    const images = Object.keys(testData);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in card-shadow">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <i className="fas fa-images text-3xl text-purple-600 mr-4"></i>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Test: {testName} - Drone Imagery
                    </h2>
                </div>
                <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold">
                    {images.length} Images from {testName}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((imageKey, index) => {
                    const imageData = testData[imageKey];
                    
                    // Handle both old Firebase structure and new MongoDB structure
                    let imageUrl = '';
                    let timestamp = '';
                    
                    if (imageData.imageUrl) {
                        // New structure from MongoDB (Cloudinary URL)
                        imageUrl = imageData.imageUrl;
                        timestamp = imageData.timestamp 
                            ? new Date(imageData.timestamp).toLocaleString()
                            : 'No timestamp';
                    } else {
                        // Fallback for old structure (shouldn't happen with refactored version)
                        console.warn('Old data structure detected for:', imageKey);
                        return null;
                    }

                    if (!imageUrl) {
                        console.warn(`No image URL for: ${imageKey}`);
                        return null;
                    }

                    return (
                        <div
                            key={imageKey}
                            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer animate-fade-in"
                            style={{ animationDelay: `${index * 0.05}s` }}
                            onClick={() => onImageClick(imageUrl, imageData)}
                        >
                            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                <img
                                    src={imageUrl}
                                    alt={imageKey}
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Available';
                                        console.error('Failed to load:', imageKey);
                                    }}
                                />
                            </div>
                            <div className="p-4">
                                <p className="text-sm font-semibold text-gray-700">{imageKey}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    <i className="fas fa-clock mr-1"></i>
                                    {timestamp}
                                </p>
                                {imageData.metadata?.cropType && (
                                    <p className="text-xs text-blue-600 mt-1">
                                        <i className="fas fa-leaf mr-1"></i>
                                        {imageData.metadata.cropType}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ImageGallery;
