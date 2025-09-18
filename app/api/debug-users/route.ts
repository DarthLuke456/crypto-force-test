import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug Users - Iniciando consulta de usuarios...');
    
    // Crear cliente de Supabase con service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Obtener todos los usuarios
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(10);
    
    console.log('🔍 Debug Users - Usuarios encontrados:', users);
    console.log('🔍 Debug Users - Error:', usersError);
    
    if (usersError) {
      return NextResponse.json(
        { error: 'Error al obtener usuarios', details: usersError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      count: users?.length || 0,
      users: users || []
    });
    
  } catch (error) {
    console.error('❌ Error en debug users:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
