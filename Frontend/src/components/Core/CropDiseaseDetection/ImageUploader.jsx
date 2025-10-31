import React, { useState, useRef } from "react";
import { CROP_TYPES, SUPPORTED_IMAGE_FORMATS, MAX_FILE_SIZE } from "../../../constants/CropDiseases";

const ImageUploader = ({ onAnalyze, analyzing }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cropType, setCropType] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    setError("");

    if (!file) return;

    // Validate file type
    if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("Image size should be less than 5MB");
      return;
    }

    // Set image
    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = () => {
    setError("");

    if (!selectedImage) {
      setError("Please upload an image");
      return;
    }

    if (!cropType) {
      setError("Please select a crop type");
      return;
    }

    onAnalyze(selectedImage, cropType);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = {
        target: {
          files: [file]
        }
      };
      handleImageSelect(fakeEvent);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Upload Crop Image
      </h2>

      {/* Crop Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Crop Type *
        </label>
        <select
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          disabled={analyzing}
        >
          <option value="">Choose crop type...</option>
          {CROP_TYPES.map((crop) => (
            <option key={crop.value} value={crop.value}>
              {crop.label}
            </option>
          ))}
        </select>
      </div>

      {/* Image Upload Area */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Image *
        </label>
        
        {!imagePreview ? (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors duration-200 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-600">
                  <span className="text-green-600 font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  PNG, JPG, JPEG or WebP (Max 5MB)
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              disabled={analyzing}
            />
          </div>
        ) : (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Crop preview"
              className="w-full h-96 object-contain rounded-lg border border-gray-300 bg-gray-50"
            />
            <button
              onClick={handleRemoveImage}
              disabled={analyzing}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
          <span className="text-xl mr-2">⚠️</span>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={analyzing || !selectedImage || !cropType}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
          analyzing || !selectedImage || !cropType
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        }`}
      >
        {analyzing ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
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
            <span>Analyzing...</span>
          </>
        ) : (
          <>
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>Analyze Crop Disease</span>
          </>
        )}
      </button>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Tips for best results:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>• Use clear, well-lit images</li>
          <li>• Focus on the affected area</li>
          <li>• Avoid blurry or dark images</li>
          <li>• Ensure the crop fills most of the frame</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUploader;
