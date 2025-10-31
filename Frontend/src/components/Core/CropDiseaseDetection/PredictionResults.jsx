import React from "react";

const PredictionResults = ({ prediction, onNewAnalysis }) => {
  if (!prediction) return null;

  const { cropType, predictedDiseases, predictionDate, createdAt } = prediction;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDiseaseColor = (disease) => {
    const lowercaseDisease = disease.toLowerCase();
    if (lowercaseDisease.includes("healthy")) {
      return "text-green-600 bg-green-50 border-green-200";
    }
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getDiseaseIcon = (disease) => {
    const lowercaseDisease = disease.toLowerCase();
    if (lowercaseDisease.includes("healthy")) {
      return "✅";
    }
    return "⚠️";
  };

  const getRecommendations = (diseases) => {
    const hasHealthy = diseases.some((d) => d.toLowerCase().includes("healthy"));
    
    if (hasHealthy) {
      return [
        "Continue regular monitoring of your crop",
        "Maintain current farming practices",
        "Keep the crop area clean and well-ventilated",
        "Follow preventive measures to avoid future infections",
      ];
    }

    return [
      "Consult with agricultural experts for treatment options",
      "Remove and destroy infected plant parts",
      "Apply appropriate fungicides or pesticides as recommended",
      "Improve field drainage and air circulation",
      "Practice crop rotation to prevent recurrence",
      "Monitor adjacent plants for signs of spread",
    ];
  };

  const recommendations = getRecommendations(predictedDiseases);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Analysis Results
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(predictionDate || createdAt)}
          </p>
        </div>
        <button
          onClick={onNewAnalysis}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>New Analysis</span>
        </button>
      </div>

      {/* Crop Type */}
      <div className="mb-6">
        <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-2xl mr-2">🌾</span>
          <div>
            <p className="text-xs text-blue-600 font-medium uppercase">Crop Type</p>
            <p className="text-lg font-semibold text-blue-900 capitalize">
              {cropType}
            </p>
          </div>
        </div>
      </div>

      {/* Detected Diseases */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Detected Conditions
        </h3>
        <div className="space-y-3">
          {predictedDiseases.map((disease, index) => (
            <div
              key={index}
              className={`flex items-center p-4 rounded-lg border-2 ${getDiseaseColor(
                disease
              )} transition-all duration-200 hover:shadow-md`}
            >
              <span className="text-3xl mr-4">{getDiseaseIcon(disease)}</span>
              <div className="flex-1">
                <p className="font-semibold text-lg">{disease}</p>
                <p className="text-sm opacity-75">
                  {disease.toLowerCase().includes("healthy")
                    ? "Your crop appears to be in good health"
                    : "Disease detected - Action required"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Recommendations
        </h3>
        <ul className="space-y-2">
          {recommendations.map((recommendation, index) => (
            <li
              key={index}
              className="flex items-start text-gray-700"
            >
              <span className="text-green-600 mr-2 mt-1 flex-shrink-0">▪</span>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Warning Notice */}
      {predictedDiseases.some((d) => !d.toLowerCase().includes("healthy")) && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
          <svg
            className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="font-semibold text-yellow-900 mb-1">
              Important Notice
            </p>
            <p className="text-sm text-yellow-800">
              This is an AI-powered analysis and should be used as a preliminary assessment. 
              For accurate diagnosis and treatment, please consult with local agricultural 
              experts or extension officers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionResults;
