import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import Testimonials from "./homeComponents/testimonialSection";
import Footer from "./homeComponents/footer";
import Statistics from "./homeComponents/statisticsSection";
import Features from "./homeComponents/featureSection";
import Navbar from "./homeComponents/navbar";
import HeroSection from "./homeComponents/heroSection";

const HomePage = () => {
  const [counters, setCounters] = useState({
    acres: 0,
    savings: 0,
    loans: 0,
    solutions: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef(null);

  // Smooth scroll with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          animateCounters();
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
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
      savings: 30,
      loans: 1000,
      solutions: 4,
    };

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounters({
        acres: Math.floor(targets.acres * progress),
        savings: Math.floor(targets.savings * progress),
        loans: Math.floor(targets.loans * progress),
        solutions: Math.floor(targets.solutions * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, interval);
  };

  return (
    <div className="bg-white overflow-hidden scroll-smooth">
      <Navbar />
      <HeroSection />
      <Statistics ref={statsRef} />
      <Features />
      <Testimonials speed={0.4} direction="left" />
      <Footer />
    </div>
  );
};

export default HomePage;
