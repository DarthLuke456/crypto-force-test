// Script para probar la API usando las variables de entorno del proyecto
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Variables de entorno:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseKey,
  urlLength: supabaseUrl?.length || 0,
  keyLength: supabaseKey?.length || 0
});

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAPI() {
  console.log('🔍 Probando API con variables de entorno correctas...\n');

  try {
    // 1. Probar consulta básica
    console.log('1. Probando consulta básica...');
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('*')
      .limit(3);
    
    if (allUsersError) {
      console.error('❌ Error en consulta básica:', allUsersError);
    } else {
      console.log('✅ Consulta básica exitosa:', allUsers?.length || 0, 'usuarios');
      if (allUsers && allUsers.length > 0) {
        console.log('📋 Primer usuario:', {
          id: allUsers[0].id,
          uid: allUsers[0].uid,
          email: allUsers[0].email,
          nickname: allUsers[0].nickname
        });
      }
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

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testAPI();
