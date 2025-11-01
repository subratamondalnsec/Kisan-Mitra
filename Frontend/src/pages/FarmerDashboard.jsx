import { useMemo } from "react";
import FarmerNavbar from "../components/Common/FarmerNavbar";
import CropPricesCarousel from "../components/Core/farmerDashboard/CropPricesCarousel";
import CropDiseaseDetectionCard from "../components/Core/farmerDashboard/CropConditionCard";
import SoilHealthTestCard from "../components/Core/farmerDashboard/SoilHealthCard";
import GovernmentSchemes from "../components/Core/farmerDashboard/GovernmentSchemes";
import CreditScoreWidget from "../components/Core/farmerDashboard/CreditScoreWidget";

const FarmerDashboard = () => {

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
    <div className="min-h-screen bg-background dark">
      {/* Navbar */}
      <div className="relative z-[100]">
        <FarmerNavbar />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-2 px-4">
        <div className="max-w-7xl mx-auto min-w-0">
          <header className="mb-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-400 leading-tight">
              <span className="stroke-text1">Farmer</span> <span className="stroke-text2">Dashboard</span>
            </h1>
          </header>

          <div className="flex gap-6 lg:flex-row flex-col">
            <div className="flex-1 min-w-0 space-y-8">
              <CropPricesCarousel cropPrices={cropPrices} />
              
              <section aria-labelledby="status-section" className="min-w-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
                  <CropDiseaseDetectionCard />
                  <SoilHealthTestCard />
                </div>
              </section>
            </div>

            <GovernmentSchemes schemes={schemes} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;

