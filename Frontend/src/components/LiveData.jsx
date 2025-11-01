
import { useState, useEffect } from "react";
import { ref, onValue, get } from "firebase/database";
import { db } from "../firebase";

function LiveData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const PATH = "farmData/latest"; // updated to match actual DB path

  useEffect(() => {
    console.log("[LiveData] component mounted");
    const dataRef = ref(db, PATH);
    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        const exists = snapshot.exists();
        // Helpful console diagnostics during development
        console.log("[LiveData] onValue path=", PATH, "exists=", exists);
        if (exists) {
          setData(snapshot.val());
        } else {
          // Path does not exist or has null value
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("[LiveData] Firebase onValue error:", err);
        setError(err?.message || "Failed to read from Firebase");
        setLoading(false);
      }
    );

    // One-time read to verify path and rules immediately
    get(dataRef)
      .then((snap) => {
        console.log("[LiveData] get() exists=", snap.exists(), "value=", snap.val());
      })
      .catch((e) => {
        console.error("[LiveData] get() error:", e);
      });
    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Live Sensor Data
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time monitoring from Firebase • Path: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">{PATH}</code>
          </p>
        </div>

        {loading && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading sensor data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 text-center">
            <p className="text-red-600 dark:text-red-300">Error: {error}</p>
          </div>
        )}

        {!loading && !error && data && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
              Live Sensor Parameters
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Temperature */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900 rounded-lg p-6 border border-orange-200 dark:border-orange-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Temperature</p>
                  <span className="text-orange-500">🌡️</span>
                </div>
                <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                  {data.temperature}°C
                </p>
              </div>

              {/* Humidity */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Humidity</p>
                  <span className="text-blue-500">💧</span>
                </div>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {data.humidity}%
                </p>
              </div>

              {/* pH Level */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900 dark:to-indigo-900 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">pH Level</p>
                  <span className="text-purple-500">⚗️</span>
                </div>
                <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                  {data.pH}
                </p>
              </div>

              {/* Nitrogen (N) */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-lg p-6 border border-green-200 dark:border-green-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Nitrogen (N)</p>
                  <span className="text-green-500">🌱</span>
                </div>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {data.N} mg/kg
                </p>
              </div>

              {/* Phosphorus (P) */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900 dark:to-amber-900 rounded-lg p-6 border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Phosphorus (P)</p>
                  <span className="text-yellow-500">🌾</span>
                </div>
                <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                  {data.P} mg/kg
                </p>
              </div>

              {/* Potassium (K) */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900 dark:to-rose-900 rounded-lg p-6 border border-pink-200 dark:border-pink-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-pink-700 dark:text-pink-300">Potassium (K)</p>
                  <span className="text-pink-500">🍃</span>
                </div>
                <p className="text-2xl font-bold text-pink-800 dark:text-pink-200">
                  {data.K} mg/kg
                </p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                🔄 Data updates in real-time • Last synced: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}

        {!loading && !error && !data && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">No sensor data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LiveData;
