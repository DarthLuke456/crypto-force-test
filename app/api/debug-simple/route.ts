import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 DEBUG SIMPLE - POST request iniciado');
    
    const body = await request.json();
    console.log('🔍 DEBUG SIMPLE - Body recibido:', body);
    
    // Simular inserción exitosa
    const mockData = {
      id: 'test-123',
      subject: body.subject,
      message: body.message,
      category: body.category || 'general',
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    console.log('✅ DEBUG SIMPLE - Mock data creado:', mockData);
    
    return NextResponse.json({
      success: true,
      message: 'Debug exitoso',
      data: mockData
    });

  } catch (error) {
    console.error('❌ DEBUG SIMPLE - Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

