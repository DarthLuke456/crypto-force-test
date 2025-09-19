// Script para probar la API de usuarios
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUsersAPI() {
  console.log('🔍 Probando API de usuarios...\n');

  try {
    // 1. Probar consulta básica
    console.log('1. Probando consulta básica...');
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (allUsersError) {
      console.error('❌ Error en consulta básica:', allUsersError);
    } else {
      console.log('✅ Consulta básica exitosa:', allUsers);
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
      console.log('✅ Consulta por UID exitosa:', userByUid);
    }

    // 3. Probar inserción de usuario de prueba
    console.log('\n3. Probando inserción de usuario...');
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
      console.error('❌ Error en inserción:', insertError);
    } else {
      console.log('✅ Inserción exitosa:', insertedUser);
      
      // Limpiar usuario de prueba
      await supabase
        .from('users')
        .delete()
        .eq('uid', testUser.uid);
      console.log('🧹 Usuario de prueba eliminado');
    }

    // 4. Verificar estructura de la tabla
    console.log('\n4. Verificando estructura de la tabla...');
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { table_name: 'users' })
      .catch(() => {
        console.log('ℹ️ Función get_table_info no disponible, saltando...');
        return { data: null, error: null };
      });

    if (tableError) {
      console.log('ℹ️ No se pudo obtener info de la tabla:', tableError.message);
    } else if (tableInfo) {
      console.log('✅ Info de la tabla:', tableInfo);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testUsersAPI();
