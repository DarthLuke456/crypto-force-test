import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    console.log('🔍 API Debug /api/debug/referral-stats - Iniciando...');
    
    const supabase = await createClient();
    console.log('✅ Cliente Supabase creado');
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('❌ Error de autenticación:', authError);
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    
    console.log('✅ Usuario autenticado:', user.email);
    
    // Verificar que la función SQL existe
    const { data: functionExists, error: functionError } = await supabase
      .rpc('get_user_referral_stats', { user_email_input: user.email });

    if (functionError) {
      console.error('❌ Error con función SQL get_user_referral_stats:', functionError);
      
      // Verificar si la función existe
      const { data: functions, error: listError } = await supabase
        .from('information_schema.routines')
        .select('routine_name')
        .eq('routine_schema', 'public')
        .eq('routine_name', 'get_user_referral_stats');
      
      if (listError) {
        console.error('❌ Error listando funciones:', listError);
      } else {
        console.log('📋 Funciones disponibles:', functions);
      }
      
      // Obtener datos básicos del usuario como fallback
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (profileError) {
        console.error('❌ Error obteniendo perfil:', profileError);
        return NextResponse.json({ 
          error: 'Error obteniendo perfil',
          functionError: functionError.message,
          profileError: profileError.message
        }, { status: 500 });
      }

      return NextResponse.json({
        debug: true,
        functionError: functionError.message,
        userProfile,
        message: 'Función SQL no disponible, usando datos básicos'
      });
    }

    console.log('✅ Función SQL ejecutada correctamente:', functionExists);

    return NextResponse.json({
      debug: true,
      success: true,
      functionResult: functionExists,
      message: 'Función SQL funcionando correctamente'
    });

  } catch (error) {
    console.error('❌ Error en API debug de referidos:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
