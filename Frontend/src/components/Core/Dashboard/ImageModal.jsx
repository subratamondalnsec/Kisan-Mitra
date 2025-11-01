import React, { useState } from 'react';

const ImageModal = ({ isOpen, imageUrl, base64Data, onClose, onAnalyze }) => {
    const [cropType, setCropType] = useState('rice');
    const [analyzing, setAnalyzing] = useState(false);

    if (!isOpen) return null;

    const handleAnalyze = async () => {
        setAnalyzing(true);
        try {
            // Use imageUrl directly for Cloudinary images
            await onAnalyze(imageUrl, cropType);
        } catch (error) {
            console.error('Analysis error:', error);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-8 text-white text-5xl font-bold hover:text-gray-300 transition-colors z-10"
            >
                &times;
            </button>

            <div className="flex flex-col items-center max-w-5xl w-full">
                <img
                    src={imageUrl}
                    alt="Selected"
                    className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-2xl"
                />

                <div className="mt-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 flex flex-col sm:flex-row items-center gap-4">
                    <label htmlFor="cropTypeSelect" className="text-white text-lg font-semibold">
                        Select Crop Type:
                    </label>
                    <select
                        id="cropTypeSelect"
                        value={cropType}
                        onChange={(e) => setCropType(e.target.value)}
                        className="px-4 py-2 rounded-lg text-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                        disabled={analyzing}
                    >
                        <option value="rice">Rice</option>
                        <option value="wheat">Wheat</option>
                        <option value="tomato">Tomato</option>
                    </select>
                    <button
                        onClick={handleAnalyze}
                        disabled={analyzing}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <i className="fas fa-brain mr-2"></i>
                        {analyzing ? 'Analyzing...' : 'Analyze with AI'}
                    </button>
                </div>

                {analyzing && (
                    <div className="mt-6 text-center">
                        <div className="loader mx-auto mb-4"></div>
                        <p className="text-white text-lg">Analyzing crop health...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageModal;
