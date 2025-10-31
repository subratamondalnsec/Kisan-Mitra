import React, { useState } from "react";
import { Trash2, Calendar, Leaf, TrendingUp, TrendingDown, Minus } from "lucide-react";

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const SoilHealthHistory = ({ history, onDelete, loading }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12">
        <Leaf className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No Soil Health Tests Yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Run your first soil health test to see results here
        </p>
      </div>
    );
  }

  const getQualityBadge = (quality) => {
    if (quality >= 70) {
      return {
        text: "Excellent",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        icon: <TrendingUp size={16} />,
      };
    } else if (quality >= 50) {
      return {
        text: "Good",
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        icon: <TrendingUp size={16} />,
      };
    } else if (quality >= 30) {
      return {
        text: "Moderate",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        icon: <Minus size={16} />,
      };
    } else {
      return {
        text: "Poor",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        icon: <TrendingDown size={16} />,
      };
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this soil health record?")) {
      await onDelete(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Leaf className="text-green-600" />
          Soil Health History
        </h2>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Total Tests: {history.length}
        </span>
      </div>

      <div className="grid gap-4">
        {history.map((record) => {
          const qualityBadge = getQualityBadge(record.soil_quality);
          const isExpanded = expandedId === record._id;

          return (
            <div
              key={record._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Header - Always Visible */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => toggleExpand(record._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${qualityBadge.className}`}>
                        {qualityBadge.icon}
                        {qualityBadge.text}
                      </span>
                      <span className="text-2xl font-bold text-gray-800 dark:text-white">
                        {record.soil_quality.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">/100</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(record.createdAt)}
                      </span>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded">
                        {record.Crop_Type}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, record._id)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                    title="Delete record"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      record.soil_quality >= 70
                        ? "bg-green-600"
                        : record.soil_quality >= 50
                        ? "bg-blue-600"
                        : record.soil_quality >= 30
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                    style={{ width: `${Math.min(record.soil_quality, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700/50 animate-fadeIn">
                  {/* Solution */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                      Recommendations:
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {record.solution}
                    </p>
                  </div>

                  {/* Parameters Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Temperature
                      </p>
                      <p className="text-sm font-bold text-gray-800 dark:text-white">
                        {record.Temperature}°C
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Humidity</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-white">
                        {record.Humidity}%
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Wind Speed
                      </p>
                      <p className="text-sm font-bold text-gray-800 dark:text-white">
                        {record.Wind_Speed} km/h
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Crop</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-white">
                        {record.Crop_Type}
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Nitrogen (N)
                      </p>
                      <p className="text-sm font-bold text-green-700 dark:text-green-300">
                        {record.Nitrogen} mg/kg
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Phosphorous (P)
                      </p>
                      <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                        {record.Phosphorous} mg/kg
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Potassium (K)
                      </p>
                      <p className="text-sm font-bold text-purple-700 dark:text-purple-300">
                        {record.Potassium} mg/kg
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SoilHealthHistory;
