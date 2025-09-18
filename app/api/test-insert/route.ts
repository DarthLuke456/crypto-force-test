import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Test Insert - POST request iniciado');
    
    const supabase = createRouteHandlerClient({ cookies });
    console.log('🔍 Test Insert - Client creado');
    
    // Test de inserción simple
    const testData = {
      user_id: 'test-user-123',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test Message',
      category: 'general'
    };
    
    console.log('🔍 Test Insert - Insertando datos:', testData);
    
    const { data, error } = await supabase
      .from('feedback')
      .insert([testData])
      .select()
      .single();

    console.log('🔍 Test Insert - Resultado:', { data, error });

    if (error) {
      console.error('❌ Test Insert - Error:', error);
      console.error('❌ Test Insert - Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Inserción exitosa',
      data: data
    });

  } catch (error) {
    console.error('❌ Test Insert - Error general:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
