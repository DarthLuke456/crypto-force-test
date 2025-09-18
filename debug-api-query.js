// Script para debuggear la consulta de la API
const { createClient } = require('@supabase/supabase-js');

// Usar las mismas variables de entorno que la API
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qtbplksozfropbubykud.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY no está definida');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugQuery() {
  try {
    console.log('🔍 Debuggeando consulta de la API...');
    console.log('🔍 Supabase URL:', supabaseUrl);
    console.log('🔍 Service Key presente:', !!supabaseServiceKey);
    
    const email = 'keepcalmandgoahead.58@gmail.com';
    console.log('🔍 Buscando feedbacks para email:', email);
    
    // Hacer la consulta exacta que hace la API
    const { data: feedbacks, error } = await supabase
      .from('feedback')
      .select(`
        id,
        message,
        response,
        response_by,
        response_at,
        status,
        created_at,
        updated_at
      `)
      .eq('email', email)
      .order('created_at', { ascending: false });

    console.log('📊 Resultado de la consulta:');
    console.log('📊 Error:', error);
    console.log('📊 Feedbacks encontrados:', feedbacks?.length || 0);
    console.log('📊 Feedbacks:', feedbacks);
    
    // También probar con una consulta más simple
    console.log('\n🔍 Probando consulta simple...');
    const { data: simpleFeedbacks, error: simpleError } = await supabase
      .from('feedback')
      .select('*')
      .eq('email', email);

    console.log('📊 Consulta simple:');
    console.log('📊 Error:', simpleError);
    console.log('📊 Feedbacks encontrados:', simpleFeedbacks?.length || 0);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugQuery();
