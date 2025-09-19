// Script para probar la API de usuarios después de arreglar RLS
const { createClient } = require('@supabase/supabase-js');

// Usar las credenciales del proyecto (las mismas que usa la app)
const supabaseUrl = 'https://qtbplksozfropbubykud.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0YnBsa3NvemZyb3BidWJ5a3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQ4MDAsImV4cCI6MjA1MDU1MDgwMH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUsersAPI() {
  console.log('🔍 Probando API de usuarios después de arreglar RLS...\n');

  try {
    // 1. Probar consulta básica sin autenticación
    console.log('1. Probando consulta básica (sin auth)...');
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('*')
      .limit(3);
    
    if (allUsersError) {
      console.error('❌ Error en consulta básica:', allUsersError);
    } else {
      console.log('✅ Consulta básica exitosa:', allUsers?.length || 0, 'usuarios');
    }

    // 2. Probar consulta por UID específico
    console.log('\n2. Probando consulta por UID...');
    const testUid = 'b62b069e-6bf4-4ef7-a193-0d31e189ca73';
    const { data: userByUid, error: userByUidError } = await supabase
      .from('users')
      .select('*')
      .eq('uid', testUid);
    
    if (userByUidError) {
      console.error('❌ Error en consulta por UID:', userByUidError);
    } else {
      console.log('✅ Consulta por UID exitosa:', userByUid?.length || 0, 'usuarios');
    }

    // 3. Probar consulta por email
    console.log('\n3. Probando consulta por email...');
    const { data: userByEmail, error: userByEmailError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'coeurdeluke.js@gmail.com');
    
    if (userByEmailError) {
      console.error('❌ Error en consulta por email:', userByEmailError);
    } else {
      console.log('✅ Consulta por email exitosa:', userByEmail?.length || 0, 'usuarios');
    }

    // 4. Probar inserción (esto debería fallar sin auth, pero no con 406/409)
    console.log('\n4. Probando inserción (debería fallar por RLS, no por 406/409)...');
    const testUser = {
      uid: 'test-' + Date.now(),
      email: 'test@example.com',
      nickname: 'Test User',
      user_level: 0
    };

    const { data: insertedUser, error: insertError } = await supabase
      .from('users')
      .insert([testUser])
      .select();

    if (insertError) {
      console.log('ℹ️ Error esperado en inserción (RLS):', insertError.message);
      if (insertError.code === 'PGRST301' || insertError.message.includes('RLS')) {
        console.log('✅ Error RLS esperado - la política está funcionando');
      } else {
        console.error('❌ Error inesperado:', insertError);
      }
    } else {
      console.log('⚠️ Inserción inesperadamente exitosa:', insertedUser);
    }

    // 5. Verificar estructura de respuesta
    console.log('\n5. Verificando estructura de datos...');
    if (allUsers && allUsers.length > 0) {
      const user = allUsers[0];
      console.log('✅ Estructura de usuario:', {
        hasId: 'id' in user,
        hasUid: 'uid' in user,
        hasEmail: 'email' in user,
        hasNickname: 'nickname' in user,
        hasUserLevel: 'user_level' in user,
        uidType: typeof user.uid,
        emailType: typeof user.email
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testUsersAPI();
