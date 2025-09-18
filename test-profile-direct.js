// Usando fetch nativo de Node.js

async function testProfileAPI() {
  try {
    console.log('🧪 Probando API de perfil directamente...');
    
    // Datos de prueba
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
    
    console.log('📤 Enviando datos:', testData);
    
    const response = await fetch('http://localhost:3000/api/profile/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📥 Status:', response.status);
    console.log('📥 Status Text:', response.statusText);
    
    const responseText = await response.text();
    console.log('📥 Response Body:', responseText);
    
    if (response.ok) {
      console.log('✅ API funcionando correctamente');
    } else {
      console.log('❌ API devolvió error:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testProfileAPI();
