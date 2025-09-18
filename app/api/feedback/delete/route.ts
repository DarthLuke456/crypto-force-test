import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

export async function DELETE(request: NextRequest) {
  try {
    console.log('🔍 API Feedback Delete - DELETE request iniciado');
    
    // Crear cliente de Supabase con clave anónima para verificar token
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
    
    // Obtener el token de autorización del header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ API Feedback Delete - No se proporcionó token de autorización');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log('🔍 API Feedback Delete - Token recibido, longitud:', token.length);
    
    // Verificar el token con Supabase
    const { data: { user }, error: userAuthError } = await supabaseAnon.auth.getUser(token);
    
    if (userAuthError || !user) {
      console.error('❌ API Feedback Delete - Error de autenticación:', userAuthError?.message);
      return NextResponse.json(
        { error: 'Invalid token', details: userAuthError?.message },
        { status: 401 }
      );
    }

    console.log('✅ API Feedback Delete - Usuario autenticado:', user.id, user.email);
    
    // Verificar que el usuario sea maestro
    const isMaestro = user.email && ['infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com'].includes(user.email);
    
    if (!isMaestro) {
      console.log('❌ API Feedback Delete - Usuario no autorizado');
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const feedbackId = searchParams.get('id');

    console.log('🔍 API Feedback Delete - Feedback ID:', feedbackId);

    // Validaciones básicas
    if (!feedbackId) {
      console.log('❌ API Feedback Delete - Validación fallida: feedbackId faltante');
      return NextResponse.json(
        { error: 'Feedback ID is required' },
        { status: 400 }
      );
    }

    // Crear cliente de servicio para eliminar datos
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Eliminar el feedback
    console.log('🔍 API Feedback Delete - Eliminando feedback...');
    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', feedbackId);

    if (error) {
      console.error('❌ Error al eliminar feedback:', error);
      return NextResponse.json(
        { error: 'Error al eliminar feedback', details: error.message },
        { status: 500 }
      );
    }
    
    console.log('✅ API Feedback Delete - Feedback eliminado exitosamente');

    return NextResponse.json({
      success: true,
      message: 'Feedback eliminado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error en API feedback delete:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
