// Firebase Admin SDK Configuration for Backend
// This allows the backend to interact with Firebase services securely

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Note: You need to download your Firebase service account key from Firebase Console
// Go to: Project Settings > Service Accounts > Generate New Private Key
// Save it as 'serviceAccountKey.json' in the config folder

try {
    // Option 1: Using service account key file (Recommended for production)
    // const serviceAccount = require('./serviceAccountKey.json');
    // admin.initializeApp({
    //     credential: admin.credential.cert(serviceAccount),
    //     databaseURL: "https://code-kinetics-default-rtdb.asia-southeast1.firebasedatabase.app"
    // });

    // Option 2: Using environment variables (For deployment)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DATABASE_URL || "https://code-kinetics-default-rtdb.asia-southeast1.firebasedatabase.app"
        });
    } else {
        // Option 3: Using default credentials (Development only)
        // For this demo, we'll use application default credentials
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            databaseURL: "https://code-kinetics-default-rtdb.asia-southeast1.firebasedatabase.app"
        });
    }

    console.log('Firebase Admin initialized successfully');
} catch (error) {
    console.log('Firebase Admin initialization skipped:', error.message);
    console.log('Note: Firebase Admin SDK is optional for this implementation');
}

// Get Firebase Realtime Database reference
const getDatabase = () => {
    try {
        return admin.database();
    } catch (error) {
        console.error('Error getting Firebase database:', error);
        return null;
    }
};

module.exports = {
    admin,
    getDatabase
};
