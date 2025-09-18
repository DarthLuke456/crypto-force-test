// Simulando exactamente lo que hace el frontend
async function testFrontendExact() {
  try {
    console.log('🧪 Simulando frontend exacto...');
    
    // Datos exactos que envía el frontend
    const testData = {
      nombre: 'Test',
      apellido: 'User', 
      nickname: 'testuser',
      email: 'coeurdeluke.js@gmail.com',
      movil: '123456789',
      exchange: 'Binance',
      avatar: '/images/default-avatar.png',
      user_level: 1
    };
    
    console.log('📤 Datos a enviar:', testData);
    
    // Simulando el fetch exacto del frontend
    const response = await fetch('http://localhost:3000/api/profile/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzM1NzQ4NDAwLCJpYXQiOjE3MzU3NDQ4MDAsImlzcyI6Imh0dHBzOi8vZ3JhY2VmdWxseS1kZXNpZ25lZC1jcm9jb2RpbGUuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImI2MmIwNjllLTZiZjQtNGVmNy1hMTkzLTBkMzFlMTg5Y2E3MyIsImVtYWlsIjoiY29ldXJkZWx1a2UuanNAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3MzU3NDQ4MDB9XSwic2Vzc2lvbl9pZCI6IjQ5YzQ5YzQ5LWM0OWMtNDljOS00OWM5LTQ5YzQ5YzQ5YzQ5YyIsImlzX2Fub255bW91cyI6ZmFsc2V9.test'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📥 Respuesta:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Éxito:', data);
    } else {
      const errorData = await response.json();
      console.log('❌ Error:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testFrontendExact();

