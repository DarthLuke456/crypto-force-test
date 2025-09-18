// Test script for the respond API
const fetch = require('node-fetch');

async function testRespondAPI() {
  try {
    console.log('🧪 Testing respond API...');
    
    // You'll need to replace this with a valid token and feedback ID
    const token = 'your-valid-token-here';
    const feedbackId = 'your-feedback-id-here';
    
    const response = await fetch('http://localhost:3000/api/feedback/respond', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedbackId: feedbackId,
        response: 'Test response from API'
      }),
    });

    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ Respond API test successful');
    } else {
      console.log('❌ Respond API test failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing respond API:', error);
  }
}

testRespondAPI();
