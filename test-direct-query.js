// Script para probar la consulta directa a Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qtbplksozfropbubykud.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  try {
    console.log('🔍 Probando consulta directa a Supabase...');
    
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
      .eq('email', 'keepcalmandgoahead.58@gmail.com')
      .order('created_at', { ascending: false });

    console.log('📊 Resultado de la consulta:');
    console.log('📊 Error:', error);
    console.log('📊 Feedbacks encontrados:', feedbacks?.length || 0);
    console.log('📊 Feedbacks:', feedbacks);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testQuery();
