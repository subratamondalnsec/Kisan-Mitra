import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../../contexts/DarkModeContext";

const DealerDetailCard = ({ dealerInfo }) => {
  const [showFullAddress, setShowFullAddress] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();


  // Add error checking
  if (!dealerInfo) {
    return (
      <div
        className={`p-6 text-center rounded-xl ${
          isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-50 text-gray-600"
        }`}
      >
        <p>⚠️ Dealer information not available</p>
      </div>
    );
  }

  if (!dealerInfo.businessAddress) {
    return (
      <div
        className={`p-6 text-center rounded-xl ${
          isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-50 text-gray-600"
        }`}
      >
        <p>📍 Dealer address information not available</p>
      </div>
    );
  }

  const handleCallDealer = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, "_self");
  };

  const handleWhatsAppDealer = (whatsappNumber) => {
    window.open(`https://wa.me/91${whatsappNumber}`, "_blank");
  };

  const handleGetDirections = (address) => {
    const fullAddress = `${address.street}, ${address.area}, ${address.city}, ${address.district}, ${address.state} ${address.pincode}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      "_blank"
    );
  };

  return (
    <div
      className={`p-6 border-b transition-all duration-300 ${
        isDarkMode ? "border-gray-600" : "border-gray-300/70"
      }`}
    >
      {/* Compact Dealer Header */}
      <div className="flex items-start justify-between ">
        <div className="flex items-center space-x-4">
          <div
            className={`w-16 h-16 rounded-full overflow-hidden border-3 shadow-lg ${
              isDarkMode ? "border-blue-500" : "border-green-500"
            }`}
          >
            <img
              src={
                dealerInfo.image ||
                `https://api.dicebear.com/5.x/initials/svg?seed=${dealerInfo.FullName}%20${dealerInfo.lastName}`
              }
              alt="Dealer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {dealerInfo.FullName} {dealerInfo.lastName}
              </h3>
              {dealerInfo.isVerified && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  ✓ Verified
                </span>
              )}
            </div>
            <p
              className={`text-sm font-medium mb-2 ${
                isDarkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              🏪 {dealerInfo.businessAddress.businessName}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <span className="text-yellow-400 text-sm">⭐</span>
                <span
                  className={`text-sm font-medium ml-1 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {dealerInfo.averageRating?.toFixed(1) || "0.0"}/5
                </span>
              </div>
              <span
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                ({dealerInfo.ratingCount || 0}{" "}
                {dealerInfo.ratingCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions - Compact */}
        <div className="flex items-start gap-2">
          <button
            onClick={() => handleGetDirections(dealerInfo.businessAddress)}
            className="px-3 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition-all duration-300 text-sm font-medium flex items-center gap-1"
          >
            �️ Directions
          </button>

          <button
            onClick={() => setShowFullAddress(!showFullAddress)}
            className={`px-3 py-2 rounded-sm transition-all duration-300 text-sm font-medium flex items-center gap-1 ${
              showFullAddress
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
          >
            📍 {showFullAddress ? "Hide" : "Show"} Address
          </button>

          <button
            onClick={() => navigate(`/farmer/${dealerInfo._id}/reviews`)}
            className="px-3 py-2 bg-purple-500 text-white rounded-sm hover:bg-purple-600 transition-all duration-300 text-sm font-medium flex items-center gap-1"
          >
            ⭐ Reviews ({dealerInfo.ratingCount || 0})
          </button>
          <button
            onClick={() => handleCallDealer(dealerInfo.contactNumber)}
            className="px-3 py-2 bg-green-500 text-white rounded-sm hover:bg-green-600 transition-all duration-300 text-sm font-medium flex items-center gap-1"
          >
            📞 Call
          </button>

          {dealerInfo.whatsappNumber && (
            <button
              onClick={() => handleWhatsAppDealer(dealerInfo.whatsappNumber)}
              className="px-3 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 transition-all duration-300 text-sm font-medium flex items-center gap-1"
            >
              💬 WhatsApp
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Full Address */}
      {showFullAddress && (
        <div
          className={`p-4 rounded-lg border transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-700/50 border-gray-600"
              : "bg-gray-50/50 border-gray-200"
          }`}
        >
          <h4
            className={`text-sm font-semibold mb-3 flex items-center ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            📍 Complete Business Address
          </h4>
          <div
            className={`p-3 rounded-lg text-sm leading-relaxed ${
              isDarkMode ? "bg-gray-800/50" : "bg-white/50"
            }`}
          >
            <p
              className={`font-semibold mb-1 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {dealerInfo.businessAddress.businessName}
            </p>
            <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
              {dealerInfo.businessAddress.street}
            </p>
            <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
              {dealerInfo.businessAddress.area}
            </p>
            <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
              {dealerInfo.businessAddress.city},{" "}
              {dealerInfo.businessAddress.district}
            </p>
            <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
              {dealerInfo.businessAddress.state} -{" "}
              {dealerInfo.businessAddress.pincode}
            </p>
            {dealerInfo.businessAddress.landmark && (
              <p
                className={`mt-1 italic ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Near: {dealerInfo.businessAddress.landmark}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerDetailCard;
