import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 TEST SIMPLE - POST request iniciado');
    
    const body = await request.json();
    console.log('🔍 TEST SIMPLE - Body recibido:', body);

    // Crear cliente Supabase
    console.log('🔍 TEST SIMPLE - Creando cliente Supabase...');
    const supabase = createRouteHandlerClient({ cookies });
    console.log('🔍 TEST SIMPLE - Cliente creado');

    // Test de conexión
    console.log('🔍 TEST SIMPLE - Probando conexión...');
    const { data: testData, error: testError } = await supabase
      .from('feedback')
      .select('count')
      .limit(1);
    
    console.log('🔍 TEST SIMPLE - Test conexión:', { testData, testError });

    if (testError) {
      console.error('❌ TEST SIMPLE - Error de conexión:', testError);
      return NextResponse.json({
        success: false,
        error: 'Error de conexión',
        details: testError
      }, { status: 500 });
    }

    // Test de inserción simple
    console.log('🔍 TEST SIMPLE - Probando inserción...');
    const { data, error } = await supabase
      .from('feedback')
      .insert([
        {
          user_id: 'test-user-123',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'Test Message',
          category: 'general'
        }
      ])
      .select()
      .single();

    console.log('🔍 TEST SIMPLE - Resultado inserción:', { data, error });

    if (error) {
      console.error('❌ TEST SIMPLE - Error de inserción:', error);
      return NextResponse.json({
        success: false,
        error: 'Error de inserción',
        details: error
      }, { status: 500 });
    }

    console.log('✅ TEST SIMPLE - Éxito:', data);

    return NextResponse.json({
      success: true,
      message: 'Test exitoso',
      data: data
    });

  } catch (error) {
    console.error('❌ TEST SIMPLE - Error general:', error);
    return NextResponse.json({
      success: false,
      error: 'Error general',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

