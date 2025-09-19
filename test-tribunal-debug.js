// Test script para verificar el acceso a Tribunal Imperial con debug
// Ejecutar con: node test-tribunal-debug.js

const testTribunalDebug = async () => {
    console.log('🧪 TESTING TRIBUNAL IMPERIAL ACCESS WITH DEBUG\n');
    
    // 1. Test de acceso directo a Tribunal Imperial
    console.log('1️⃣ Testing direct access to Tribunal Imperial...');
    try {
        const tribunalResponse = await fetch('https://crypto-force-test.vercel.app/dashboard/maestro/courses/tribunal-imperial');
        
        if (tribunalResponse.ok) {
            console.log('✅ Tribunal Imperial accessible:', tribunalResponse.status);
            const html = await tribunalResponse.text();
            
            // Verificar contenido específico
            if (html.includes('Verificando acceso de maestro')) {
                console.log('⚠️ Still showing loading screen - possible loop issue');
            } else if (html.includes('Crear Contenido')) {
                console.log('✅ Page loaded successfully with content creator');
            } else if (html.includes('Acceso Denegado')) {
                console.log('❌ Access denied - checking user level');
                // Extraer información del error
                const levelMatch = html.match(/Tu nivel actual: (\d+)/);
                const emailMatch = html.match(/Tu email: ([^<]+)/);
                if (levelMatch) {
                    console.log('📊 User level:', levelMatch[1]);
                }
                if (emailMatch) {
                    console.log('📧 User email:', emailMatch[1]);
                }
            } else {
                console.log('ℹ️ Page loaded but content unclear');
                console.log('📄 First 500 chars:', html.substring(0, 500));
            }
        } else {
            console.log('❌ Tribunal Imperial error:', tribunalResponse.status);
        }
    } catch (error) {
        console.log('❌ Tribunal Imperial error:', error.message);
    }
    
    // 2. Test de API de contenido para verificar datos del usuario
    console.log('\n2️⃣ Testing content API to verify user data...');
    try {
        const contentResponse = await fetch('https://crypto-force-test.vercel.app/api/tribunal/content?published=true');
        
        if (contentResponse.ok) {
            const data = await contentResponse.json();
            console.log('✅ Content API working');
            if (data.content && data.content.length > 0) {
                console.log('📊 Published content count:', data.content.length);
                console.log('👤 Content creators:', [...new Set(data.content.map(c => c.created_by))]);
            }
        } else {
            console.log('❌ Content API error:', contentResponse.status);
        }
    } catch (error) {
        console.log('❌ Content API error:', error.message);
    }
    
    console.log('\n🎯 DEBUG TEST COMPLETE');
    console.log('Check the browser console for detailed debug logs when accessing Tribunal Imperial');
};

testTribunalDebug().catch(console.error);
