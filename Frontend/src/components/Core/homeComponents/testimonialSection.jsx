import React, { useRef, useEffect, useState } from 'react';

/**
 * Testimonials - horizontally scrolling testimonial cards
 * Props:
 * - speed: number (pixels per frame), default 0.5
 * - direction: 'left' | 'right', default 'left'
 */
const Testimonials = ({ speed = 0.5, direction = 'left' }) => {
  const scrollerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Punjab",
      avatar: "👨‍🌾",
      text: "Kisan Mitra's AI-powered crop advisory helped me increase my yield by 25%. The drone technology is a game-changer for precision farming!",
      rating: 5
    },
    {
      name: "Priya Sharma",
      location: "Maharashtra",
      avatar: "👩‍🌾",
      text: "Getting instant mini-loans through Kisan Mitra saved my harvest season. The process was transparent and incredibly fast!",
      rating: 5
    },
    {
      name: "Suresh Patel",
      location: "Gujarat",
      avatar: "👨‍🌾",
      text: "The e-Mandi feature helped me get better prices for my produce. I can now compare rates across different markets in real-time.",
      rating: 5
    },
    {
      name: "Lakshmi Devi",
      location: "Karnataka",
      avatar: "👩‍🌾",
      text: "The soil health monitoring with drone technology detected nutrient deficiencies early. My farm productivity improved by 30%!",
      rating: 5
    },
    {
      name: "Vijay Singh",
      location: "Haryana",
      avatar: "👨‍🌾",
      text: "YOLOv8 disease detection caught pest infestation before it spread. Saved lakhs of rupees in potential crop damage!",
      rating: 5
    },
    {
      name: "Anita Reddy",
      location: "Telangana",
      avatar: "👩‍🌾",
      text: "Weather predictions are incredibly accurate. I can plan my farming activities better and reduce input costs significantly.",
      rating: 5
    },
    {
      name: "Ramesh Yadav",
      location: "Uttar Pradesh",
      avatar: "👨‍🌾",
      text: "The multilingual support makes it easy to use. My entire family can now access farming insights in our local language!",
      rating: 5
    },
    {
      name: "Kavita Joshi",
      location: "Rajasthan",
      avatar: "👩‍🌾",
      text: "Smart irrigation recommendations reduced my water usage by 40%. Kisan Mitra is perfect for sustainable farming!",
      rating: 5
    }
  ];

  // Double the testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let animationFrameId;
    const halfWidth = scroller.scrollWidth / 2;

    // Normalize props
    const baseSpeed = Math.max(0, Number(speed) || 0.5);
    const step = direction === 'right' ? -baseSpeed : baseSpeed; // right means content appears to move right, so scrollLeft decreases

    // Initialize starting position based on direction for seamless loop
    if (direction === 'right') {
      scroller.scrollLeft = halfWidth;
    } else if (direction === 'left') {
      scroller.scrollLeft = 0;
    }

    let scrollPosition = scroller.scrollLeft;

    const animate = () => {
      if (!isPaused) {
        scrollPosition += step;

        if (direction === 'left') {
          if (scrollPosition >= halfWidth) {
            scrollPosition = 0;
          }
        } else {
          if (scrollPosition <= 0) {
            scrollPosition = halfWidth;
          }
        }

        scroller.scrollLeft = scrollPosition;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, speed, direction]);

  return (
    <section id="about" className="py-20 bg-[#010101] overflow-hidden z-10 relative">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Farmers Say About Us
          </h2>
          <p className="text-xl text-gray-300">
            Real stories from real farmers using Kisan Mitra
          </p>
        </div>
      </div>
      {/* Scrolling Container */}
      <div className="relative">
        {/* Left gradient overlay */}
        <div className="absolute left-0 top-0 w-44 h-full bg-gradient-to-r from-[#010101] from-30% to-transparent z-10 pointer-events-none"></div>
        
        {/* Right gradient overlay */}
        <div className="absolute right-0 top-0 w-44 h-full bg-gradient-to-l from-[#010101] from-30% to-transparent z-10 pointer-events-none"></div>
        
        <div 
          ref={scrollerRef}
          className="flex space-x-6 overflow-x-hidden"
          style={{ scrollBehavior: 'auto' }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-96 bg-[#010101]/50 backdrop-blur-lg border border-white/30 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 transform"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-5xl">{testimonial.avatar}</div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {testimonial.location}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-300 leading-relaxed">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
