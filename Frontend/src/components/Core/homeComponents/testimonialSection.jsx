import React, { useRef, useEffect, useState } from 'react';
import { testimonialData } from '../../../constants/testimonialData'
/**
 * Testimonials - horizontally scrolling testimonial cards
 * Props:
 * - speed: number (pixels per frame), default 0.5
 * - direction: 'left' | 'right', default 'left'
 */
const Testimonials = ({ speed = 0.5, direction = 'left' }) => {
  const scrollerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const scrollPositionRef = useRef(0);

  // For seamless infinite scroll
  const duplicatedTestimonials = [...testimonialData, ...testimonialData];

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let animationFrameId;
    const halfWidth = scroller.scrollWidth / 2;

    const baseSpeed = Math.max(0, Number(speed) || 0.5);
    const step = direction === 'right' ? -baseSpeed : baseSpeed;

    // Initialize starting position based on direction for seamless loop
    if (direction === 'right') {
      scroller.scrollLeft = halfWidth;
      scrollPositionRef.current = halfWidth;
    } else if (direction === 'left') {
      scroller.scrollLeft = 0;
      scrollPositionRef.current = 0;
    }

    const animate = () => {
      if (!isPausedRef.current) {
        scrollPositionRef.current += step;

        if (direction === 'left') {
          if (scrollPositionRef.current >= halfWidth) {
            scrollPositionRef.current = 0;
          }
        } else {
          if (scrollPositionRef.current <= 0) {
            scrollPositionRef.current = halfWidth;
          }
        }

        scroller.scrollLeft = scrollPositionRef.current;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, direction]);

  return (
    <section id="about" className="py-32 bg-primary overflow-hidden z-10 relative">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="mb-10">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-400 mb-2">
            What <span className='stroke-text1'>Farmers</span> <span className='stroke-text2'>Say</span> About Us
          </h2>
          <p className="text-xl text-gray-400">
            Real stories from real farmers using Kisan Mitra
          </p>
        </div>
      </div>
      {/* Scrolling Container */}
      <div 
        className="relative"
        onMouseEnter={() => {
          isPausedRef.current = true;
          setIsPaused(true);
        }}
        onMouseLeave={() => {
          isPausedRef.current = false;
          setIsPaused(false);
        }}
      >
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
              className="flex-shrink-0 w-96 bg-[#010101]/50 backdrop-blur-lg border border-white/30 rounded-2xl p-6 hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-5xl">{testimonial.avatar}</div>
                <div className="flex-1">
                  <h4 className="text-gray-400 font-bold text-lg">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm flex items-center">
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
              <p className="text-gray-400 leading-relaxed">
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
