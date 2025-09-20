// Script completo para diagnosticar el problema de autenticación
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://qtbplksozfropbubykud.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0YnBsa3NvenJvcGJ1YnlrdWQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNDU0MjQ5MCwiZXhwIjoyMDUwMTE4NDkwfQ.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAuthComplete() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DE AUTENTICACIÓN');
  console.log('==========================================');
  
  try {
    // 1. Verificar conexión a Supabase
    console.log('\n1. Verificando conexión a Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.log('❌ Error de conexión:', testError.message);
      return;
    }
    console.log('✅ Conexión a Supabase OK');
    
    // 2. Verificar sesión actual
    console.log('\n2. Verificando sesión actual...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Error de sesión:', sessionError.message);
      return;
    }
    
    if (!session) {
      console.log('⚠️ No hay sesión activa');
      console.log('💡 Necesitas hacer login primero');
      return;
    }
    
    console.log('✅ Sesión activa encontrada');
    console.log('   Usuario ID:', session.user.id);
    console.log('   Email:', session.user.email);
    console.log('   Email confirmado:', session.user.email_confirmed_at ? 'Sí' : 'No');
    
    // 3. Verificar datos del usuario en la base de datos
    console.log('\n3. Verificando datos del usuario...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('uid', session.user.id)
      .single();
    
    if (userError) {
      console.log('❌ Error obteniendo datos del usuario:', userError.message);
      
      // Intentar por email
      console.log('\n   Intentando por email...');
      const { data: emailData, error: emailError } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single();
      
      if (emailError) {
        console.log('❌ Error obteniendo por email:', emailError.message);
        console.log('💡 El usuario no existe en la base de datos');
      } else {
        console.log('✅ Datos encontrados por email:', emailData);
      }
    } else {
      console.log('✅ Datos del usuario encontrados:', userData);
    }
    
    // 4. Verificar estructura de la tabla users
    console.log('\n4. Verificando estructura de la tabla users...');
    const { data: tableData, error: tableError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (tableError) {
      console.log('❌ Error accediendo a la tabla users:', tableError.message);
    } else {
      console.log('✅ Tabla users accesible');
      console.log('   Registros encontrados:', tableData.length);
      if (tableData.length > 0) {
        console.log('   Estructura del primer registro:', Object.keys(tableData[0]));
      }
    }
    
    // 5. Verificar políticas RLS
    console.log('\n5. Verificando políticas RLS...');
    const { data: rlsData, error: rlsError } = await supabase
      .from('users')
      .select('id, email, user_level')
      .limit(1);
    
    if (rlsError) {
      console.log('❌ Error RLS:', rlsError.message);
      console.log('💡 Posible problema con políticas de seguridad');
    } else {
      console.log('✅ Políticas RLS OK');
    }
    
    console.log('\n🎯 DIAGNÓSTICO COMPLETADO');
    console.log('==========================');
    
  } catch (error) {
    console.log('💥 Error general:', error.message);
  }
}

debugAuthComplete();
