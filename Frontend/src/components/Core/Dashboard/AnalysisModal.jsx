import React from 'react';

const AnalysisModal = ({ isOpen, results, onClose }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const renderResults = () => {
        if (!results) {
            return (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex items-center">
                        <i className="fas fa-exclamation-triangle text-red-500 text-2xl mr-3"></i>
                        <p className="text-red-800">No analysis results available.</p>
                    </div>
                </div>
            );
        }

        if (results.status === 'success' && results.predictions) {
            return (
                <>
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                        <div className="flex items-center">
                            <i className="fas fa-check-circle text-green-500 text-2xl mr-3"></i>
                            <p className="text-green-800 font-semibold">Analysis Complete</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {results.predictions.map((prediction, index) => {
                            const confidence = (prediction.confidence * 100).toFixed(2);
                            const isHealthy = prediction.class.toLowerCase().includes('healthy');
                            const colorClass = isHealthy ? 'green' : 'red';

                            return (
                                <div
                                    key={index}
                                    className={`bg-${colorClass}-50 border border-${colorClass}-200 rounded-lg p-6`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className={`text-xl font-bold text-${colorClass}-800`}>
                                            {prediction.class}
                                        </h3>
                                        <span className={`bg-${colorClass}-600 text-white px-4 py-2 rounded-full font-semibold`}>
                                            {confidence}% Confidence
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className={`bg-${colorClass}-600 h-3 rounded-full transition-all duration-500`}
                                            style={{ width: `${confidence}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            );
        }

        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex items-center">
                    <i className="fas fa-exclamation-triangle text-red-500 text-2xl mr-3"></i>
                    <p className="text-red-800">Analysis failed or returned no predictions.</p>
                </div>
            </div>
        );
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

            <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto animate-fade-in">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    <i className="fas fa-microscope text-green-600 mr-3"></i>
                    AI Analysis Results
                </h2>

                {renderResults()}

                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-all font-semibold"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default AnalysisModal;
