import React from 'react';

const LoadingIndicator = ({ message = "Loading farmer data..." }) => {
    return (
        <div className="text-center py-12">
            <div className="loader mx-auto"></div>
            <p className="text-gray-600 mt-4 text-lg">{message}</p>
        </div>
    );
};

export default LoadingIndicator;
