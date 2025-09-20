// Script para verificar las variables de entorno de Supabase
console.log('🔍 Checking environment variables...');

// Verificar variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('📊 Environment Variables Status:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Not set');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Not set');

if (supabaseUrl) {
  console.log('URL Length:', supabaseUrl.length);
  console.log('URL Preview:', supabaseUrl.substring(0, 30) + '...');
}

if (supabaseAnonKey) {
  console.log('Key Length:', supabaseAnonKey.length);
  console.log('Key Preview:', supabaseAnonKey.substring(0, 20) + '...');
}

// Verificar si están usando valores por defecto
if (supabaseUrl === 'https://your-project.supabase.co') {
  console.log('⚠️ Using default URL - environment not configured');
}

if (supabaseAnonKey === 'your-anon-key') {
  console.log('⚠️ Using default key - environment not configured');
}

// Verificar archivo .env.local
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
console.log('\n📁 Checking .env.local file...');

if (fs.existsSync(envPath)) {
  console.log('✅ .env.local exists');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  let hasSupabaseUrl = false;
  let hasSupabaseKey = false;
  
  lines.forEach(line => {
    if (line.includes('NEXT_PUBLIC_SUPABASE_URL')) {
      hasSupabaseUrl = true;
      console.log('✅ NEXT_PUBLIC_SUPABASE_URL found in .env.local');
    }
    if (line.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')) {
      hasSupabaseKey = true;
      console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY found in .env.local');
    }
  });
  
  if (!hasSupabaseUrl) {
    console.log('❌ NEXT_PUBLIC_SUPABASE_URL not found in .env.local');
  }
  if (!hasSupabaseKey) {
    console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local');
  }
} else {
  console.log('❌ .env.local does not exist');
}

console.log('\n🔧 Recommendations:');
console.log('1. Check if .env.local exists and has correct values');
console.log('2. Verify the Supabase project is active');
console.log('3. Check if the API keys are correct');
console.log('4. Ensure the project URL is correct');
