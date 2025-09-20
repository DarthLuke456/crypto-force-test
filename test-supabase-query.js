// Script para probar la consulta a Supabase que se está colgando
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://qtbplksozfropbubykud.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0YnBsa3NvenJvcGJ1YnlrdWQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNDU0MjQ5MCwiZXhwIjoyMDUwMTE4NDkwfQ.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseQuery() {
  console.log('🔍 Testing Supabase query...');
  
  const userId = 'b62b069e-6bf4-4ef7-a193-0d31e189ca73';
  
  try {
    console.log('📡 Querying users table by UID...');
    const startTime = Date.now();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('uid', userId)
      .single();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`⏱️ Query completed in ${duration}ms`);
    
    if (error) {
      console.error('❌ Error:', error);
      
      // Intentar por email como fallback
      console.log('📡 Trying fallback query by email...');
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData?.session?.user?.email) {
        const email = sessionData.session.user.email;
        console.log('📧 Email from session:', email);
        
        const { data: emailData, error: emailError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();
        
        if (emailError) {
          console.error('❌ Email query error:', emailError);
        } else {
          console.log('✅ Email query success:', emailData);
        }
      }
    } else {
      console.log('✅ UID query success:', data);
    }
    
  } catch (error) {
    console.error('💥 Exception:', error);
  }
}

// Ejecutar con timeout
const timeout = setTimeout(() => {
  console.log('⏰ Query timed out after 10 seconds');
  process.exit(1);
}, 10000);

testSupabaseQuery()
  .then(() => {
    clearTimeout(timeout);
    console.log('✅ Test completed');
    process.exit(0);
  })
  .catch((error) => {
    clearTimeout(timeout);
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
