// Script para probar el endpoint de inyección de contenido
async function testInjectAPI() {
  try {
    console.log('🧪 Probando endpoint de inyección de contenido...');

    // Probar GET con diferentes parámetros
    const testCases = [
      { targetLevel: 1, targetDashboard: 'iniciado', category: 'theoretical' },
      { targetLevel: 1, targetDashboard: 'iniciado', category: 'practical' },
      { targetLevel: 1, targetDashboard: 'iniciado' }
    ];

    for (const testCase of testCases) {
      console.log(`\n📝 Probando:`, testCase);
      
      const params = new URLSearchParams(testCase);
      const url = `https://crypto-force-test.vercel.app/api/tribunal/inject?${params}`;
      
      console.log('🔗 URL:', url);
      
      const response = await fetch(url);
      console.log('📊 Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Éxito:', data);
      } else {
        const error = await response.text();
        console.log('❌ Error:', error);
      }
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

// Ejecutar la prueba
testInjectAPI();
