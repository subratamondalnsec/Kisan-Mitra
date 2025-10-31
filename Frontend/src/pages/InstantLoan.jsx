import { useState, useMemo } from "react";
import FarmerNavbar from "../components/Common/FarmerNavbar";
import { useDarkMode } from "../contexts/DarkModeContext";

const InstantLoan = () => {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState("apply");
  const [loanAmount, setLoanAmount] = useState(50000);
  const [tenure, setTenure] = useState(6);
  const [interestRate] = useState(7);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    landSize: "",
    annualIncome: "",
    loanPurpose: "",
    tenure: "",
    aadharNumber: "",
    panNumber: "",
  });

  const [applicationStatus, setApplicationStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationStep, setVerificationStep] = useState("");
  const [iotData, setIotData] = useState(null);
  const [creditScore, setCreditScore] = useState(null);
  const [loanDecision, setLoanDecision] = useState(null);

  const loanTypes = useMemo(
    () => [
      {
        name: "Kisan Credit Card (KCC)",
        rate: "7% p.a.",
        maxAmount: "₹3,00,000",
        tenure: "Up to 5 years",
        desc: "Flexible credit for crop cultivation and allied activities",
      },
      {
        name: "Crop Loan",
        rate: "7-9% p.a.",
        maxAmount: "₹5,00,000",
        tenure: "6-18 months",
        desc: "Short-term loan for seasonal crop production",
      },
      {
        name: "Farm Equipment Loan",
        rate: "9-11% p.a.",
        maxAmount: "₹10,00,000",
        tenure: "Up to 7 years",
        desc: "Purchase tractors, harvesters, and farm machinery",
      },
      {
        name: "Land Development Loan",
        rate: "8-10% p.a.",
        maxAmount: "₹15,00,000",
        tenure: "Up to 10 years",
        desc: "Irrigation, land leveling, and infrastructure development",
      },
    ],
    []
  );

  const emiCalculation = useMemo(() => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const months = tenure;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;
    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
    };
  }, [loanAmount, tenure, interestRate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const simulateIoTSensorData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const npkData = {
          nitrogen: Math.floor(Math.random() * (300 - 200) + 200),
          phosphorus: Math.floor(Math.random() * (80 - 40) + 40),
          potassium: Math.floor(Math.random() * (250 - 150) + 150),
          soilHealth: Math.floor(Math.random() * (95 - 75) + 75),
          accuracy: 98.5,
        };
        resolve(npkData);
      }, 1500);
    });
  };

  const simulateDocumentVerification = (aadhar, pan) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const successRate = Math.random();
        const verified = successRate > 0.2;
        resolve({
          aadharVerified: verified,
          panVerified: verified,
          successRate: Math.round(successRate * 100),
        });
      }, 2000);
    });
  };

  const calculateCreditScore = (data, iotData, docVerification) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let score = 300;
        
        if (parseInt(data.annualIncome) > 200000) score += 150;
        else if (parseInt(data.annualIncome) > 100000) score += 100;
        else score += 50;
        
        if (parseFloat(data.landSize) > 5) score += 100;
        else if (parseFloat(data.landSize) > 2) score += 70;
        else score += 40;
        
        if (iotData.soilHealth > 85) score += 120;
        else if (iotData.soilHealth > 75) score += 80;
        else score += 50;
        
        if (docVerification.aadharVerified && docVerification.panVerified) score += 150;
        else score += 50;
        
        const loanToIncomeRatio = parseInt(data.loanAmount) / parseInt(data.annualIncome);
        if (loanToIncomeRatio < 2) score += 80;
        else if (loanToIncomeRatio < 3) score += 50;
        else score += 20;
        
        score = Math.min(Math.max(score, 300), 850);
        
        resolve({
          score: Math.round(score),
          factors: {
            income: parseInt(data.annualIncome) > 200000 ? "Excellent" : "Good",
            landSize: parseFloat(data.landSize) > 5 ? "Large" : "Medium",
            soilHealth: iotData.soilHealth > 85 ? "Excellent" : "Good",
            documentation: docVerification.aadharVerified ? "Verified" : "Pending",
            loanRatio: loanToIncomeRatio < 2 ? "Low Risk" : "Moderate Risk",
          },
        });
      }, 1500);
    });
  };

  const makeLoanDecision = (creditScore, requestedAmount, tenure) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const approved = creditScore.score >= 600;
        
        // Calculate MICRO loan amount based on credit score tiers (Max ₹50,000)
        let eligibleAmount = 0;
        if (creditScore.score >= 800) {
          eligibleAmount = 50000; // ₹50,000 for excellent credit
        } else if (creditScore.score >= 750) {
          eligibleAmount = 45000; // ₹45,000 for very good credit
        } else if (creditScore.score >= 700) {
          eligibleAmount = 40000; // ₹40,000 for good credit
        } else if (creditScore.score >= 650) {
          eligibleAmount = 30000; // ₹30,000 for fair credit
        } else if (creditScore.score >= 600) {
          eligibleAmount = 20000; // ₹20,000 for minimum credit
        } else {
          eligibleAmount = 0; // Not eligible
        }
        
        // Fine-tune based on exact score within tier (smaller increments for micro loans)
        const scoreBonus = Math.floor((creditScore.score - 600) * 50);
        eligibleAmount = Math.min(eligibleAmount + scoreBonus, 50000); // Cap at ₹50,000
        
        let decision = {
          approved: approved,
          creditScore: creditScore.score,
          requestedAmount: parseInt(requestedAmount),
          approvedAmount: approved ? eligibleAmount : 0,
          interestRate: creditScore.score >= 800 ? 6.5 : 
                       creditScore.score >= 750 ? 7 : 
                       creditScore.score >= 700 ? 7.5 :
                       creditScore.score >= 650 ? 8 : 
                       creditScore.score >= 600 ? 9 : 10,
          tenure: parseInt(tenure),
          reason: "",
          tier: creditScore.score >= 800 ? "Platinum" :
                creditScore.score >= 750 ? "Gold" :
                creditScore.score >= 700 ? "Silver" :
                creditScore.score >= 650 ? "Bronze" :
                creditScore.score >= 600 ? "Basic" : "Not Eligible",
        };
        
        if (!approved) {
          decision.reason = `Credit score ${creditScore.score} is below minimum threshold of 600. Please improve your credit profile and reapply.`;
        } else {
          decision.reason = `Based on your credit score of ${creditScore.score} (${decision.tier} tier), you are eligible for a loan amount of ₹${eligibleAmount.toLocaleString()} at ${decision.interestRate}% interest rate.`;
        }
        
        resolve(decision);
      }, 2000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setApplicationStatus("processing");
    setActiveTab("status");
    
    try {
      setVerificationStep("Fetching IoT sensor data...");
      const iotSensorData = await simulateIoTSensorData();
      setIotData(iotSensorData);
      
      setVerificationStep("Verifying documents...");
      const docVerification = await simulateDocumentVerification(
        formData.aadharNumber,
        formData.panNumber
      );
      
      setVerificationStep("Calculating credit score...");
      const creditScoreResult = await calculateCreditScore(formData, iotSensorData, docVerification);
      setCreditScore(creditScoreResult);
      
      setVerificationStep("Processing loan decision...");
      const decision = await makeLoanDecision(creditScoreResult, 0, formData.tenure);
      setLoanDecision(decision);
      
      setVerificationStep("Complete");
      setApplicationStatus("completed");
    } catch (error) {
      console.error("Error processing loan:", error);
      setApplicationStatus("error");
      setVerificationStep("Error occurred during processing");
    } finally {
      setIsProcessing(false);
    }
  };

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

      <div className="relative z-10 pt-8 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1
              className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${
                isDarkMode ? "from-blue-400 to-cyan-400" : "from-blue-600 to-cyan-600"
              }`}
            >
              💰 Instant Micro Loan
            </h1>
            <p className={isDarkMode ? "text-gray-300 mt-2" : "text-gray-600 mt-2"}>
              Quick micro loans up to ₹50,000 - Amount based on your credit score
            </p>
          </header>

          <div className="flex gap-4 mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab("apply")}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === "apply"
                  ? isDarkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-600 text-white"
                  : isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Apply for Loan
            </button>
            <button
              onClick={() => setActiveTab("calculator")}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === "calculator"
                  ? isDarkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-600 text-white"
                  : isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              EMI Calculator
            </button>
            <button
              onClick={() => setActiveTab("types")}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === "types"
                  ? isDarkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-600 text-white"
                  : isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Loan Types
            </button>
            {(applicationStatus || loanDecision) && (
              <button
                onClick={() => setActiveTab("status")}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === "status"
                    ? isDarkMode
                      ? "bg-blue-600 text-white"
                      : "bg-blue-600 text-white"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Application Status
              </button>
            )}
          </div>

          {activeTab === "apply" && (
            <div
              className={`border rounded-xl p-6 backdrop-blur-md ${
                isDarkMode ? "bg-gray-800/80 border-gray-600" : "bg-white/80 border-gray-300"
              }`}
            >
              <h2 className={isDarkMode ? "text-white text-2xl font-semibold mb-4" : "text-gray-800 text-2xl font-semibold mb-4"}>
                Micro Loan Application
              </h2>
              <div className={`p-4 rounded-lg mb-6 ${isDarkMode ? "bg-blue-900/30 border border-blue-700/30" : "bg-blue-50 border border-blue-200"}`}>
                <p className={`text-sm ${isDarkMode ? "text-blue-300" : "text-blue-700"}`}>
                  💡 <strong>Micro Loan Program:</strong> Your eligible loan amount (up to ₹50,000) will be automatically determined based on your credit score assessment. No need to specify an amount!
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="10-digit mobile number"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Land Size (in acres) *
                    </label>
                    <input
                      type="number"
                      name="landSize"
                      value={formData.landSize}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="Total land area"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Annual Income *
                    </label>
                    <input
                      type="number"
                      name="annualIncome"
                      value={formData.annualIncome}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="Annual income in ₹"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Loan Purpose *
                    </label>
                    <select
                      name="loanPurpose"
                      value={formData.loanPurpose}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="">Select purpose</option>
                      <option value="crop">Crop Cultivation</option>
                      <option value="equipment">Farm Equipment</option>
                      <option value="irrigation">Irrigation</option>
                      <option value="livestock">Livestock</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Repayment Tenure (Crop Cycle) *
                    </label>
                    <select
                      name="tenure"
                      value={formData.tenure}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="">Select tenure</option>
                      <option value="3">3 months (Short crop cycle)</option>
                      <option value="6">6 months (Medium crop cycle)</option>
                      <option value="9">9 months (Extended crop cycle)</option>
                      <option value="12">12 months (Full crop cycle)</option>
                    </select>
                    <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Short-term loans repayable within 12 months after harvest
                    </p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Aadhar Number *
                    </label>
                    <input
                      type="text"
                      name="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={handleInputChange}
                      required
                      maxLength="12"
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="12-digit Aadhar number"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      PAN Number *
                    </label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      required
                      maxLength="10"
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="10-character PAN number"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setFormData({
                      fullName: "",
                      phone: "",
                      landSize: "",
                      annualIncome: "",
                      loanPurpose: "",
                      tenure: "",
                      aadharNumber: "",
                      panNumber: "",
                    })}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "calculator" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className={`border rounded-xl p-6 backdrop-blur-md ${
                  isDarkMode ? "bg-gray-800/80 border-gray-600" : "bg-white/80 border-gray-300"
                }`}
              >
                <h2 className={isDarkMode ? "text-white text-2xl font-semibold mb-6" : "text-gray-800 text-2xl font-semibold mb-6"}>
                  EMI Calculator
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Loan Amount: ₹{loanAmount.toLocaleString()}
                    </label>
                    <input
                      type="range"
                      min="10000"
                      max="1000000"
                      step="10000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>₹10,000</span>
                      <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>₹10,00,000</span>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Tenure: {tenure} months ({tenure === 3 ? "Short" : tenure === 6 ? "Medium" : tenure === 9 ? "Extended" : "Full"} crop cycle)
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="12"
                      step="3"
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>3 months</span>
                      <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>12 months</span>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Interest Rate: {interestRate}% p.a.
                    </label>
                    <div className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                      <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Fixed at {interestRate}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-xl p-6 backdrop-blur-md ${
                  isDarkMode ? "bg-gray-800/80 border-gray-600" : "bg-white/80 border-gray-300"
                }`}
              >
                <h2 className={isDarkMode ? "text-white text-2xl font-semibold mb-6" : "text-gray-800 text-2xl font-semibold mb-6"}>
                  Calculation Results
                </h2>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${isDarkMode ? "bg-blue-900/30 border border-blue-700/30" : "bg-blue-50 border border-blue-200"}`}>
                    <div className={`text-sm mb-1 ${isDarkMode ? "text-blue-300" : "text-blue-700"}`}>Monthly EMI</div>
                    <div className={`text-3xl font-bold ${isDarkMode ? "text-blue-200" : "text-blue-800"}`}>
                      ₹{emiCalculation.emi.toLocaleString()}
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Principal Amount</span>
                      <span className={isDarkMode ? "text-white font-semibold" : "text-gray-900 font-semibold"}>
                        ₹{loanAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Total Interest</span>
                      <span className={isDarkMode ? "text-orange-300 font-semibold" : "text-orange-700 font-semibold"}>
                        ₹{emiCalculation.totalInterest.toLocaleString()}
                      </span>
                    </div>
                    <div className={`flex items-center justify-between pt-2 border-t ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
                      <span className={isDarkMode ? "text-gray-300 font-medium" : "text-gray-700 font-medium"}>Total Payment</span>
                      <span className={isDarkMode ? "text-emerald-300 font-bold text-lg" : "text-emerald-700 font-bold text-lg"}>
                        ₹{emiCalculation.totalPayment.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <div className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Payment Breakdown</div>
                    <div className="flex gap-2 h-4 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500"
                        style={{ width: `${(loanAmount / emiCalculation.totalPayment) * 100}%` }}
                        title="Principal"
                      />
                      <div
                        className="bg-orange-500"
                        style={{ width: `${(emiCalculation.totalInterest / emiCalculation.totalPayment) * 100}%` }}
                        title="Interest"
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs">
                      <span className={isDarkMode ? "text-blue-400" : "text-blue-600"}>
                        Principal: {Math.round((loanAmount / emiCalculation.totalPayment) * 100)}%
                      </span>
                      <span className={isDarkMode ? "text-orange-400" : "text-orange-600"}>
                        Interest: {Math.round((emiCalculation.totalInterest / emiCalculation.totalPayment) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "types" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loanTypes.map((loan) => (
                <div
                  key={loan.name}
                  className={`border rounded-xl p-6 backdrop-blur-md transition-all duration-300 hover:shadow-lg ${
                    isDarkMode ? "bg-gray-800/80 border-gray-600" : "bg-white/80 border-gray-300"
                  }`}
                >
                  <h3 className={isDarkMode ? "text-white text-xl font-semibold mb-3" : "text-gray-800 text-xl font-semibold mb-3"}>
                    {loan.name}
                  </h3>
                  <p className={isDarkMode ? "text-gray-300 text-sm mb-4" : "text-gray-600 text-sm mb-4"}>{loan.desc}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>Interest Rate</span>
                      <span className={isDarkMode ? "text-blue-300 font-semibold" : "text-blue-700 font-semibold"}>{loan.rate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>Max Amount</span>
                      <span className={isDarkMode ? "text-emerald-300 font-semibold" : "text-emerald-700 font-semibold"}>{loan.maxAmount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>Tenure</span>
                      <span className={isDarkMode ? "text-gray-200 font-medium" : "text-gray-800 font-medium"}>{loan.tenure}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("apply")}
                    className="w-full mt-4 px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "status" && (
            <div className="space-y-6">
              {isProcessing && (
                <div
                  className={`border rounded-xl p-6 backdrop-blur-md ${
                    isDarkMode ? "bg-gray-800/80 border-gray-600" : "bg-white/80 border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <div>
                      <h3 className={isDarkMode ? "text-white text-xl font-semibold" : "text-gray-800 text-xl font-semibold"}>
                        Processing Your Application
                      </h3>
                      <p className={isDarkMode ? "text-gray-300 text-sm" : "text-gray-600 text-sm"}>{verificationStep}</p>
                    </div>
                  </div>
                </div>
              )}

              {iotData && (
                <div
                  className={`border rounded-xl p-6 backdrop-blur-md ${
                    isDarkMode ? "bg-gray-800/80 border-gray-600" : "bg-white/80 border-gray-300"
                  }`}
                >
                  <h3 className={isDarkMode ? "text-white text-xl font-semibold mb-4" : "text-gray-800 text-xl font-semibold mb-4"}>
                    ✅ IoT Sensor Data (NPK Analysis)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-lg ${isDarkMode ? "bg-green-900/30" : "bg-green-50"}`}>
                      <div className={`text-sm mb-1 ${isDarkMode ? "text-green-300" : "text-green-700"}`}>Nitrogen (N)</div>
                      <div className={`text-2xl font-bold ${isDarkMode ? "text-green-200" : "text-green-800"}`}>{iotData.nitrogen} kg/ha</div>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? "bg-blue-900/30" : "bg-blue-50"}`}>
                      <div className={`text-sm mb-1 ${isDarkMode ? "text-blue-300" : "text-blue-700"}`}>Phosphorus (P)</div>
                      <div className={`text-2xl font-bold ${isDarkMode ? "text-blue-200" : "text-blue-800"}`}>{iotData.phosphorus} kg/ha</div>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? "bg-purple-900/30" : "bg-purple-50"}`}>
                      <div className={`text-sm mb-1 ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}>Potassium (K)</div>
                      <div className={`text-2xl font-bold ${isDarkMode ? "text-purple-200" : "text-purple-800"}`}>{iotData.potassium} kg/ha</div>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? "bg-emerald-900/30" : "bg-emerald-50"}`}>
                      <div className={`text-sm mb-1 ${isDarkMode ? "text-emerald-300" : "text-emerald-700"}`}>Soil Health</div>
                      <div className={`text-2xl font-bold ${isDarkMode ? "text-emerald-200" : "text-emerald-800"}`}>{iotData.soilHealth}%</div>
                    </div>
                  </div>
                  <p className={`mt-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Accuracy: {iotData.accuracy}% • Data collected in real-time from field sensors
                  </p>
                </div>
              )}

              {creditScore && (
                <div
                  className={`border rounded-xl p-6 backdrop-blur-md ${
                    isDarkMode ? "bg-gray-800/80 border-gray-600" : "bg-white/80 border-gray-300"
                  }`}
                >
                  <h3 className={isDarkMode ? "text-white text-xl font-semibold mb-4" : "text-gray-800 text-xl font-semibold mb-4"}>
                    ✅ Credit Score Assessment
                  </h3>
                  <div className="flex items-center justify-center mb-6">
                    <div className={`text-center p-6 rounded-xl ${
                      creditScore.score >= 750
                        ? isDarkMode ? "bg-green-900/30" : "bg-green-50"
                        : creditScore.score >= 650
                        ? isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
                        : isDarkMode ? "bg-orange-900/30" : "bg-orange-50"
                    }`}>
                      <div className={`text-5xl font-bold ${
                        creditScore.score >= 750
                          ? isDarkMode ? "text-green-300" : "text-green-700"
                          : creditScore.score >= 650
                          ? isDarkMode ? "text-blue-300" : "text-blue-700"
                          : isDarkMode ? "text-orange-300" : "text-orange-700"
                      }`}>
                        {creditScore.score}
                      </div>
                      <div className={isDarkMode ? "text-gray-300 mt-2" : "text-gray-700 mt-2"}>
                        {creditScore.score >= 750 ? "Excellent" : creditScore.score >= 650 ? "Good" : "Fair"}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(creditScore.factors).map(([key, value]) => (
                      <div key={key} className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        <div className={`text-xs mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                        <div className={isDarkMode ? "text-gray-200 font-medium" : "text-gray-800 font-medium"}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {loanDecision && (
                <div
                  className={`border rounded-xl p-6 backdrop-blur-md ${
                    loanDecision.approved
                      ? isDarkMode ? "bg-green-900/20 border-green-700/30" : "bg-green-50 border-green-200"
                      : isDarkMode ? "bg-red-900/20 border-red-700/30" : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`text-4xl ${loanDecision.approved ? "text-green-500" : "text-red-500"}`}>
                      {loanDecision.approved ? "✅" : "❌"}
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold mb-2 ${
                        loanDecision.approved
                          ? isDarkMode ? "text-green-300" : "text-green-700"
                          : isDarkMode ? "text-red-300" : "text-red-700"
                      }`}>
                        {loanDecision.approved ? "Loan Approved!" : "Loan Application Declined"}
                      </h3>
                      <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>{loanDecision.reason}</p>
                    </div>
                  </div>

                  {loanDecision.approved && (
                    <div className="space-y-4 mt-6">
                      <div className={`p-4 rounded-lg mb-4 ${
                        loanDecision.tier === "Platinum" ? isDarkMode ? "bg-purple-900/30 border border-purple-700/30" : "bg-purple-50 border border-purple-200" :
                        loanDecision.tier === "Gold" ? isDarkMode ? "bg-yellow-900/30 border border-yellow-700/30" : "bg-yellow-50 border border-yellow-200" :
                        loanDecision.tier === "Silver" ? isDarkMode ? "bg-gray-700 border border-gray-600" : "bg-gray-100 border border-gray-300" :
                        isDarkMode ? "bg-orange-900/30 border border-orange-700/30" : "bg-orange-50 border border-orange-200"
                      }`}>
                        <div className="text-center">
                          <div className={`text-sm mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Eligibility Tier</div>
                          <div className={`text-2xl font-bold ${
                            loanDecision.tier === "Platinum" ? isDarkMode ? "text-purple-300" : "text-purple-700" :
                            loanDecision.tier === "Gold" ? isDarkMode ? "text-yellow-300" : "text-yellow-700" :
                            loanDecision.tier === "Silver" ? isDarkMode ? "text-gray-300" : "text-gray-700" :
                            isDarkMode ? "text-orange-300" : "text-orange-700"
                          }`}>
                            {loanDecision.tier}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-white"}`}>
                          <div className={`text-sm mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Approved Amount</div>
                          <div className={`${isDarkMode ? "text-emerald-300" : "text-emerald-700"} font-bold text-lg`}>
                            ₹{loanDecision.approvedAmount.toLocaleString()}
                          </div>
                        </div>
                        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-white"}`}>
                          <div className={`text-sm mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Interest Rate</div>
                          <div className={isDarkMode ? "text-white font-bold text-lg" : "text-gray-900 font-bold text-lg"}>
                            {loanDecision.interestRate}% p.a.
                          </div>
                        </div>
                        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-white"}`}>
                          <div className={`text-sm mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Tenure</div>
                          <div className={isDarkMode ? "text-white font-bold text-lg" : "text-gray-900 font-bold text-lg"}>
                            {loanDecision.tenure} months
                          </div>
                        </div>
                        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-white"}`}>
                          <div className={`text-sm mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Credit Score</div>
                          <div className={isDarkMode ? "text-white font-bold text-lg" : "text-gray-900 font-bold text-lg"}>
                            {loanDecision.creditScore}
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg ${isDarkMode ? "bg-blue-900/30" : "bg-blue-50"}`}>
                        <p className={`text-sm ${isDarkMode ? "text-blue-300" : "text-blue-700"}`}>
                          ✓ Your loan has been approved! Our team will contact you within 24 hours to complete the documentation process.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab("apply");
                          setFormData({
                            fullName: "",
                            phone: "",
                            landSize: "",
                            annualIncome: "",
                            loanPurpose: "",
                            tenure: "",
                            aadharNumber: "",
                            panNumber: "",
                          });
                          setLoanDecision(null);
                          setCreditScore(null);
                          setIotData(null);
                          setApplicationStatus(null);
                        }}
                        className="w-full px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all"
                      >
                        Apply for Another Loan
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstantLoan;