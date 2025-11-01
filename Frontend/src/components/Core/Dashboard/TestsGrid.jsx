import React from 'react';

const TestsGrid = ({ farmerData, onViewImages }) => {
    if (!farmerData) return null;

    const tests = Object.keys(farmerData);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tests.map((testKey, index) => {
                const testData = farmerData[testKey];
                const imageCount = Object.keys(testData).length;

                return (
                    <div
                        key={testKey}
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 card-shadow animate-slide-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800">
                                <i className="fas fa-folder text-indigo-600 mr-2"></i>
                                {testKey}
                            </h3>
                            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                {imageCount} images
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center text-gray-600">
                                <i className="fas fa-camera text-blue-500 mr-2"></i>
                                <span>Drone Collection</span>
                            </div>
                            <button
                                onClick={() => onViewImages(testKey, testData)}
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all mt-4"
                            >
                                <i className="fas fa-eye mr-2"></i>View Images
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TestsGrid;
