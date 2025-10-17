import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'green' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const colorClasses = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    white: 'text-white'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-2 border-t-transparent border-current ${sizeClasses[size]} ${colorClasses[color]}`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;