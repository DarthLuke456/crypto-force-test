// Test environment configuration
console.log('=== Environment Configuration Test ===');

// Check if we're in browser or server
if (typeof window !== 'undefined') {
  console.log('Running in browser environment');
  
  // Check environment variables
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length);
  
  // Check if Supabase client can be created
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      console.log('✅ Supabase client created successfully');
      
      // Test auth methods
      console.log('Supabase auth methods available:', Object.keys(supabase.auth));
    } else {
      console.error('❌ Missing Supabase environment variables');
      console.log('supabaseUrl:', supabaseUrl);
      console.log('supabaseAnonKey length:', supabaseAnonKey?.length);
    }
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error);
  }
} else {
  console.log('Running in server environment');
}

console.log('=== End Environment Test ===');
