import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Test Feedback Insert - Iniciando prueba...');

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Obtener el token de autorización del header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('🔍 Test - Token recibido, longitud:', token.length);

    // Verificar el token con Supabase
    const { data: { user }, error: userAuthError } = await supabase.auth.getUser(token);

    if (userAuthError || !user) {
      console.error('❌ Test - Error de autenticación:', userAuthError?.message);
      return NextResponse.json(
        { error: 'Invalid token', details: userAuthError?.message },
        { status: 401 }
      );
    }

    console.log('✅ Test - Usuario autenticado:', user.id, user.email);

    // Probar inserción simple
    const testData = {
      user_id: user.id,
      email: user.email,
      subject: 'Test Subject',
      message: 'Test Message',
      category: 'general',
      status: 'pending',
      priority: 'medium'
    };

    console.log('🔍 Test - Intentando insertar datos de prueba:', testData);

    const { data, error } = await supabase
      .from('feedback')
      .insert([testData])
      .select()
      .single();

    if (error) {
      console.error('❌ Test - Error al insertar:', error);
      console.error('❌ Test - Detalles del error:', {
        code: error.code,
        hint: error.hint,
        details: error.details,
        message: error.message,
      });
      return NextResponse.json(
        { error: 'Error al insertar', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Test - Inserción exitosa:', data);

    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error: any) {
    console.error('❌ Test - Error inesperado:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

