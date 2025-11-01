#!/usr/bin/env node

/**
 * Firebase to Backend Migration Utility
 * 
 * This script migrates images from Firebase Realtime Database
 * to the backend (Cloudinary + MongoDB) system.
 * 
 * Fixed for testing: farmer_001
 * 
 * Usage:
 *   node migrate-firebase-images.js
 *   (automatically uses farmer_001)
 */

const axios = require('axios');

// Configuration
const FIXED_FARMER_ID = 'farmer_001'; // Fixed for testing
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/api/v1';
const FIREBASE_DATABASE_URL = 'https://code-kinetics-default-rtdb.asia-southeast1.firebasedatabase.app';

/**
 * Fetch farmer data from Firebase
 */
async function fetchFirebaseData(farmerId) {
    try {
        const response = await axios.get(
            `${FIREBASE_DATABASE_URL}/farmers/${farmerId}.json`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching Firebase data:', error.message);
        return null;
    }
}

/**
 * Upload images to backend
 */
async function uploadToBackend(farmerId, testName, images) {
    try {
        console.log(`   Payload: farmerId=${farmerId}, testName=${testName}, images.length=${images.length}`);
        console.log(`   First image has base64Data: ${images[0]?.base64Data ? 'YES (' + images[0].base64Data.substring(0, 50) + '...)' : 'NO'}`);
        
        const response = await axios.post(
            `${BACKEND_URL}/firebase-images/upload/bulk`,
            {
                farmerId,
                testName,
                images
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error uploading to backend:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error('   No response received from backend');
            console.error('   Backend might not be running or unreachable');
        } else {
            console.error('   Error details:', error);
        }
        return null;
    }
}

/**
 * Parse image data from Firebase format
 */
function parseImageData(imageData) {
    let base64Data = '';
    
    if (typeof imageData === 'object' && imageData !== null) {
        base64Data = imageData.image || imageData.base64 || imageData.data || '';
    } else {
        base64Data = imageData;
    }
    
    return base64Data;
}

/**
 * Main migration function
 */
async function migrateFarmer(farmerId) {
    console.log(`\n🚀 Starting migration for farmer: ${farmerId}`);
    console.log('━'.repeat(60));
    
    // Fetch from Firebase
    console.log('\n📥 Fetching data from Firebase...');
    const firebaseData = await fetchFirebaseData(farmerId);
    
    if (!firebaseData) {
        console.error(`❌ No data found for farmer: ${farmerId}`);
        return;
    }
    
    const testNames = Object.keys(firebaseData);
    console.log(`✅ Found ${testNames.length} tests`);
    
    // Process each test
    let totalImages = 0;
    let uploadedImages = 0;
    let failedImages = 0;
    
    for (const testName of testNames) {
        console.log(`\n📂 Processing test: ${testName}`);
        
        const testData = firebaseData[testName];
        const imageKeys = Object.keys(testData);
        const images = [];
        
        // Parse all images
        for (const imageKey of imageKeys) {
            const imageData = testData[imageKey];
            const base64Data = parseImageData(imageData);
            
            if (base64Data) {
                images.push({
                    imageKey,
                    base64Data,
                    cropType: 'unknown'
                });
            } else {
                console.warn(`⚠️  No image data for: ${imageKey}`);
            }
        }
        
        totalImages += images.length;
        console.log(`   Found ${images.length} images`);
        
        if (images.length === 0) {
            console.log('   Skipping - no valid images');
            continue;
        }
        
        // Upload to backend
        console.log(`   📤 Uploading to backend...`);
        console.log(`   URL: ${BACKEND_URL}/firebase-images/upload/bulk`);
        console.log(`   Images count: ${images.length}`);
        console.log(`   First image key: ${images[0]?.imageKey}`);
        const result = await uploadToBackend(farmerId, testName, images);
        
        if (result && result.success) {
            const stats = result.stats || {};
            uploadedImages += stats.successful || 0;
            failedImages += stats.failed || 0;
            
            console.log(`   ✅ Upload complete`);
            console.log(`      • Successful: ${stats.successful || 0}`);
            console.log(`      • Failed: ${stats.failed || 0}`);
            
            if (result.errors && result.errors.length > 0) {
                console.log(`      • Errors:`);
                result.errors.forEach(err => {
                    console.log(`        - ${err.imageKey}: ${err.error}`);
                });
            }
        } else {
            failedImages += images.length;
            console.error(`   ❌ Upload failed for test: ${testName}`);
        }
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Summary
    console.log('\n' + '━'.repeat(60));
    console.log('📊 Migration Summary');
    console.log('━'.repeat(60));
    console.log(`Farmer ID:        ${farmerId}`);
    console.log(`Tests processed:  ${testNames.length}`);
    console.log(`Total images:     ${totalImages}`);
    console.log(`✅ Uploaded:      ${uploadedImages}`);
    console.log(`❌ Failed:        ${failedImages}`);
    console.log(`Success rate:     ${((uploadedImages / totalImages) * 100).toFixed(1)}%`);
    console.log('━'.repeat(60));
    
    if (failedImages === 0) {
        console.log('\n🎉 Migration completed successfully!');
    } else {
        console.log('\n⚠️  Migration completed with errors');
    }
}

/**
 * CLI Interface
 */
async function main() {
    console.log('\n📋 Firebase to Backend Migration Tool');
    console.log('━'.repeat(60));
    console.log(`\n🔒 Fixed Farmer ID: ${FIXED_FARMER_ID} (Testing Mode)`);
    console.log('\nEnvironment Variables:');
    console.log(`  BACKEND_URL: ${BACKEND_URL}`);
    console.log('');
    
    try {
        await migrateFarmer(FIXED_FARMER_ID);
    } catch (error) {
        console.error('\n💥 Unexpected error:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { migrateFarmer, fetchFirebaseData, uploadToBackend };
