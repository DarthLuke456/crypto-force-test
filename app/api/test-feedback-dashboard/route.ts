import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Test Feedback Dashboard - Iniciando...');
    
    // Simular la llamada del dashboard
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
    
    // Obtener el token de autorización del header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log('🔍 Test Feedback Dashboard - Token recibido, longitud:', token.length);
    
    // Verificar el token con Supabase
    const { data: { user }, error: userAuthError } = await supabaseAnon.auth.getUser(token);
    
    if (userAuthError || !user) {
      console.error('❌ Test Feedback Dashboard - Error de autenticación:', userAuthError?.message);
      return NextResponse.json(
        { error: 'Invalid token', details: userAuthError?.message },
        { status: 401 }
      );
    }

    console.log('✅ Test Feedback Dashboard - Usuario autenticado:', user.id, user.email);
    
    // Crear cliente de servicio para consultar datos
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verificar que el usuario sea maestro
    const { data: userData, error: userDataError } = await supabase
      .from('users')
      .select('user_level, email')
      .eq('id', user.id)
      .single();

    if (userDataError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verificar si es maestro
    const isMaestro = userData.user_level === 6 || 
                     ['infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com'].includes(userData.email);
    
    if (!isMaestro) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    console.log('✅ Test Feedback Dashboard - Usuario es maestro:', isMaestro);
    
    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    console.log('🔍 Test Feedback Dashboard - Parámetros:', { page, limit, status, category });

    // Construir consulta
    let query = supabase
      .from('feedback')
      .select(`
        id,
        user_id,
        email,
        nickname,
        whatsapp,
        subject,
        message,
        category,
        priority,
        status,
        created_at,
        updated_at,
        resolved_at,
        response,
        response_by,
        response_at
      `)
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (status) {
      query = query.eq('status', status);
    }
    if (category) {
      query = query.eq('category', category);
    }

    // Paginación
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    console.log('🔍 Test Feedback Dashboard - Ejecutando consulta...');
    const { data, error, count } = await query;
    
    console.log('🔍 Test Feedback Dashboard - Resultado de consulta:');
    console.log('🔍 Test Feedback Dashboard - Data:', data);
    console.log('🔍 Test Feedback Dashboard - Error:', error);
    console.log('🔍 Test Feedback Dashboard - Count:', count);

    if (error) {
      console.error('❌ Test Feedback Dashboard - Error al obtener feedback:', error);
      return NextResponse.json(
        { error: 'Error al obtener feedback' },
        { status: 500 }
      );
    }

    console.log('✅ Test Feedback Dashboard - Consulta exitosa, devolviendo datos');
    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
    
  } catch (error) {
    console.error('❌ Error en test-feedback-dashboard:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
