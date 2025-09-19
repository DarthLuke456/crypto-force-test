// Script para debuggear el UID del usuario autenticado
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugUserUID() {
  console.log('🔍 Debuggeando UID del usuario...\n');

  try {
    // 1. Obtener sesión actual
    console.log('1. Obteniendo sesión actual...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Error obteniendo sesión:', sessionError);
      return;
    }

    if (!session) {
      console.log('ℹ️ No hay sesión activa');
      return;
    }

    console.log('✅ Sesión encontrada:');
    console.log('   - User ID:', session.user.id);
    console.log('   - Email:', session.user.email);
    console.log('   - User ID type:', typeof session.user.id);
    console.log('   - User ID length:', session.user.id?.length);

    // 2. Buscar usuario por UID en la base de datos
    console.log('\n2. Buscando usuario por UID...');
    const { data: userByUid, error: uidError } = await supabase
      .from('users')
      .select('*')
      .eq('uid', session.user.id)
      .single();

    if (uidError) {
      console.error('❌ Error buscando por UID:', uidError);
    } else {
      console.log('✅ Usuario encontrado por UID:', userByUid);
    }

    // 3. Buscar usuario por email
    console.log('\n3. Buscando usuario por email...');
    const { data: userByEmail, error: emailError } = await supabase
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .single();

    if (emailError) {
      console.error('❌ Error buscando por email:', emailError);
    } else {
      console.log('✅ Usuario encontrado por email:', userByEmail);
    }

    // 4. Listar todos los usuarios para comparar
    console.log('\n4. Listando todos los usuarios...');
    const { data: allUsers, error: allError } = await supabase
      .from('users')
      .select('uid, email, nickname')
      .limit(10);

    if (allError) {
      console.error('❌ Error listando usuarios:', allError);
    } else {
      console.log('✅ Todos los usuarios:');
      allUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. UID: ${user.uid}, Email: ${user.email}, Nickname: ${user.nickname}`);
      });
    }

    // 5. Verificar si el UID de la sesión coincide con algún UID en la DB
    console.log('\n5. Verificando coincidencias...');
    const matchingUser = allUsers?.find(user => user.uid === session.user.id);
    if (matchingUser) {
      console.log('✅ Coincidencia encontrada:', matchingUser);
    } else {
      console.log('❌ No se encontró coincidencia exacta');
      console.log('   - UID de sesión:', session.user.id);
      console.log('   - UIDs en DB:', allUsers?.map(u => u.uid));
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

debugUserUID();
