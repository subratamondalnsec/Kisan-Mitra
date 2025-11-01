import React from 'react';

const ErrorMessage = ({ message }) => {
    if (!message) return null;

    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8 animate-fade-in">
            <div className="flex items-center">
                <i className="fas fa-exclamation-circle text-red-500 text-2xl mr-4"></i>
                <div>
                    <h3 className="text-red-800 font-semibold text-lg">Error</h3>
                    <p className="text-red-600">{message}</p>
                </div>
            </div>
        </div>
    );
};

export default ErrorMessage;
