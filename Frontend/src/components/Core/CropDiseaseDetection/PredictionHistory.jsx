import React, { useState } from "react";

const PredictionHistory = ({ history, loading, onDelete }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDiseaseIcon = (disease) => {
    const lowercaseDisease = disease.toLowerCase();
    if (lowercaseDisease.includes("healthy")) {
      return "✅";
    }
    return "⚠️";
  };

  const getDiseaseColor = (disease) => {
    const lowercaseDisease = disease.toLowerCase();
    if (lowercaseDisease.includes("healthy")) {
      return "text-green-600 bg-green-50";
    }
    return "text-red-600 bg-red-50";
  };

  const handleDelete = async (predictionId) => {
    if (window.confirm("Are you sure you want to delete this prediction?")) {
      setDeletingId(predictionId);
      try {
        await onDelete(predictionId);
      } catch (error) {
        console.error("Failed to delete prediction:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading history...</p>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          No Prediction History
        </h3>
        <p className="text-gray-600">
          You haven't analyzed any crops yet. Start by uploading an image!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Prediction History ({history.length})
        </h2>
      </div>

      <div className="grid gap-4">
        {history.map((prediction) => (
          <div
            key={prediction._id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            {/* Card Header */}
            <div
              className="p-4 cursor-pointer"
              onClick={() => toggleExpand(prediction._id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Crop Type Badge */}
                  <div className="flex items-center px-3 py-1 bg-blue-100 border border-blue-200 rounded-lg">
                    <span className="text-xl mr-2">🌾</span>
                    <span className="font-semibold text-blue-900 capitalize text-sm">
                      {prediction.cropType}
                    </span>
                  </div>

                  {/* Disease Count */}
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {prediction.predictedDiseases.some((d) =>
                        d.toLowerCase().includes("healthy")
                      )
                        ? "✅"
                        : "⚠️"}
                    </span>
                    <span className="text-sm text-gray-600">
                      {prediction.predictedDiseases.length} condition(s) detected
                    </span>
                  </div>
                </div>

                {/* Date and Actions */}
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {formatDate(prediction.predictionDate || prediction.createdAt)}
                  </span>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(prediction._id);
                    }}
                    disabled={deletingId === prediction._id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    {deletingId === prediction._id ? (
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Expand Icon */}
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      expandedId === prediction._id ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === prediction._id && (
              <div className="px-4 pb-4 border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Detected Conditions:
                </h4>
                <div className="space-y-2">
                  {prediction.predictedDiseases.map((disease, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-3 rounded-lg ${getDiseaseColor(
                        disease
                      )}`}
                    >
                      <span className="text-2xl mr-3">
                        {getDiseaseIcon(disease)}
                      </span>
                      <span className="font-medium">{disease}</span>
                    </div>
                  ))}
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Prediction Date:</span>
                    <p className="font-medium text-gray-900">
                      {formatDate(prediction.predictionDate)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionHistory;
