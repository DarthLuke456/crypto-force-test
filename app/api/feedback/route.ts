import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API Feedback - POST request iniciado');
    console.log('🔍 API Feedback - URL:', request.url);
    console.log('🔍 API Feedback - Method:', request.method);
    console.log('🔍 API Feedback - Headers:', Object.fromEntries(request.headers.entries()));
    
    const body = await request.json();
    const { subject, message, category, user_id, email, nickname, whatsapp } = body;

    console.log('🔍 API Feedback - Body recibido:', { subject, message, category, user_id, email, nickname, whatsapp });
    console.log('🔍 API Feedback - user_id type:', typeof user_id);
    console.log('🔍 API Feedback - user_id value:', user_id);

    // Validaciones básicas
    if (!subject || !message) {
      console.log('❌ API Feedback - Validación fallida: subject o message faltante');
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    // Verificar variables de entorno
    console.log('🔍 API Feedback - Verificando variables de entorno...');
    console.log('🔍 API Feedback - supabaseUrl:', supabaseUrl);
    console.log('🔍 API Feedback - supabaseServiceKey existe:', !!supabaseServiceKey);

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ API Feedback - Variables de entorno faltantes');
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta' },
        { status: 500 }
      );
    }

    // Crear cliente de Supabase con service role key
    console.log('🔍 API Feedback - Creando cliente de Supabase...');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verificar conexión a Supabase
    console.log('🔍 API Feedback - Verificando conexión a Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('feedback')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ API Feedback - Error de conexión a Supabase:', testError);
      return NextResponse.json(
        { error: 'Error de conexión a la base de datos', details: testError.message },
        { status: 500 }
      );
    }

    console.log('✅ API Feedback - Conexión a Supabase exitosa');

    // Usar el user_id directamente si está presente
    let validUserId = user_id;
    if (user_id) {
      console.log('🔍 API Feedback - Usando user_id proporcionado:', user_id);
      validUserId = user_id;
    } else {
      console.log('⚠️ API Feedback - No se proporcionó user_id, usando null');
      validUserId = null;
    }

    // Preparar datos para inserción
    const insertData = {
      user_id: validUserId,
      email: email || 'unknown@example.com',
      nickname: nickname || null,
      whatsapp: whatsapp || null,
      subject: subject.trim(),
      message: message.trim(),
      category: category || 'general',
      status: 'pending',
      priority: 'medium'
    };

    console.log('🔍 API Feedback - Datos para inserción:', insertData);
    console.log('🔍 API Feedback - user_id que se va a guardar:', validUserId);
    console.log('🔍 API Feedback - email que se va a guardar:', email);
    console.log('🔍 API Feedback - validUserId type:', typeof validUserId);
    console.log('🔍 API Feedback - validUserId === null:', validUserId === null);
    console.log('🔍 API Feedback - validUserId === undefined:', validUserId === undefined);

    // Insertar feedback en la base de datos
    console.log('🔍 API Feedback - Insertando feedback...');
    
    // Si hay un error de clave foránea, intentar sin user_id
    let { data, error } = await supabase
      .from('feedback')
      .insert(insertData)
      .select()
      .single();

    if (error && error.code === '23503') {
      console.log('⚠️ API Feedback - Error de clave foránea, intentando sin user_id...');
      const insertDataWithoutUserId = { ...insertData, user_id: null };
      
      const { data: retryData, error: retryError } = await supabase
        .from('feedback')
        .insert(insertDataWithoutUserId)
        .select()
        .single();
      
      if (retryError) {
        console.error('❌ Error al insertar feedback (segundo intento):', retryError);
        return NextResponse.json(
          { error: 'Error al guardar feedback', details: retryError.message },
          { status: 500 }
        );
      }
      
      data = retryData;
      error = null;
    }

    if (error) {
      console.error('❌ Error al insertar feedback:', error);
      console.error('❌ Detalles del error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json(
        { error: 'Error al guardar feedback', details: error.message },
        { status: 500 }
      );
    }
    
    console.log('✅ API Feedback - Feedback guardado exitosamente:', data);
    console.log('🔍 API Feedback - Feedback guardado con user_id:', data?.user_id);
    console.log('🔍 API Feedback - Feedback guardado con email:', data?.email);
    console.log('🔍 API Feedback - Feedback guardado con id:', data?.id);

    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('❌ Error en API feedback:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API Feedback GET - Iniciando request');
    
    // Crear cliente de Supabase con clave anónima para verificar token
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
    
    // Obtener el token de autorización del header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ API Feedback GET - No se proporcionó token de autorización');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verificar el token con Supabase usando cliente anónimo
    const { data: { user }, error: userError } = await supabaseAnon.auth.getUser(token);
    
    if (userError || !user) {
      console.error('❌ API Feedback GET - Error de autenticación:', userError?.message);
      return NextResponse.json(
        { error: 'Invalid token', details: userError?.message },
        { status: 401 }
      );
    }
    
    console.log('✅ API Feedback GET - Usuario autenticado:', user.email);
    
    // Crear cliente de servicio para consultar datos
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verificar si es maestro usando email directamente
    const isMaestro = user.email && ['infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com'].includes(user.email);
    
    if (!isMaestro) {
      console.log('❌ API Feedback GET - Usuario no autorizado:', user.email);
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    console.log('✅ API Feedback GET - Usuario autorizado como maestro');

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Construir consulta con respuestas del hilo de conversación
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
        response_at,
        feedback_responses (
          id,
          response_text,
          response_by,
          response_by_email,
          created_at
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (search) {
      query = query.or(`subject.ilike.%${search}%,message.ilike.%${search}%,email.ilike.%${search}%,nickname.ilike.%${search}%`);
    }

    // Paginación
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Error al obtener feedback:', error);
      return NextResponse.json(
        { error: 'Error al obtener feedback', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ API Feedback GET - Feedback obtenido exitosamente:', data?.length || 0, 'elementos');
    console.log('🔍 API Feedback GET - Datos de feedback:', data?.map(f => ({ id: f.id, email: f.email, nickname: f.nickname, whatsapp: f.whatsapp })));

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
    console.error('❌ Error en API feedback GET:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
