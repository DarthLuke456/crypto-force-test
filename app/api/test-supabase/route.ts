import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Test Supabase - GET request iniciado');
    
    const supabase = createRouteHandlerClient({ cookies });
    console.log('🔍 Test Supabase - Client creado');
    
    // Test simple de conexión
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .limit(1);

    console.log('🔍 Test Supabase - Resultado:', { data, error });

    if (error) {
      console.error('❌ Test Supabase - Error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Conexión a Supabase exitosa',
      data: data
    });

  } catch (error) {
    console.error('❌ Test Supabase - Error general:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
