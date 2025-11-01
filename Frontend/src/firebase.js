import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDZ2aPL9cX-MxoxEHwLmepsEzA-TH6kBgs",
  authDomain: "code-kinetics-npk.firebaseapp.com",
  databaseURL: "https://code-kinetics-npk-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "code-kinetics-npk",
  storageBucket: "code-kinetics-npk.firebasestorage.app",
  messagingSenderId: "520991241849",
  appId: "1:520991241849:web:2a27746ff12594c8d9c6a8"
};

const app = initializeApp(firebaseConfig);
// Explicitly pass the database URL to avoid default-instance mismatches across regions
export const db = getDatabase(
  app,
  "https://code-kinetics-npk-default-rtdb.asia-southeast1.firebasedatabase.app"
);
