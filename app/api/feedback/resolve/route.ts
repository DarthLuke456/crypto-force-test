import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API Feedback Resolve - POST request iniciado');
    
    // Crear cliente de Supabase con clave anónima para verificar token
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
    
    // Obtener el token de autorización del header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ API Feedback Resolve - No se proporcionó token de autorización');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log('🔍 API Feedback Resolve - Token recibido, longitud:', token.length);
    
    // Verificar el token con Supabase
    const { data: { user }, error: userAuthError } = await supabaseAnon.auth.getUser(token);
    
    if (userAuthError || !user) {
      console.error('❌ API Feedback Resolve - Error de autenticación:', userAuthError?.message);
      return NextResponse.json(
        { error: 'Invalid token', details: userAuthError?.message },
        { status: 401 }
      );
    }

    console.log('✅ API Feedback Resolve - Usuario autenticado:', user.id, user.email);
    
    // Verificar que el usuario sea maestro
    const isMaestro = user.email && ['infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com'].includes(user.email);
    
    if (!isMaestro) {
      console.log('❌ API Feedback Resolve - Usuario no autorizado');
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { feedbackId } = body;

    console.log('🔍 API Feedback Resolve - Body recibido:', { feedbackId });

    // Validaciones básicas
    if (!feedbackId) {
      console.log('❌ API Feedback Resolve - Validación fallida: feedbackId faltante');
      return NextResponse.json(
        { error: 'Feedback ID is required' },
        { status: 400 }
      );
    }

    // Crear cliente de servicio para actualizar datos
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Actualizar el feedback como resuelto
    console.log('🔍 API Feedback Resolve - Marcando feedback como resuelto...');
    const { data, error } = await supabase
      .from('feedback')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', feedbackId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error al actualizar feedback:', error);
      return NextResponse.json(
        { error: 'Error al actualizar feedback', details: error.message },
        { status: 500 }
      );
    }
    
    console.log('✅ API Feedback Resolve - Feedback marcado como resuelto:', data);

    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('❌ Error en API feedback resolve:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
