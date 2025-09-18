import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Get Token - Iniciando...');
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Obtener la sesión actual
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({
        success: false,
        error: 'No hay sesión activa',
        details: sessionError?.message
      });
    }
    
    console.log('✅ Get Token - Sesión encontrada:', session.user.email);
    
    return NextResponse.json({
      success: true,
      token: session.access_token,
      user: {
        id: session.user.id,
        email: session.user.email
      }
    });
    
  } catch (error) {
    console.error('❌ Error en get-token:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
