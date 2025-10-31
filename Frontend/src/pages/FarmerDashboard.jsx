import { useMemo } from "react";
import FarmerNavbar from "../components/Common/FarmerNavbar";
import { useDarkMode } from "../contexts/DarkModeContext";

const FarmerDashboard = () => {
  const { isDarkMode } = useDarkMode();

  const cropPrices = useMemo(
    () => [
      { name: "Rice", price: 32.5, unit: "kg", change: 5 },
      { name: "Wheat", price: 28.3, unit: "kg", change: -2 },
      { name: "Tomato", price: 18.9, unit: "kg", change: 8 },
      { name: "Potato", price: 22.1, unit: "kg", change: 3 },
      { name: "Onion", price: 26.0, unit: "kg", change: -4 },
      { name: "Maize", price: 24.7, unit: "kg", change: 2 },
    ],
    []
  );

  const schemes = useMemo(
    () => [
      {
        name: "Pradhan Mantri Kisan Samman Nidhi (PM-Kisan)",
        desc: "Direct income support for small and marginal farmers.",
        url: "https://pmkisan.gov.in/",
      },
      {
        name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        desc: "Crop insurance for yield protection.",
        url: "https://pmfby.gov.in/",
      },
      {
        name: "e-NAM (National Agriculture Market)",
        desc: "Unified online agri-market.",
        url: "https://enam.gov.in/",
      },
      {
        name: "Kisan Suvidha",
        desc: "Weather, market rates, and scheme information.",
        url: "https://kisansuvidha.gov.in/",
      },
      {
        name: "National Mission on Natural Farming (NMNF)",
        desc: "Promotes sustainable natural farming.",
        url: "https://naturalfarming.dac.gov.in/",
      },
      {
        name: "Farmer Producer Organization (FPO) Scheme",
        desc: "Support for forming farmer collectives.",
        url: "https://sfacindia.com/FPOS.aspx",
      },
      {
        name: "MyScheme Portal",
        desc: "Search and apply for government schemes.",
        url: "https://www.myscheme.gov.in/",
      },
    ],
    []
  );

  const cropCondition = {
    health: "Good",
    soilMoisture: 58,
    soilPH: 6.8,
    soilType: "Loamy",
    temperature: 28,
    humidity: 72,
    rainfall: "Moderate",
    lastIrrigation: "2 days ago",
    fertilizer: "Applied 1 week ago",
    pestControl: "No pests detected",
    cropStage: "Vegetative Growth",
    expectedHarvest: "45 days",
    weatherAlerts: ["Light rain expected in 24h", "High humidity levels", "Optimal temperature for growth"],
  };

  const loanStatus = {
    totalAmount: 50000,
    remainingAmount: 18500,
    nextDueDate: "2025-11-15",
    loanType: "Kisan Credit Card",
    interestRate: 7,
    emiAmount: 2850,
    loanStartDate: "2024-06-01",
    tenure: 24,
    completedEMIs: 11,
    remainingEMIs: 13,
    lastPaymentDate: "2025-10-01",
    creditScore: 100,
  };

  const repaymentProgress = Math.round(
    ((loanStatus.totalAmount - loanStatus.remainingAmount) / loanStatus.totalAmount) * 100
  );

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-white to-cyan-50"
      }`}
    >
      <div
        className={`absolute inset-0 -z-10 transition-all duration-300 ${
          isDarkMode
            ? "bg-gradient-to-r from-slate-900/50 via-transparent to-gray-900/50"
            : "bg-gradient-to-r from-blue-50/50 via-transparent to-cyan-50/50"
        }`}
        aria-hidden="true"
      />

      <div className="relative z-[100]">
        <FarmerNavbar />
      </div>

      <div className="fixed top-24 right-4 z-[90]">
        <div
          className={`px-4 py-3 rounded-xl shadow-md border backdrop-blur-md ${
            isDarkMode
              ? "bg-emerald-700/30 border-emerald-500/40 text-emerald-200"
              : "bg-emerald-100 border-emerald-200 text-emerald-700"
          }`}
          role="status"
          aria-label="Credit score"
        >
          <div className="text-xs font-semibold opacity-80">Credit Score</div>
          <div className="text-2xl font-bold tracking-wide">100</div>
        </div>
      </div>

      <div className="relative z-10 pt-8 pb-12 px-4 overflow-x-hidden">
        <div className="max-w-7xl mx-auto min-w-0">
          <header className="mb-8">
            <h1
              className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${
                isDarkMode ? "from-blue-400 to-cyan-400" : "from-blue-600 to-cyan-600"
              }`}
            >
              🌾 Farmer Dashboard
            </h1>
          </header>

          <div className="flex gap-6 lg:flex-row flex-col">
            <div className="flex-1 min-w-0 space-y-8">
              <section aria-labelledby="best-crop-prices">
            <div className="flex items-center justify-between mb-3">
              <h2 id="best-crop-prices" className={isDarkMode ? "text-white text-xl font-semibold" : "text-gray-800 text-xl font-semibold"}>
                Best Crop Prices
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isDarkMode
                    ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                    : "bg-blue-100 text-blue-700 border border-blue-200"
                }`}
              >
                Live Data
              </span>
            </div>

            <div className="relative overflow-hidden">
              <div className="flex gap-4 animate-scroll">
                {[...cropPrices, ...cropPrices].map((c, index) => {
                  const up = c.change >= 0;
                  return (
                    <div
                      key={`${c.name}-${index}`}
                      className={`flex-shrink-0 w-72 border rounded-lg p-4 transition-all duration-300 hover:shadow-md transform hover:scale-[1.01] backdrop-blur-md ${
                        isDarkMode
                          ? "bg-gray-800/70 border-gray-600 hover:bg-gray-800/90"
                          : "bg-white/80 border-gray-200 hover:bg-white"
                      }`}
                      role="article"
                      aria-label={`${c.name} price card`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={isDarkMode ? "text-white font-semibold" : "text-gray-800 font-semibold"}>{c.name}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${
                            up
                              ? isDarkMode
                                ? "bg-green-600/20 text-green-300 border-green-500/30"
                                : "bg-green-100 text-green-700 border-green-200"
                              : isDarkMode
                              ? "bg-red-600/20 text-red-300 border-red-500/30"
                              : "bg-red-100 text-red-700 border-red-200"
                          }`}
                          aria-label={`Change ${up ? "up" : "down"} ${Math.abs(c.change)} percent from last week`}
                        >
                          {up ? "▲" : "▼"} {Math.abs(c.change)}%
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className={isDarkMode ? "text-emerald-300" : "text-emerald-700"}>
                          <div className="text-2xl font-bold">₹{c.price.toFixed(1)}</div>
                          <div className={isDarkMode ? "text-gray-300 text-xs" : "text-gray-600 text-xs"}>per {c.unit}</div>
                        </div>
                        <div className={isDarkMode ? "text-gray-300 text-sm" : "text-gray-600 text-sm"}>Updated today</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section aria-labelledby="status-section" className="min-w-0">
            <h2 id="status-section" className={isDarkMode ? "text-white text-xl font-semibold mb-3" : "text-gray-800 text-xl font-semibold mb-3"}>
              Crop & Loan Status
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-w-0">
              <div
                className={`border rounded-xl p-5 backdrop-blur-md min-w-0 overflow-hidden ${
                  isDarkMode ? "bg-gray-800/80 border-gray-600" : "bg-white/80 border-gray-300"
                }`}
              >
                <h3 className={isDarkMode ? "text-white font-semibold mb-4" : "text-gray-800 font-semibold mb-4"}>Crop Condition</h3>
                <div className="space-y-3 text-sm min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} flex-shrink-0`}>Overall Health</span>
                    <span className={isDarkMode ? "text-emerald-300 font-semibold" : "text-emerald-700 font-semibold"}>{cropCondition.health}</span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2">
                    <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} flex-shrink-0`}>Crop Stage</span>
                    <span className={isDarkMode ? "text-blue-300 font-medium" : "text-blue-700 font-medium"}>{cropCondition.cropStage}</span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2">
                    <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} flex-shrink-0`}>Expected Harvest</span>
                    <span className={isDarkMode ? "text-gray-200 font-medium" : "text-gray-800 font-medium"}>{cropCondition.expectedHarvest}</span>
                  </div>

                  <div className={isDarkMode ? "border-t border-gray-600 pt-3" : "border-t border-gray-300 pt-3"}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} flex-shrink-0`}>Soil Moisture</span>
                      <span className={isDarkMode ? "text-gray-200 font-medium" : "text-gray-800 font-medium"}>{cropCondition.soilMoisture}%</span>
                    </div>
                    <div className={isDarkMode ? "bg-gray-700 h-2 rounded-full" : "bg-gray-200 h-2 rounded-full"}>
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: `${cropCondition.soilMoisture}%` }}
                        aria-label="Soil moisture level"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-xs mb-1`}>Soil pH</div>
                      <div className={isDarkMode ? "text-gray-200 font-medium" : "text-gray-800 font-medium"}>{cropCondition.soilPH}</div>
                    </div>
                    <div>
                      <div className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-xs mb-1`}>Soil Type</div>
                      <div className={isDarkMode ? "text-gray-200 font-medium" : "text-gray-800 font-medium"}>{cropCondition.soilType}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-xs mb-1`}>Temperature</div>
                      <div className={isDarkMode ? "text-gray-200 font-medium" : "text-gray-800 font-medium"}>{cropCondition.temperature}°C</div>
                    </div>
                    <div>
                      <div className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-xs mb-1`}>Humidity</div>
                      <div className={isDarkMode ? "text-gray-200 font-medium" : "text-gray-800 font-medium"}>{cropCondition.humidity}%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-xs mb-1`}>Rainfall</div>
                      <div className={isDarkMode ? "text-gray-200 font-medium" : "text-gray-800 font-medium"}>{cropCondition.rainfall}</div>
                    </div>
                    <div>
                      <div className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-xs mb-1`}>Last Irrigation</div>
                      <div className={isDarkMode ? "text-gray-200 font-medium" : "text-gray-800 font-medium"}>{cropCondition.lastIrrigation}</div>
                    </div>
                  </div>

                  <div className={isDarkMode ? "border-t border-gray-600 pt-3" : "border-t border-gray-300 pt-3"}>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} flex-shrink-0`}>Fertilizer Status</span>
                      <span className={isDarkMode ? "text-gray-200 text-xs" : "text-gray-800 text-xs"}>{cropCondition.fertilizer}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} flex-shrink-0`}>Pest Control</span>
                      <span className={isDarkMode ? "text-emerald-300 text-xs font-medium" : "text-emerald-700 text-xs font-medium"}>{cropCondition.pestControl}</span>
                    </div>
                  </div>

                  <div className={isDarkMode ? "border-t border-gray-600 pt-3" : "border-t border-gray-300 pt-3"}>
                    <div className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-2 font-medium`}>Weather Alerts</div>
                    <ul className="space-y-1">
                      {cropCondition.weatherAlerts.map((w, idx) => (
                        <li key={idx} className={`flex items-start gap-2 ${isDarkMode ? "text-gray-200" : "text-gray-800"} text-xs`}>
                          <span className={isDarkMode ? "text-blue-400" : "text-blue-600"}>•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-xl p-5 backdrop-blur-md min-w-0 overflow-hidden ${
                  isDarkMode ? "bg-gray-800/80 border-gray-600" : "bg-white/80 border-gray-300"
                }`}
              >
                <h3 className={isDarkMode ? "text-white font-semibold mb-4" : "text-gray-800 font-semibold mb-4"}>Loan Status</h3>
                <div className="space-y-3 text-sm min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} flex-shrink-0`}>Loan Type</span>
                    <span className={isDarkMode ? "text-blue-300 font-medium" : "text-blue-700 font-medium"}>{loanStatus.loanType}</span>
                  </div>

                  <div className={isDarkMode ? "border-t border-gray-600 pt-3" : "border-t border-gray-300 pt-3"}>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} flex-shrink-0`}>Total Loan Amount</span>
                      <span className={`${isDarkMode ? "text-gray-100 font-semibold" : "text-gray-900 font-semibold"} text-right`}>₹{loanStatus.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} flex-shrink-0`}>Amount Remaining</span>
                      <span className={`${isDarkMode ? "text-orange-300 font-semibold" : "text-orange-700 font-semibold"} text-right`}>₹{loanStatus.remainingAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} flex-shrink-0`}>Repayment Progress</span>
                      <span className={isDarkMode ? "text-gray-200 font-medium" : "text-gray-800 font-medium"}>{repaymentProgress}%</span>
                    </div>
                    <div className={isDarkMode ? "bg-gray-700 h-2 rounded-full" : "bg-gray-200 h-2 rounded-full"}>
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{ width: `${repaymentProgress}%` }}
                        aria-label="Repayment progress"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-xs mb-1`}>Interest Rate</div>
                      <div className={isDarkMode ? "text-gray-200 font-medium" : "text-gray-800 font-medium"}>{loanStatus.interestRate}% p.a.</div>
                    </div>
                    <div>
                      <div className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-xs mb-1`}>EMI Amount</div>
                      <div className={isDarkMode ? "text-gray-200 font-medium" : "text-gray-800 font-medium"}>₹{loanStatus.emiAmount.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-xs mb-1`}>Tenure</div>
                      <div className={isDarkMode ? "text-gray-200 font-medium" : "text-gray-800 font-medium"}>{loanStatus.tenure} months</div>
                    </div>
                    <div>
                      <div className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-xs mb-1`}>Loan Start</div>
                      <div className={isDarkMode ? "text-gray-200 font-medium" : "text-gray-800 font-medium"}>{new Date(loanStatus.loanStartDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</div>
                    </div>
                  </div>

                  <div className={isDarkMode ? "border-t border-gray-600 pt-3" : "border-t border-gray-300 pt-3"}>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} flex-shrink-0`}>Completed EMIs</span>
                      <span className={isDarkMode ? "text-emerald-300 font-medium" : "text-emerald-700 font-medium"}>{loanStatus.completedEMIs} / {loanStatus.tenure}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} flex-shrink-0`}>Remaining EMIs</span>
                      <span className={isDarkMode ? "text-gray-200 font-medium" : "text-gray-800 font-medium"}>{loanStatus.remainingEMIs}</span>
                    </div>
                  </div>

                  <div className={isDarkMode ? "border-t border-gray-600 pt-3" : "border-t border-gray-300 pt-3"}>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} flex-shrink-0`}>Next Due Date</span>
                      <time className={`${isDarkMode ? "text-orange-300 font-semibold" : "text-orange-700 font-semibold"} text-right`} dateTime={loanStatus.nextDueDate}>
                        {new Date(loanStatus.nextDueDate).toLocaleDateString()}
                      </time>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} flex-shrink-0`}>Last Payment</span>
                      <time className={`${isDarkMode ? "text-gray-200 font-medium" : "text-gray-800 font-medium"} text-right`} dateTime={loanStatus.lastPaymentDate}>
                        {new Date(loanStatus.lastPaymentDate).toLocaleDateString()}
                      </time>
                    </div>
                  </div>

                  <div className={`${isDarkMode ? "bg-emerald-900/30 border border-emerald-700/30" : "bg-emerald-50 border border-emerald-200"} rounded-lg p-3`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`${isDarkMode ? "text-emerald-300" : "text-emerald-700"} font-medium`}>Credit Score</span>
                      <span className={`${isDarkMode ? "text-emerald-200" : "text-emerald-800"} text-lg font-bold`}>{loanStatus.creditScore}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
            </div>

            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-hide">
                <section aria-labelledby="gov-schemes">
                  <h2 id="gov-schemes" className={isDarkMode ? "text-white text-xl font-semibold mb-3" : "text-gray-800 text-xl font-semibold mb-3"}>
                    Government Schemes
                  </h2>

                  <div className="space-y-3">
                    {schemes.map((s) => (
                      <div
                        key={s.name}
                        className={`border rounded-xl p-4 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.01] backdrop-blur-md ${
                          isDarkMode
                            ? "bg-gray-800/80 border-gray-600 hover:bg-gray-800/90"
                            : "bg-white/80 border-gray-300 hover:bg-white"
                        }`}
                        role="article"
                        aria-label={`${s.name} scheme card`}
                      >
                        <h3 className={isDarkMode ? "text-white font-semibold text-sm mb-2" : "text-gray-800 font-semibold text-sm mb-2"}>{s.name}</h3>
                        <p className={isDarkMode ? "text-gray-300 text-xs mb-3" : "text-gray-600 text-xs mb-3"}>{s.desc}</p>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                          aria-label={`Open official website for ${s.name}`}
                        >
                          Check Scheme
                          <span aria-hidden>↗</span>
                        </a>
                      </div>
                    ))}
                  </div>

                  <p className={isDarkMode ? "text-gray-400 text-xs mt-3" : "text-gray-500 text-xs mt-3"}>
                    Data sourced from official government portals. Always verify details before applying.
                  </p>
                </section>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default FarmerDashboard;

