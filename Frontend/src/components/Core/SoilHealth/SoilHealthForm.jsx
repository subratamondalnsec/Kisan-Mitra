import React, { useState } from "react";
import { Leaf, Droplets, Wind, FileText } from "lucide-react";

const SoilHealthForm = ({ onSubmit, analyzing }) => {
  const [formData, setFormData] = useState({
    Temperature: "",
    Humidity: "",
    Wind_Speed: "",
    Nitrogen: "",
    Phosphorous: "",
    Potassium: "",
    Crop_Type: "",
  });

  const [errors, setErrors] = useState({});

  const cropTypes = [
    "Wheat",
    "Rice",
    "Maize",
    "Cotton",
    "Sugarcane",
    "Barley",
    "Soybean",
    "Potato",
    "Tomato",
    "Onion",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Temperature) {
      newErrors.Temperature = "Temperature is required";
    } else if (isNaN(formData.Temperature)) {
      newErrors.Temperature = "Temperature must be a number";
    }

    if (!formData.Humidity) {
      newErrors.Humidity = "Humidity is required";
    } else if (isNaN(formData.Humidity) || formData.Humidity < 0 || formData.Humidity > 100) {
      newErrors.Humidity = "Humidity must be between 0 and 100";
    }

    if (!formData.Wind_Speed) {
      newErrors.Wind_Speed = "Wind speed is required";
    } else if (isNaN(formData.Wind_Speed) || formData.Wind_Speed < 0) {
      newErrors.Wind_Speed = "Wind speed must be a positive number";
    }

    if (!formData.Nitrogen) {
      newErrors.Nitrogen = "Nitrogen level is required";
    } else if (isNaN(formData.Nitrogen) || formData.Nitrogen < 0) {
      newErrors.Nitrogen = "Nitrogen must be a positive number";
    }

    if (!formData.Phosphorous) {
      newErrors.Phosphorous = "Phosphorous level is required";
    } else if (isNaN(formData.Phosphorous) || formData.Phosphorous < 0) {
      newErrors.Phosphorous = "Phosphorous must be a positive number";
    }

    if (!formData.Potassium) {
      newErrors.Potassium = "Potassium level is required";
    } else if (isNaN(formData.Potassium) || formData.Potassium < 0) {
      newErrors.Potassium = "Potassium must be a positive number";
    }

    if (!formData.Crop_Type) {
      newErrors.Crop_Type = "Please select a crop type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      Temperature: "",
      Humidity: "",
      Wind_Speed: "",
      Nitrogen: "",
      Phosphorous: "",
      Potassium: "",
      Crop_Type: "",
    });
    setErrors({});
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
          <Leaf className="text-green-600" size={28} />
          Soil Health Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Enter soil parameters to get quality assessment and recommendations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Environmental Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Temperature (°C) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="Temperature"
              value={formData.Temperature}
              onChange={handleChange}
              placeholder="e.g., 25.5"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.Temperature ? "border-red-500" : "border-gray-300"
              }`}
              disabled={analyzing}
            />
            {errors.Temperature && (
              <p className="text-red-500 text-xs mt-1">{errors.Temperature}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Droplets size={16} className="text-blue-500" />
              Humidity (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="Humidity"
              value={formData.Humidity}
              onChange={handleChange}
              placeholder="e.g., 80"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.Humidity ? "border-red-500" : "border-gray-300"
              }`}
              disabled={analyzing}
            />
            {errors.Humidity && (
              <p className="text-red-500 text-xs mt-1">{errors.Humidity}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Wind size={16} className="text-gray-500" />
              Wind Speed (km/h) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="Wind_Speed"
              value={formData.Wind_Speed}
              onChange={handleChange}
              placeholder="e.g., 10.5"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.Wind_Speed ? "border-red-500" : "border-gray-300"
              }`}
              disabled={analyzing}
            />
            {errors.Wind_Speed && (
              <p className="text-red-500 text-xs mt-1">{errors.Wind_Speed}</p>
            )}
          </div>
        </div>

        {/* NPK Parameters */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            NPK Values (mg/kg)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nitrogen (N) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                name="Nitrogen"
                value={formData.Nitrogen}
                onChange={handleChange}
                placeholder="e.g., 60.5"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.Nitrogen ? "border-red-500" : "border-gray-300"
                }`}
                disabled={analyzing}
              />
              {errors.Nitrogen && (
                <p className="text-red-500 text-xs mt-1">{errors.Nitrogen}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phosphorous (P) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                name="Phosphorous"
                value={formData.Phosphorous}
                onChange={handleChange}
                placeholder="e.g., 45.0"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.Phosphorous ? "border-red-500" : "border-gray-300"
                }`}
                disabled={analyzing}
              />
              {errors.Phosphorous && (
                <p className="text-red-500 text-xs mt-1">{errors.Phosphorous}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Potassium (K) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                name="Potassium"
                value={formData.Potassium}
                onChange={handleChange}
                placeholder="e.g., 31.5"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.Potassium ? "border-red-500" : "border-gray-300"
                }`}
                disabled={analyzing}
              />
              {errors.Potassium && (
                <p className="text-red-500 text-xs mt-1">{errors.Potassium}</p>
              )}
            </div>
          </div>
        </div>

        {/* Crop Type Selection */}
        <div>
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FileText size={16} className="text-green-600" />
            Crop Type <span className="text-red-500">*</span>
          </label>
          <select
            name="Crop_Type"
            value={formData.Crop_Type}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
              errors.Crop_Type ? "border-red-500" : "border-gray-300"
            }`}
            disabled={analyzing}
          >
            <option value="">Select a crop type</option>
            {cropTypes.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
          {errors.Crop_Type && (
            <p className="text-red-500 text-xs mt-1">{errors.Crop_Type}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={analyzing}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {analyzing ? (
              <span className="flex items-center justify-center gap-2">
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              "Analyze Soil Quality"
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={analyzing}
            className="sm:w-32 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SoilHealthForm;
