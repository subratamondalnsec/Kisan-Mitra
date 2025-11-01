const axios = require('axios');

const BACKEND_URL = 'http://localhost:3000/api/v1';

async function testConnection() {
    console.log('Testing backend connection...\n');
    
    // Test 1: Simple GET request
    console.log('Test 1: GET /farmer/farmer_001');
    try {
        const response = await axios.get(`${BACKEND_URL}/firebase-images/farmer/farmer_001`);
        console.log('✅ Success:', response.status);
        console.log('   Data:', JSON.stringify(response.data).substring(0, 100));
    } catch (error) {
        if (error.response) {
            console.log('❌ Failed:', error.response.status, error.response.data);
        } else if (error.request) {
            console.log('❌ No response - backend not reachable');
        } else {
            console.log('❌ Error:', error.message);
        }
    }
    
    // Test 2: POST with minimal data
    console.log('\nTest 2: POST /upload/bulk with 1 test image');
    try {
        const testImage = {
            imageKey: 'test_001',
            base64Data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            cropType: 'test'
        };
        
        const response = await axios.post(
            `${BACKEND_URL}/firebase-images/upload/bulk`,
            {
                farmerId: 'farmer_001',
                testName: 'connection_test',
                images: [testImage]
            }
        );
        console.log('✅ Success:', response.status);
        console.log('   Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        if (error.response) {
            console.log('❌ Failed:', error.response.status);
            console.log('   Data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.log('❌ No response - backend not reachable');
        } else {
            console.log('❌ Error:', error.message);
        }
    }
}

testConnection();
