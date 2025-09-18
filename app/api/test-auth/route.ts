import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Test Auth - Iniciando...');
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Obtener el token de autorización del header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log('🔍 Test Auth - Token recibido, longitud:', token.length);
    
    // Verificar el token con Supabase
    const { data: { user }, error: userAuthError } = await supabase.auth.getUser(token);
    
    if (userAuthError || !user) {
      console.error('❌ Test Auth - Error de autenticación:', userAuthError?.message);
      return NextResponse.json(
        { error: 'Invalid token', details: userAuthError?.message },
        { status: 401 }
      );
    }

    console.log('✅ Test Auth - Usuario autenticado:', user.id, user.email);
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('❌ Error en test-auth:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
