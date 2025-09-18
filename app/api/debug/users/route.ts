import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    console.log('👥 DEBUG: Verificando usuarios en la base de datos');
    
    const supabase = await createClient();
    
    // Obtener lista de usuarios (solo emails para verificar)
    const { data: users, error } = await supabase
      .from('users')
      .select('email, nickname, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('❌ Error obteniendo usuarios:', error);
      return NextResponse.json({
        success: false,
        error: 'Error obteniendo usuarios',
        details: error.message
      }, { status: 500 });
    }
    
    console.log('👥 Usuarios encontrados:', users?.length || 0);
    
    return NextResponse.json({
      success: true,
      message: `Encontrados ${users?.length || 0} usuarios`,
      users: users?.map(user => ({
        email: user.email,
        nickname: user.nickname,
        created_at: user.created_at
      })) || []
    });

  } catch (error) {
    console.error('💥 Error en debug de usuarios:', error);
    return NextResponse.json({
      success: false,
      error: 'Error en debug de usuarios',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
