
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
    <div>
      <h2>Live Firebase Data</h2>
      <p style={{ marginTop: 4, color: "#64748b" }}>Path: <code>{PATH}</code></p>
      {loading && <p>Loading...</p>}
      {error && (
        <p style={{ color: "#ef4444" }}>Error: {error}</p>
      )}
      {!loading && !error && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}

export default LiveData;
