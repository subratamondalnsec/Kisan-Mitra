import React, { useEffect, useRef, useState } from "react";

const Footer = () => {
  const [curtainHeight, setCurtainHeight] = useState(100);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate curtain opening
            let height = 100;
            const interval = setInterval(() => {
              height -= 2;
              setCurtainHeight(height);
              if (height <= 0) {
                clearInterval(interval);
              }
            }, 20);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <footer
        ref={footerRef}
        className="relative bg-[#010101] text-white overflow-hidden"
      >
        {/* Footer Content */}
        <div className="relative z-10 pl-14 pt-16 pb-12 bg-[#010101]">
          <div className="flex justify-between flex-row-reverse item-center">
            {/* Logo and Description */}
            <div className="px-6 mb-12">
              <div className="flex flex-col justify-between items-start gap-3 md:items-center space-y-8 md:space-y-0">
                <div className="max-w-md">
                  <div className="flex items-center space-x-3 mb">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-full flex items-center justify-center">
                      <img src="/logo.png" alt="" />
                    </div>
                    <div className="text-3xl font-bold text-white">
                      Kisan Mitra
                    </div>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    Empowering farmers with AI-powered intelligence for
                    sustainable and profitable farming
                  </p>
                </div>

                {/* Newsletter */}
                <div className="w-full ">
                  <h3 className="text-white font-semibold mb-3">
                    Stay Updated
                  </h3>
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 md:w-64 bg-gray-800/50 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                    <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 w-[55%] item-start">
              {/* Footer Links Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-4 ">
                {/* Services Column */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Services</h3>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        Mini Loans
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        e-Mandi
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        Crop Insurance
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        Training
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Company Column */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Company</h3>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        About Us
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        Our Team
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        Careers
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        Blog
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Support Column */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Support</h3>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        Contact Us
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        FAQs
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        Community
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Social Media Icons*/}
              <div className="flex justify-start space-x-6">
                {[
                  {
                    name: "Facebook",
                    href: "#",
                    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                  },
                  {
                    name: "Twitter",
                    href: "#",
                    path: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
                  },
                  {
                    name: "Instagram",
                    href: "#",
                    path: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z",
                  },
                  {
                    name: "LinkedIn",
                    href: "#",
                    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="bg-white/30 backdrop-blur-sm p-2 rounded-md hover:bg-yellow-600 transition-all duration-300 transform hover:scale-102"
                    aria-label={social.name}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-[40vh] w-full bg-transparent flex z-10 justify-between items-end py-4">
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 space-y-4 md:space-y-0 w-full px-6">
            <p className="text-black text-sm">
              © 2025 Kisan Mitra. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-black">
              <a href="#" className="">
                Privacy Policy
              </a>
              <a href="#" className="">
                Terms of Service
              </a>
              <a href="#" className="">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
        <div className="fixed bg-gradient-to-r from-[#ab7e03] via-[#cfcfcf] to-[#03844e] -bottom-4 w-full h-[60vh] mx-auto flex justify-center place-items-end-safe z-0">
          <h1 className="text-black text-[19vw] font-bold absolute bottom-0">
            Kisan Mitra
          </h1>
        </div>
      </footer>
    </>
  );
};

export default Footer;
