import { createClient } from '@supabase/supabase-js'
import { handleAuthError } from './authUtils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

// Si las variables de entorno no están configuradas, usar valores de prueba
if (supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
  console.warn('⚠️ Variables de entorno de Supabase no configuradas, usando valores de prueba');
}

// Debug: Verificar variables de entorno
console.log('🔍 Supabase Client - Configuración:', {
  supabaseUrl: supabaseUrl ? 'Configurado' : 'NO CONFIGURADO',
  supabaseAnonKey: supabaseAnonKey ? 'Configurado' : 'NO CONFIGURADO',
  urlLength: supabaseUrl?.length || 0,
  keyLength: supabaseAnonKey?.length || 0
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'crypto-force-dashboard'
    }
  }
});

// Global error handler for Supabase
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
    // Handle token refresh errors silently
    // Note: Supabase handles auth errors through the event parameter
    // and session will be null if there's an error
    if (event === 'TOKEN_REFRESHED' && !session) {
      console.log('🔄 Supabase: Token refresh failed, session is null');
    }
  }
});
