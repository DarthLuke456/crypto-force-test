import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Verificar que sea un usuario Maestro
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('user_level, email')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: 'Perfil de usuario no encontrado' },
        { status: 404 }
      );
    }

    // Solo permitir a Maestros (user_level = 0) o usuarios autorizados
    const MAESTRO_AUTHORIZED_EMAILS = [
      'coeurdeluke.js@gmail.com',
      'infocryptoforce@gmail.com'
    ];

    if (userProfile.user_level !== 0 && !MAESTRO_AUTHORIZED_EMAILS.includes(userProfile.email)) {
      return NextResponse.json(
        { error: 'No autorizado para realizar esta acción' },
        { status: 403 }
      );
    }

    // Ejecutar la función SQL para corregir códigos de referido
    const { data: corrections, error: sqlError } = await supabase
      .rpc('update_all_referral_codes');

    if (sqlError) {
      console.error('Error ejecutando corrección de códigos:', sqlError);
      return NextResponse.json(
        { error: 'Error ejecutando corrección de códigos de referido' },
        { status: 500 }
      );
    }

    // Obtener estadísticas actualizadas
    const { data: stats, error: statsError } = await supabase
      .rpc('get_referral_stats');

    if (statsError) {
      console.error('Error obteniendo estadísticas:', statsError);
    }

    // Obtener lista de usuarios con sus códigos corregidos
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, nickname, referral_code, referred_by, created_at')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('Error obteniendo usuarios:', usersError);
    }

    return NextResponse.json({
      success: true,
      message: 'Códigos de referido corregidos exitosamente',
      corrections: corrections || [],
      stats: stats || {},
      users: users || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en corrección de códigos de referido:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
