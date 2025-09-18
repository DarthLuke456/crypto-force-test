import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  try {
    // Obtener el token del header Authorization
    const authHeader = request.headers.get('authorization');
    console.log('🔍 API Debug - Authorization header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ API Debug - No valid authorization header');
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    console.log('🔍 API Debug - Token (first 20 chars):', token.substring(0, 20) + '...');
    
    // Verificar autenticación con el token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    console.log('🔍 API Debug - Auth result:', { 
      hasUser: !!user, 
      hasError: !!authError,
      userId: user?.id,
      userEmail: user?.email 
    });
    
    if (authError || !user) {
      console.log('❌ API Debug - Authentication failed:', authError);
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Obtener estadísticas de usuarios activos usando la función de la base de datos
    const { data: stats, error: statsError } = await supabase
      .rpc('get_active_users_stats');

    if (statsError) {
      console.error('Error obteniendo estadísticas de usuarios activos:', statsError);
      return NextResponse.json(
        { error: 'Error obteniendo estadísticas' },
        { status: 500 }
      );
    }

    // Obtener detalles de usuarios activos
    const { data: activeUsers, error: usersError } = await supabase
      .rpc('get_active_users_details');

    if (usersError) {
      console.error('Error obteniendo usuarios activos:', usersError);
      return NextResponse.json(
        { error: 'Error obteniendo usuarios activos' },
        { status: 500 }
      );
    }

    const statsData = stats?.[0] || {
      total_active: 0,
      maestros_active: 0,
      darths_active: 0,
      others_active: 0,
      last_update: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      stats: {
        totalActive: statsData.total_active,
        maestrosActive: statsData.maestros_active,
        darthsActive: statsData.darths_active,
        othersActive: statsData.others_active,
        lastUpdate: statsData.last_update
      },
      activeUsers: activeUsers || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error inesperado en API de usuarios activos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { user_id, nickname, user_level, current_page } = await request.json();
    console.log('🔍 API Debug - POST request data:', { user_id, nickname, user_level, current_page });

    if (!user_id || !nickname) {
      return NextResponse.json(
        { error: 'user_id y nickname son requeridos' },
        { status: 400 }
      );
    }

    // Obtener el token del header Authorization
    const authHeader = request.headers.get('authorization');
    console.log('🔍 API Debug - POST Authorization header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ API Debug - POST No valid authorization header');
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    console.log('🔍 API Debug - POST Token (first 20 chars):', token.substring(0, 20) + '...');
    
    // Verificar autenticación con el token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    console.log('🔍 API Debug - POST Auth result:', { 
      hasUser: !!user, 
      hasError: !!authError,
      userId: user?.id,
      userEmail: user?.email,
      requestedUserId: user_id,
      userIdsMatch: user?.id === user_id
    });
    
    if (authError || !user || user.id !== user_id) {
      console.log('❌ API Debug - POST Authentication failed:', { authError, userId: user?.id, requestedUserId: user_id });
      return NextResponse.json(
        { error: 'No autenticado o usuario no coincide' },
        { status: 401 }
      );
    }

    // Registrar/actualizar actividad del usuario
    const { error: upsertError } = await supabase
      .from('user_activity')
      .upsert({
        user_id,
        nickname,
        user_level: user_level || 1,
        last_activity: new Date().toISOString(),
        is_online: true,
        current_page: current_page || '/',
        session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      });

    if (upsertError) {
      console.error('Error registrando actividad:', upsertError);
      return NextResponse.json(
        { error: 'Error registrando actividad' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Actividad registrada correctamente',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error inesperado registrando actividad:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id es requerido' },
        { status: 400 }
      );
    }

    // Obtener el token del header Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar autenticación con el token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user || user.id !== user_id) {
      return NextResponse.json(
        { error: 'No autenticado o usuario no coincide' },
        { status: 401 }
      );
    }

    // Marcar usuario como offline
    const { error: updateError } = await supabase
      .from('user_activity')
      .update({
        is_online: false,
        last_activity: new Date().toISOString()
      })
      .eq('user_id', user_id);

    if (updateError) {
      console.error('Error marcando usuario como offline:', updateError);
      return NextResponse.json(
        { error: 'Error marcando usuario como offline' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario marcado como offline',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error inesperado marcando usuario offline:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
