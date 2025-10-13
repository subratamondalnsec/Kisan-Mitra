import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-green-400 flex flex-col items-center justify-center">
      {/* Card Container */}
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-10 text-center max-w-md w-[90%] transition-transform hover:scale-105">
        {/* Title */}
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          🌾 Kisan Mitra
        </h1>

        {/* Subtitle */}
        <p className="text-gray-700 text-lg mb-6">
          Empowering Farmers with Smart Solutions for a Sustainable Future.
        </p>

        {/* Button */}
        <button className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition-all">
          Get Started
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-sm text-green-900 opacity-80">
        © {new Date().getFullYear()} Kisan Mitra. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
