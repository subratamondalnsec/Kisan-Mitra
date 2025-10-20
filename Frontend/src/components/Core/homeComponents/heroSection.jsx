import React from "react";

const HeroSection = () => {
  return (
    <section
    id="hero"
      className="min-h-screen flex items-center justify-center relative pt-15 z-10"
      style={{
        backgroundImage: "url(/bg-image.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#010101]/50 via-[#010101]/10 to-[#010101]/50"></div>

      <div className="hero-title relative z-10 max-w-full mx-auto px-12 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text */}
          <div className="space-y-8">
            <div className="space-y-4 text-4xl md:text-7xl font-bold">
              <h1 className=" text-white leading-tight opacity-0 animate-[fade-in_1s_ease-out_forwards]">
                MODERN
              </h1>
              <h2 className=" text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 animate-[fade-in_1s_ease-out_0.2s_forwards]">
                FARMING
              </h2>
              <h3 className=" text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600 opacity-0 animate-[fade-in_1s_ease-out_0.4s_forwards]">
                SOLUTIONS
              </h3>
            </div>
          </div>

          {/* Right Side - Text */}
          <div className="space-y-8">
            <div className="space-y-4 text-right text-4xl md:text-7xl font-bold">
              <h1 className=" text-white leading-tight opacity-0 animate-[fade-in_1s_ease-out_0.3s_forwards]">
                WITH
              </h1>
              <h2 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600 opacity-0 animate-[fade-in_1s_ease-out_0.5s_forwards]">
                MODERN
              </h2>
              <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 animate-[fade-in_1s_ease-out_0.7s_forwards]">
                TECHNOLOGY
              </h3>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="flex justify-between items-center mt-30 pb-6 w-full">
          <div className="flex justify-start items-end w-full gap-4">
            {/* Growth Rate Card */}
            <div className="bg-white/10 backdrop-blur-xs border border-white/40 rounded-3xl p-4 h-72 w-84 opacity-0 animate-[fade-in_1s_ease-out_0.6s_forwards]">
              <div className="mb-2">
                <p className="text-gray-200 text-md mb-1">Growth rate</p>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-green-400">0.66</span>
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="flex items-end justify-between space-x-2">
                {[
                  { day: "Su", height: "60%" },
                  { day: "Mo", height: "50%" },
                  { day: "Tu", height: "85%" },
                  { day: "We", height: "70%" },
                  { day: "Th", height: "95%" },
                  { day: "Fr", height: "65%" },
                  { day: "Sa", height: "55%" },
                ].map((bar, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1 gap-1"
                  >
                    <div className="w-full h-40 flex items-end justify-center">
                      <div
                        className="w-full border border-white/70 bg-gradient-to-b from-yellow-400/80 to-white/60 rounded-full"
                        style={{ height: bar.height }}
                      ></div>
                    </div>
                    <span className="text-md text-gray-200">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Center Image Card */}
            <div className="bg-white/50 backdrop-blur-sm border border-white/70 rounded-3xl w-72 p-2 opacity-0 animate-[fade-in_1s_ease-out_0.7s_forwards]">
              <div
                className="rounded-2xl border border-white/70 overflow-hidden h-82 flex justify-center items-end p-4"
                style={{
                  backgroundImage: "url(/farmer.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                }}
              >
                <button className="bg-[#0B1319] text-white px-6 py-2 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-md shadow-black/40">
                  <span>Get Started</span>
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Weather Card */}
          <div className="bg-white/10 backdrop-blur-xs border border-white/40 rounded-3xl p-4 h-84 w-154 opacity-0 animate-[fade-in_1s_ease-out_0.9s_forwards]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-300 text-md mb-1 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Kolkata, West Bengal, India
                </p>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-5xl font-bold text-white">+20°C</span>
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-md text-gray-300">
                  <span>H: 20°C</span>
                  <span>L: 20°C</span>
                </div>
              </div>
            </div>

            {/* Weather Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white/20 backdrop-blur-xs border border-white/40 rounded-xl p-3">
                <p className="text-gray-100 text-sm mb-1">Humidity</p>
                <p className="text-2xl font-bold text-white">40%</p>
              </div>
              <div className="bg-white/20 backdrop-blur-xs border border-white/40 rounded-xl p-3">
                <p className="text-gray-100 text-sm mb-1">Precipitation</p>
                <p className="text-2xl font-bold text-white">9.5 ml</p>
              </div>
              <div className="bg-white/20 backdrop-blur-xs border border-white/40 rounded-xl p-3">
                <p className="text-gray-100 text-sm mb-1">Pressure</p>
                <p className="text-2xl font-bold text-white">450 hPa</p>
              </div>
              <div className="bg-white/20 backdrop-blur-xs border border-white/40 rounded-xl p-3">
                <p className="text-gray-100 text-sm mb-1">Wind</p>
                <p className="text-2xl font-bold text-white">23 m/s</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
