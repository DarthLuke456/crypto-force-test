import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API Feedback Respond - POST request iniciado');
    
    // Crear cliente de Supabase con clave anónima para verificar token
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
    
    // Obtener el token de autorización del header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ API Feedback Respond - No se proporcionó token de autorización');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log('🔍 API Feedback Respond - Token recibido, longitud:', token.length);
    
    // Verificar el token con Supabase
    const { data: { user }, error: userAuthError } = await supabaseAnon.auth.getUser(token);
    
    if (userAuthError || !user) {
      console.error('❌ API Feedback Respond - Error de autenticación:', userAuthError?.message);
      return NextResponse.json(
        { error: 'Invalid token', details: userAuthError?.message },
        { status: 401 }
      );
    }

    console.log('✅ API Feedback Respond - Usuario autenticado:', user.id, user.email);
    
    // Verificar que el usuario sea maestro
    const isMaestro = user.email && ['infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com'].includes(user.email);
    
    if (!isMaestro) {
      console.log('❌ API Feedback Respond - Usuario no autorizado');
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { feedbackId, response } = body;

    console.log('🔍 API Feedback Respond - Body recibido:', { feedbackId, response });

    // Validaciones básicas
    if (!feedbackId || !response) {
      console.log('❌ API Feedback Respond - Validación fallida: feedbackId o response faltante');
      return NextResponse.json(
        { error: 'Feedback ID and response are required' },
        { status: 400 }
      );
    }

    // Crear cliente de servicio para actualizar datos
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Agregar respuesta a la tabla de respuestas (conversación)
    console.log('🔍 API Feedback Respond - Agregando respuesta a la conversación...');
    const { data: responseData, error: responseError } = await supabase
      .from('feedback_responses')
      .insert({
        feedback_id: feedbackId,
        response_text: response.trim(),
        response_by: user.email,
        response_by_email: user.email
      })
      .select()
      .single();

    if (responseError) {
      console.error('❌ Error al agregar respuesta:', responseError);
      return NextResponse.json(
        { error: 'Error al agregar respuesta', details: responseError.message },
        { status: 500 }
      );
    }

    // Actualizar el feedback con la última respuesta (para compatibilidad)
    console.log('🔍 API Feedback Respond - Actualizando feedback con última respuesta...');
    const { data, error } = await supabase
      .from('feedback')
      .update({
        response: response.trim(),
        response_by: user.email,
        response_at: new Date().toISOString(),
        status: 'in_progress',
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
    
    console.log('✅ API Feedback Respond - Feedback actualizado exitosamente:', data);
    console.log('✅ API Feedback Respond - Respuesta agregada a conversación:', responseData);

    return NextResponse.json({
      success: true,
      data: data,
      response: responseData
    });

  } catch (error) {
    console.error('❌ Error en API feedback respond:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
