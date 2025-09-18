import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    console.log('🔍 API /api/referrals/stats-client - Iniciando...');
    
    // Obtener el token de autorización del header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ No se encontró token de autorización');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔑 Token recibido:', token ? 'Sí' : 'No');

    // Crear cliente Supabase con el token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('❌ Error de autenticación:', authError);
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    
    console.log('✅ Usuario autenticado:', user.email);
    
    // Obtener datos básicos del perfil del usuario
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id, nickname, user_level, referral_code, total_referrals')
      .eq('email', user.email)
      .single();

    if (profileError) {
      console.error('❌ Error obteniendo perfil de usuario:', profileError);
      return NextResponse.json({ error: 'Perfil de usuario no encontrado' }, { status: 404 });
    }

    // Obtener referidos recientes
    const { data: recentReferrals, error: referralsError } = await supabase
      .from('users')
      .select('email, created_at')
      .eq('referred_by', userProfile.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (referralsError) {
      console.warn('⚠️ Error obteniendo referidos recientes:', referralsError);
    }

    // Preparar respuesta
    const stats = {
      referral_code: userProfile.referral_code || 'NO_CODE',
      total_referrals: userProfile.total_referrals || 0,
      total_earnings: 0,
      user_level: userProfile.user_level || 1,
      recent_referrals: recentReferrals?.map(ref => ({
        email: ref.email,
        date: ref.created_at
      })) || []
    };

    console.log('✅ Estadísticas obtenidas:', stats);
    return NextResponse.json(stats);

  } catch (error) {
    console.error('❌ Error en API de estadísticas de referidos:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
