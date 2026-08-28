import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  // Individual refs for each heading
  const modernRef = useRef(null);
  const farmingRef = useRef(null);
  const solutionsRef = useRef(null);
  const withRef = useRef(null);
  const modernTechRef = useRef(null);
  const technologyRef = useRef(null);
  const droneRef = useRef(null);
  const cardsRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Scroll-based parallax
      const scrollY = window.scrollY;
      const scrollProgress = Math.min(scrollY / (window.innerHeight * 0.8), 1);

      console.log("Scroll Y:", scrollY, "Progress:", scrollProgress);

      if (scrollProgress > 0) {
        // 1st heading - MODERN (moves first, fastest)
        if (modernRef.current) {
          const adjustedProgress = Math.max(0, scrollProgress);
          const y = -30 * adjustedProgress;
          const x = -15 * adjustedProgress;
          const opacity = Math.max(0.4, 1 - (0.4 * adjustedProgress));
          modernRef.current.style.setProperty('transform', `translate(${x}px, ${y}px)`, 'important');
          modernRef.current.style.setProperty('opacity', opacity, 'important');
        }

        // 2nd heading - FARMING
        if (farmingRef.current) {
          const adjustedProgress = Math.max(0, scrollProgress * 0.8);
          const y = -25 * adjustedProgress;
          const x = -12 * adjustedProgress;
          const opacity = Math.max(0.5, 1 - (0.3 * adjustedProgress));
          farmingRef.current.style.setProperty('transform', `translate(${x}px, ${y}px)`, 'important');
          farmingRef.current.style.setProperty('opacity', opacity, 'important');
        }

        // 3rd heading - SOLUTIONS (more delay effect)
        if (solutionsRef.current) {
          const adjustedProgress = Math.max(0, scrollProgress * 0.6);
          const y = -20 * adjustedProgress;
          const x = -10 * adjustedProgress;
          const opacity = Math.max(0.6, 1 - (0.2 * adjustedProgress));
          solutionsRef.current.style.setProperty('transform', `translate(${x}px, ${y}px)`, 'important');
          solutionsRef.current.style.setProperty('opacity', opacity, 'important');
        }

        // Right side headings with cascading
        
        // 4th heading - WITH 
        if (withRef.current) {
          const adjustedProgress = Math.max(0, scrollProgress * 0.9);
          const y = -28 * adjustedProgress;
          const x = 14 * adjustedProgress;
          const opacity = Math.max(0.4, 1 - (0.4 * adjustedProgress));
          withRef.current.style.setProperty('transform', `translate(${x}px, ${y}px)`, 'important');
          withRef.current.style.setProperty('opacity', opacity, 'important');
        }

        // 5th heading - MODERN (tech) 
        if (modernTechRef.current) {
          const adjustedProgress = Math.max(0, scrollProgress * 0.7);
          const y = -22 * adjustedProgress;
          const x = 11 * adjustedProgress;
          const opacity = Math.max(0.5, 1 - (0.3 * adjustedProgress));
          modernTechRef.current.style.setProperty('transform', `translate(${x}px, ${y}px)`, 'important');
          modernTechRef.current.style.setProperty('opacity', opacity, 'important');
        }

        // 6th heading - TECHNOLOGY (moves last)
        if (technologyRef.current) {
          const adjustedProgress = Math.max(0, scrollProgress * 0.5);
          const y = -18 * adjustedProgress;
          const x = 9 * adjustedProgress;
          const opacity = Math.max(0.6, 1 - (0.2 * adjustedProgress));
          technologyRef.current.style.setProperty('transform', `translate(${x}px, ${y}px)`, 'important');
          technologyRef.current.style.setProperty('opacity', opacity, 'important');
        }

        // Drone parallax
        if (droneRef.current) {
          const y = -80 * scrollProgress;
          const scale = 1 + (0.08 * scrollProgress);
          const opacity = Math.max(0.4, 1 - (0.6 * scrollProgress));
          droneRef.current.style.setProperty('transform', `translateY(${y}px) scale(${scale})`, 'important');
          droneRef.current.style.setProperty('opacity', opacity, 'important');
        }

        // Cards parallax - opacity reduces with scrolling
        if (cardsRef.current) {
          const y = -80 * scrollProgress;
          const scale = Math.max(0.95, 1 - (0.05 * scrollProgress));
          cardsRef.current.style.setProperty('transform', `translateY(${y}px) scale(${scale})`, 'important');
        }

        // Overlay parallax
        // if (overlayRef.current) {
        //   const opacity = 0.5 + (0.3 * scrollProgress);
        //   overlayRef.current.style.setProperty('opacity', opacity, 'important');
        // }

        // Background parallax
        if (heroRef.current) {
          const backgroundY = 50 * scrollProgress;
          heroRef.current.style.setProperty('background-position', `center ${backgroundY}%`, 'important');
        }
      }
    };

    // Use requestAnimationFrame for smooth performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Test if refs are connected
    console.log("Refs check:", {
      modern: !!modernRef.current,
      farming: !!farmingRef.current,
      solutions: !!solutionsRef.current,
      with: !!withRef.current,
      modernTech: !!modernTechRef.current,
      technology: !!technologyRef.current
    });

    window.addEventListener('scroll', onScroll);
    handleScroll(); // Initial call

    // Cleanup
    return () => {
      window.removeEventListener('scroll', onScroll);
      // Reset styles on cleanup for individual headings
      [modernRef, farmingRef, solutionsRef, withRef, modernTechRef, technologyRef].forEach(ref => {
        if (ref.current) {
          ref.current.style.transform = '';
          ref.current.style.opacity = '';
        }
      });
      
      // Reset other elements
      if (droneRef.current) {
        droneRef.current.style.transform = '';
        droneRef.current.style.opacity = '';
      }
      if (cardsRef.current) {
        cardsRef.current.style.transform = '';
        cardsRef.current.style.opacity = '';
      }
      if (overlayRef.current) {
        overlayRef.current.style.opacity = '';
      }
      if (heroRef.current) {
        heroRef.current.style.backgroundPosition = '';
      }
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="fixed top-0 min-h-screen w-full flex items-center justify-center pt-15 z-1"
      style={{
        backgroundImage: "url(/kisan-bg.avif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div ref={overlayRef} className="absolute inset-0 bg-gradient-to-r from-[#010101]/50 via-[#010101]/10 to-[#010101]/50"></div>

      {/* Drone Image */}
      <div ref={droneRef} className="fixed -top-10 left-1/2 transform -translate-x-1/2 w-full z-2">
        <img src="/Drone11.png" alt="Drone Image" className="w-full h-full" />
      </div>

      <div className="hero-title relative z-10 max-w-full mx-auto px-12 w-full">
        {/* Upper Text Title */}
        <div className="grid md:grid-cols-2 gap-12 mt-10 items-center">
          {/* Left Side - Text */}
          <div className="space-y-2 text-4xl md:text-7xl font-bold">
            <h1 ref={modernRef} className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400/40 to-gray-400 leading-tighter opacity-0 animate-[fade-in_1s_ease-out_forwards]">
              SMART
            </h1>
            <h2 ref={farmingRef} className="leading-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400/40 to-emerald-400 opacity-0 animate-[fade-in_1s_ease-out_0.2s_forwards]">
              FARMING
            </h2>
            <h3 ref={solutionsRef} className=" text-transparent leading-tighter bg-clip-text bg-gradient-to-r from-yellow-400/40 to-yellow-400 opacity-0 animate-[fade-in_1s_ease-out_0.4s_forwards]">
              SOLUTIONS
            </h3>
          </div>

          {/* Right Side - Text */}
          <div className="space-y-2 text-right text-4xl md:text-7xl font-bold">
            <h1 ref={withRef} className="text-transparent bg-clip-text bg-gradient-to-l from-gray-400/40 to-gray-400 leading-tighter opacity-0 animate-[fade-in_1s_ease-out_forwards]">
              WITH
            </h1>
            <h2 ref={modernTechRef} className=" text-transparent leading-tighter bg-clip-text bg-gradient-to-l from-yellow-500/40 to-yellow-500 opacity-0 animate-[fade-in_1s_ease-out_0.4s_forwards]">
              MODERN
            </h2>
            <h3 ref={technologyRef} className="leading-tighter text-transparent bg-clip-text bg-gradient-to-l from-emerald-400/40 to-emerald-400 opacity-0 animate-[fade-in_1s_ease-out_0.2s_forwards]">
              TECHNOLOGY
            </h3>
          </div>
        </div>

        {/* Cards Section */}
        <div ref={cardsRef} className="flex justify-between items-center mt-26 pb-6 w-full">
          {/* Left cards */}
          <div className="flex justify-start items-end w-full gap-4">
            {/* Growth Rate Card */}
            <div className="bg-white/10 backdrop-blur-xs border border-white/40 rounded-3xl p-4 h-72 w-84 opacity-0 animate-[fade-in_1s_ease-out_0.6s_forwards]">
              <div className="mb-2">
                <p className="text-gray-400 text-md">Growth rate</p>
                <div className="flex items-center space-x-1">
                  <span className="text-3xl font-bold text-emerald-600">
                    0.66
                  </span>
                  <svg
                    className="w-4 h-4 text-emerald-600"
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
                  { day: "Su", height: "36%" },
                  { day: "Mo", height: "46%" },
                  { day: "Tu", height: "55%" },
                  { day: "We", height: "70%" },
                  { day: "Th", height: "65%" },
                  { day: "Fr", height: "78%" },
                  { day: "Sa", height: "93%" },
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
                    <span className="text-md text-gray-300">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Center Image Card */}
            <div className="bg-gray-200/50 backdrop-blur-sm border border-white/70 rounded-3xl w-64 p-2 opacity-0 animate-[fade-in_1s_ease-out_0.7s_forwards]">
              <div
                className="rounded-2xl border border-white/70 overflow-hidden h-82 flex justify-center items-end p-4"
                style={{
                  backgroundImage: "url(/farmer.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                }}
              >
                <button 
                onClick={() => navigate('/auth')}
                className="bg-[#0B1319] text-gray-400 px-6 py-2 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-md shadow-black/40">
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
          <div className="bg-gray-200/10 backdrop-blur-xs border border-white/40 rounded-3xl p-4 h-84 w-144 opacity-0 animate-[fade-in_1s_ease-out_0.9s_forwards]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-md mb-1 flex items-center">
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
                  <span className="text-5xl font-bold text-gray-300/80">+25°C</span>
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
                <div className="flex items-center space-x-4 mt-2 text-md text-gray-400">
                  <span>H: 20°C</span>
                  <span>L: 20°C</span>
                </div>
              </div>
            </div>

            {/* Weather Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white/10 backdrop-blur-xs border border-white/40 rounded-xl p-3">
                <p className="text-gray-200 text-sm mb-1">Humidity</p>
                <p className="text-2xl font-bold text-gray-300">40%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs border border-white/40 rounded-xl p-3">
                <p className="text-gray-200 text-sm mb-1">Precipitation</p>
                <p className="text-2xl font-bold text-gray-300">9.5 ml</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs border border-white/40 rounded-xl p-3">
                <p className="text-gray-200 text-sm mb-1">Pressure</p>
                <p className="text-2xl font-bold text-gray-300">450 hPa</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs border border-white/40 rounded-xl p-3">
                <p className="text-gray-200 text-sm mb-1">Wind</p>
                <p className="text-2xl font-bold text-gray-300">23 m/s</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
