import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API Feedback Mock - POST request iniciado');
    
    const body = await request.json();
    const { subject, message, category } = body;
    
    console.log('🔍 API Feedback Mock - Body recibido:', { subject, message, category });
    
    // Simular inserción exitosa
    const mockData = {
      id: `mock-${Date.now()}`,
      subject: subject.trim(),
      message: message.trim(),
      category: category || 'general',
      status: 'pending',
      priority: 'medium',
      created_at: new Date().toISOString()
    };
    
    console.log('✅ API Feedback Mock - Datos simulados:', mockData);
    
    return NextResponse.json({
      success: true,
      data: mockData
    });
    
  } catch (error) {
    console.error('❌ Error en API feedback mock:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
