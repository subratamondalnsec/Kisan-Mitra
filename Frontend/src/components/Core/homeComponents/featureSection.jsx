import React from 'react';

const Features = () => {
  return (
    <section id="features" className="py-20 bg-[#010101] z-10 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Optional: Add a section header */}
        <div className=" mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Smart Farming Features
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl">
            Comprehensive AI-powered tools to revolutionize your farming operations
          </p>
        </div>

        {/* Bento Box Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-fr">
          {/* Feature 1 - Large Card (spans 2 columns, 2 rows) */}
          <div className="md:col-span-3 md:row-span-2 p-8 bg-gray-900/30 backdrop-blur-lg border border-white/30 rounded-3xl hover:border-green-500/50 transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="flex flex-col h-full">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                🛸
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Drone + NPK Intelligence
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg flex-grow">
                Zone-wise soil nutrients and aerial crop-health insights using
                YOLOv8 for early disease detection and precise interventions.
              </p>
              <div className="mt-6 flex items-center text-green-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span>Learn more</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Feature 2 - Medium Card (spans 2 columns) */}
          <div className="md:col-span-3 p-8 bg-gray-900/30 backdrop-blur-lg border border-white/30 rounded-3xl hover:border-green-500/50 transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="flex flex-col h-full">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                🤖
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                AI-Powered Advisories
              </h3>
              <p className="text-gray-300 leading-relaxed">
                ML-driven crop recommendations based on farm signals, weather
                data, and real-time diagnostics with one-tap treatment plans.
              </p>
            </div>
          </div>

          {/* Feature 3 - Small Card */}
          <div className="md:col-span-2 p-8 bg-gray-900/30 backdrop-blur-lg border border-white/30 rounded-3xl hover:border-green-500/50 transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="flex flex-col h-full">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                💰
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Smart Mini-Loans
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Instant micro-credit scoring using land records and farm
                telemetry for quick finance access.
              </p>
            </div>
          </div>

          {/* Feature 4 - Small Card */}
          <div className="md:col-span-1 p-8 bg-gray-900/30 backdrop-blur-lg border border-white/30 rounded-3xl hover:border-green-500/50 transition-all duration-300 transform hover:-translate-y-2 group flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
              🌾
            </div>
            <h3 className="text-xl font-bold text-white">
              e-Mandi Linkage
            </h3>
          </div>
        </div>

        {/* Additional Feature Details for Feature 4 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="md:col-span-1 p-8 bg-gray-900/30 backdrop-blur-lg border border-white/30 rounded-3xl hover:border-green-500/50 transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="flex items-start space-x-6">
              <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">🏛️</div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  PM Schemes for Kisans/Farmers
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Explore central government schemes like PM-KISAN, PMFBY (crop insurance),
                  KCC, Soil Health Card and more — with clear eligibility, benefits,
                  required documents, and step-by-step application guidance in your language.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
