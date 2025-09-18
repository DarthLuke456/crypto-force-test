import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    console.log('🔍 Simple API - GET request received');
    
    // Obtener estadísticas básicas sin autenticación por ahora
    const statsData = {
      total_active: 1,
      maestros_active: 1,
      darths_active: 0,
      others_active: 0,
      last_update: new Date().toISOString()
    };

    const activeUsers = [{
      user_id: '1e4c32ba-790d-44d3-b1ee-db7d145d314e',
      nickname: 'Darth Luke',
      user_level: 6,
      last_seen: new Date().toISOString(),
      current_page: '/dashboard/maestro/courses/tribunal-imperial',
      is_online: true
    }];

    console.log('🔍 Simple API - Returning data:', { statsData, activeUsers });

    return NextResponse.json({
      success: true,
      stats: {
        totalActive: statsData.total_active,
        maestrosActive: statsData.maestros_active,
        darthsActive: statsData.darths_active,
        othersActive: statsData.others_active,
        lastUpdate: statsData.last_update
      },
      activeUsers: activeUsers,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Simple API - Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('🔍 Simple API - POST request received:', body);
    
    return NextResponse.json({
      success: true,
      message: 'Actividad registrada correctamente (modo simple)',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Simple API - POST Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
