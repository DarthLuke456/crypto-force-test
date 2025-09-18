import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API Feedback Test - POST request iniciado');
    
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();
    
    console.log('🔍 API Feedback Test - Body recibido:', body);

    // Probar conexión a Supabase
    console.log('🔍 API Feedback Test - Probando conexión a Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('feedback')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ API Feedback Test - Error de conexión:', testError);
      return NextResponse.json(
        { error: 'Error de conexión a Supabase', details: testError.message },
        { status: 500 }
      );
    }

    console.log('✅ API Feedback Test - Conexión a Supabase exitosa');

    // Probar inserción simple
    console.log('🔍 API Feedback Test - Probando inserción simple...');
    const { data, error } = await supabase
      .from('feedback')
      .insert([
        {
          user_id: 'test-user-id',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'Test Message',
          category: 'general'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ API Feedback Test - Error de inserción:', error);
      console.error('❌ API Feedback Test - Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'Error de inserción', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ API Feedback Test - Inserción exitosa:', data);

    return NextResponse.json({
      success: true,
      message: 'Test exitoso',
      data: data
    });

  } catch (error) {
    console.error('❌ API Feedback Test - Error general:', error);
    console.error('❌ API Feedback Test - Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: 'Error en test', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
