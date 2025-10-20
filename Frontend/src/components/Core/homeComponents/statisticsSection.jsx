import React, { useEffect, useRef, useState } from 'react';

const Statistics = () => {
  const [counters, setCounters] = useState({
    acres: 0,
    crops: 0,
    units: 0,
    patents: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef(null);

  // Counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          animateCounters();
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = {
      acres: 5000,
      crops: 9,
      units: 50,
      patents: 6
    };

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounters({
        acres: Math.floor(targets.acres * progress),
        crops: Math.floor(targets.crops * progress),
        units: Math.floor(targets.units * progress),
        patents: Math.floor(targets.patents * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, interval);
  };

  return (
    <section id="statistics" ref={statsRef} className="py-32 bg-[#010101] z-10 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Delivering ROI<br />
            to 3000+ farmers
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl">
            Kisan Mitra's AI-powered precision farming technology is tested and proven on real farms across India.
          </p>
        </div>

        {/* Stats Grid with Icons and Vertical Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-24 w-full">
          {/* Stat 1 - Acres Sprayed */}
          <div className="relative border-l-1 border-white/30 pl-8  hover:border-yellow-500 transition-all duration-300 group h-[300px]">
            {/* Icon Circle */}
            <div className="mb-8">
              <div className="w-32 h-32 rounded-full border-2 border-white/30 flex items-center justify-center bg-[#010101] group-hover:border-yellow-500 transition-all duration-300">
                <svg className="w-16 h-16 text-white/30 group-hover:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
                  <path d="M9 3v18M15 3v18M3 9h18M3 15h18" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-6xl md:text-7xl font-bold text-white">
                {counters.acres.toLocaleString()}+
              </div>
              <p className="text-gray-400 text-sm uppercase tracking-wider font-medium">
                ACRES MONITORED
              </p>
            </div>
          </div>

          {/* Stat 2 - Crop Types */}
          <div className="relative border-l-1 border-white/30 pl-8 hover:border-yellow-500 transition-all duration-300 group h-[300px]">
            {/* Icon Circle */}
            <div className="mb-8">
              <div className="w-32 h-32 rounded-full border-2 border-white/30 flex items-center justify-center bg-[#010101] group-hover:border-yellow-500 transition-all duration-300">
                <svg className="w-16 h-16 text-white/30 group-hover:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L14 8L20 9L15 14L17 20L12 17L7 20L9 14L4 9L10 8L12 2Z" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-6xl md:text-7xl font-bold text-white">
                {counters.crops}+
              </div>
              <p className="text-gray-400 text-sm uppercase tracking-wider font-medium">
                CROP TYPES SUPPORTED
              </p>
            </div>
          </div>

          {/* Stat 3 - Units Shipped */}
          <div className="relative border-l-1 border-white/30 pl-8 h-[300px] hover:border-yellow-500 transition-all duration-300 group">
            {/* Icon Circle */}
            <div className="mb-8">
              <div className="w-32 h-32 rounded-full border-2 border-white/30 flex items-center justify-center bg-[#010101] group-hover:border-yellow-500 transition-all duration-300">
                <svg className="w-16 h-16 text-white/30 group-hover:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="8" width="18" height="12" rx="2" strokeWidth="1.5" />
                  <rect x="7" y="4" width="10" height="4" strokeWidth="1.5" />
                  <circle cx="8" cy="18" r="1.5" fill="currentColor" />
                  <circle cx="16" cy="18" r="1.5" fill="currentColor" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-6xl md:text-7xl font-bold text-white">
                {counters.units}+
              </div>
              <p className="text-gray-400 text-sm uppercase tracking-wider font-medium">
                UNITS DEPLOYED
              </p>
            </div>
          </div>

          {/* Stat 4 - Technology Patents */}
          <div className="relative border-l-1 border-white/30 pl-8 h-[300px] hover:border-yellow-500 transition-all duration-300 group">
            {/* Icon Circle */}
            <div className="mb-8">
              <div className="w-32 h-32 rounded-full border-2 border-white/30 flex items-center justify-center bg-[#010101] group-hover:border-yellow-500 transition-all duration-300">
                <svg className="w-16 h-16 text-white/30 group-hover:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                  <path d="M12 6v6l4 2" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-6xl md:text-7xl font-bold text-white">
                {counters.patents}+
              </div>
              <p className="text-gray-400 text-sm uppercase tracking-wider font-medium">
                TECHNOLOGY PATENTS
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
