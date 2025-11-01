import React from 'react';

const DashboardHeader = () => {
    return (
        <header className="gradient-bg text-white shadow-lg">
            <div className="container mx-auto px-6 py-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                        <i className="fas fa-seedling text-4xl"></i>
                        <div>
                            <h1 className="text-3xl font-bold">AgriTech Dashboard</h1>
                            <p className="text-purple-200">Drone-Powered Crop Analysis System</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                            <i className="fas fa-satellite-dish mr-2"></i>
                            <span>Live Monitoring</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
