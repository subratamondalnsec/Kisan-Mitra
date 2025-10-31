import React from "react";
import { CheckCircle, AlertCircle, AlertTriangle, XCircle, Leaf, RefreshCw } from "lucide-react";

const SoilHealthResult = ({ result, onNewTest }) => {
  if (!result) return null;

  const { soil_quality, solution, inputData } = result;

  // Determine quality level and styling
  const getQualityInfo = (quality) => {
    if (quality >= 70) {
      return {
        level: "Excellent",
        color: "text-green-600",
        bgColor: "bg-green-100 dark:bg-green-900",
        borderColor: "border-green-500",
        icon: <CheckCircle className="text-green-600" size={48} />,
        emoji: "🌟",
      };
    } else if (quality >= 50) {
      return {
        level: "Good",
        color: "text-blue-600",
        bgColor: "bg-blue-100 dark:bg-blue-900",
        borderColor: "border-blue-500",
        icon: <CheckCircle className="text-blue-600" size={48} />,
        emoji: "✅",
      };
    } else if (quality >= 30) {
      return {
        level: "Moderate",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100 dark:bg-yellow-900",
        borderColor: "border-yellow-500",
        icon: <AlertTriangle className="text-yellow-600" size={48} />,
        emoji: "⚠️",
      };
    } else {
      return {
        level: "Poor",
        color: "text-red-600",
        bgColor: "bg-red-100 dark:bg-red-900",
        borderColor: "border-red-500",
        icon: <XCircle className="text-red-600" size={48} />,
        emoji: "❌",
      };
    }
  };

  const qualityInfo = getQualityInfo(soil_quality);

  // Calculate progress bar width
  const progressWidth = Math.min(soil_quality, 100);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Main Result Card */}
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 ${qualityInfo.borderColor} p-6 md:p-8`}>
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">{qualityInfo.icon}</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Soil Quality Assessment
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Analysis Complete</p>
        </div>

        {/* Quality Score Display */}
        <div className={`${qualityInfo.bgColor} rounded-xl p-6 mb-6`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-semibold text-gray-800 dark:text-white">
              Quality Score
            </span>
            <span className="text-4xl">{qualityInfo.emoji}</span>
          </div>
          
          <div className="flex items-baseline gap-2 mb-4">
            <span className={`text-5xl md:text-6xl font-bold ${qualityInfo.color}`}>
              {soil_quality.toFixed(2)}
            </span>
            <span className="text-2xl text-gray-600 dark:text-gray-400">/100</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-3 overflow-hidden">
            <div
              className={`h-full ${
                soil_quality >= 70
                  ? "bg-green-600"
                  : soil_quality >= 50
                  ? "bg-blue-600"
                  : soil_quality >= 30
                  ? "bg-yellow-600"
                  : "bg-red-600"
              } transition-all duration-1000 ease-out`}
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Poor</span>
            <span>Moderate</span>
            <span>Good</span>
            <span>Excellent</span>
          </div>

          <div className="mt-4 text-center">
            <span className={`inline-block px-6 py-2 rounded-full font-bold text-lg ${qualityInfo.color} bg-white dark:bg-gray-800`}>
              {qualityInfo.level} Quality
            </span>
          </div>
        </div>

        {/* Solution/Recommendations */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="text-green-600" size={24} />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Recommendations
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {solution}
          </p>
        </div>
      </div>

      {/* Input Parameters Card */}
      {inputData && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Tested Parameters
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Temperature</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">
                {inputData.Temperature}°C
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Humidity</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">
                {inputData.Humidity}%
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Wind Speed</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">
                {inputData.Wind_Speed} km/h
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Crop Type</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">
                {inputData.Crop_Type}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Nitrogen (N)</p>
              <p className="text-lg font-bold text-green-700 dark:text-green-300">
                {inputData.Nitrogen} mg/kg
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Phosphorous (P)</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {inputData.Phosphorous} mg/kg
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Potassium (K)</p>
              <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                {inputData.Potassium} mg/kg
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={onNewTest}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <RefreshCw size={20} />
          Run New Test
        </button>
      </div>
    </div>
  );
};

export default SoilHealthResult;
