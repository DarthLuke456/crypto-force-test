// Script para probar la API de tribunal content
const testData = {
  title: "Test Content",
  subtitle: "Test subtitle",
  content: [
    {
      id: "test-block-1",
      type: "text",
      content: "This is test content",
      order: 0
    }
  ],
  level: 1,
  category: "theoretical",
  is_published: true,
  created_by: "test@example.com"
};

async function testTribunalAPI() {
  try {
    console.log('🧪 Probando API de tribunal content...');
    console.log('📝 Datos de prueba:', testData);

    // Probar endpoint de debug primero
    console.log('\n1. Probando endpoint de debug...');
    const debugResponse = await fetch('https://crypto-force-test.vercel.app/api/debug/tribunal', {
      method: 'GET'
    });
    
    if (debugResponse.ok) {
      const debugData = await debugResponse.json();
      console.log('✅ Debug GET exitoso:', debugData);
    } else {
      const debugError = await debugResponse.text();
      console.log('❌ Debug GET falló:', debugError);
    }

    // Probar inserción de prueba
    console.log('\n2. Probando inserción de prueba...');
    const testResponse = await fetch('https://crypto-force-test.vercel.app/api/debug/tribunal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('✅ Test POST exitoso:', testData);
    } else {
      const testError = await testResponse.text();
      console.log('❌ Test POST falló:', testError);
    }

    // Probar API real
    console.log('\n3. Probando API real...');
    const realResponse = await fetch('https://crypto-force-test.vercel.app/api/tribunal/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    if (realResponse.ok) {
      const realData = await realResponse.json();
      console.log('✅ API real exitosa:', realData);
    } else {
      const realError = await realResponse.text();
      console.log('❌ API real falló:', realError);
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

// Ejecutar la prueba
testTribunalAPI();
