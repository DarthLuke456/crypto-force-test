import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API My Feedback - Iniciando request...');
    
    // Intentar autenticación por cookies primero
    const supabase = createRouteHandlerClient({ cookies });
    console.log('🔍 API My Feedback - Cliente Supabase creado');

    // Obtener el usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('🔍 API My Feedback - Resultado auth:', { user: user?.id, error: authError });
    
    // Si no hay usuario por cookies, intentar por token Bearer
    if (authError || !user) {
      console.log('🔍 API My Feedback - Intentando autenticación por token Bearer...');
      
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        console.log('🔍 API My Feedback - Token encontrado, verificando...');
        
        const { data: { user: tokenUser }, error: tokenError } = await supabase.auth.getUser(token);
        
        if (tokenError || !tokenUser) {
          console.log('❌ API My Feedback - Error de autenticación por token:', tokenError);
          return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }
        
        console.log('✅ API My Feedback - Usuario autenticado por token:', tokenUser.id, tokenUser.email);
        console.log('🔍 API My Feedback - Buscando feedbacks para email (token):', tokenUser.email);
        
        // Crear cliente con service role key para consultas
        const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
        
        // Continuar con el usuario del token - buscar por email porque user_id puede ser null
        const { data: feedbacks, error } = await supabaseService
          .from('feedback')
          .select(`
            id,
            subject,
            message,
            response,
            response_by,
            response_at,
            status,
            created_at,
            updated_at,
            feedback_responses (
              id,
              response_text,
              response_by,
              response_by_email,
              created_at
            )
          `)
          .eq('email', tokenUser.email)
          .order('created_at', { ascending: false });

        console.log('🔍 API My Feedback - Query ejecutada (token), error:', error);
        console.log('🔍 API My Feedback - Raw feedbacks from DB (token):', feedbacks);
        console.log('🔍 API My Feedback - Query SQL equivalente: SELECT * FROM feedback WHERE email =', tokenUser.email);
        console.log('🔍 API My Feedback - Total feedbacks encontrados:', feedbacks?.length || 0);
        console.log('🔍 API My Feedback - Tipo de feedbacks:', typeof feedbacks);
        console.log('🔍 API My Feedback - Es array?:', Array.isArray(feedbacks));
        console.log('🔍 API My Feedback - Email del token:', tokenUser.email);
        console.log('🔍 API My Feedback - Email exacto en DB:', feedbacks?.length || 0, 'feedbacks encontrados');
        if (feedbacks && feedbacks.length > 0) {
          console.log('🔍 API My Feedback - Primer feedback:', feedbacks[0]);
        } else {
          console.log('❌ API My Feedback - NO HAY FEEDBACKS ENCONTRADOS para email:', tokenUser.email);
        
        // Probar consulta alternativa para debug
        console.log('🔍 API My Feedback - Probando consulta alternativa...');
        const { data: debugFeedbacks, error: debugError } = await supabaseService
          .from('feedback')
          .select('id, email, message, created_at')
          .eq('email', tokenUser.email);
        
        console.log('🔍 API My Feedback - Consulta debug resultado:', debugFeedbacks);
        console.log('🔍 API My Feedback - Consulta debug error:', debugError);
        
        // Verificar si hay feedbacks con user_id
        console.log('🔍 API My Feedback - Probando consulta por user_id...');
        const { data: debugFeedbacksByUserId, error: debugErrorByUserId } = await supabaseService
          .from('feedback')
          .select('id, email, user_id, message, created_at')
          .eq('user_id', tokenUser.id);
        
        console.log('🔍 API My Feedback - Consulta por user_id resultado:', debugFeedbacksByUserId);
        console.log('🔍 API My Feedback - Consulta por user_id error:', debugErrorByUserId);
        
        // Verificar todos los feedbacks para debug
        console.log('🔍 API My Feedback - Verificando todos los feedbacks...');
        const { data: allFeedbacks, error: allError } = await supabaseService
          .from('feedback')
          .select('id, email, user_id, message, created_at')
          .order('created_at', { ascending: false })
          .limit(5);
        
        console.log('🔍 API My Feedback - Últimos 5 feedbacks:', allFeedbacks);
        console.log('🔍 API My Feedback - Error en consulta general:', allError);
        }

        if (error) {
          console.log('❌ API My Feedback - Error al obtener feedback:', error);
          return NextResponse.json({ error: 'Error al obtener feedback' }, { status: 500 });
        }

        console.log('✅ API My Feedback - Feedback obtenido:', feedbacks?.length || 0, 'elementos');
        console.log('🔍 API My Feedback - Feedbacks detalle (token):', feedbacks);
        console.log('🔍 API My Feedback - Email buscado (token):', tokenUser.email);
        console.log('🔍 API My Feedback - User email (token):', tokenUser.email);

        return NextResponse.json({
          success: true,
          feedbacks: feedbacks || []
        });
      } else {
        console.log('❌ API My Feedback - No hay token Bearer ni cookies válidas');
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      }
    }

    console.log('✅ API My Feedback - Usuario autenticado:', user.id, user.email);
    console.log('🔍 API My Feedback - Buscando feedbacks para email:', user.email);

    // Crear cliente con service role key para consultas
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
    
    // Obtener feedback del usuario actual - buscar por email porque user_id puede ser null
    const { data: feedbacks, error } = await supabaseService
      .from('feedback')
      .select(`
        id,
        subject,
        message,
        response,
        response_by,
        response_at,
        status,
        created_at,
        updated_at,
        feedback_responses (
          id,
          response_text,
          response_by,
          response_by_email,
          created_at
        )
      `)
      .eq('email', user.email)
      .order('created_at', { ascending: false });

    console.log('🔍 API My Feedback - Query ejecutada, error:', error);
    console.log('🔍 API My Feedback - Raw feedbacks from DB:', feedbacks);
    console.log('🔍 API My Feedback - Query SQL equivalente: SELECT * FROM feedback WHERE email =', user.email);
    console.log('🔍 API My Feedback - Total feedbacks encontrados:', feedbacks?.length || 0);
    console.log('🔍 API My Feedback - Tipo de feedbacks:', typeof feedbacks);
    console.log('🔍 API My Feedback - Es array?:', Array.isArray(feedbacks));
    if (feedbacks && feedbacks.length > 0) {
      console.log('🔍 API My Feedback - Primer feedback:', feedbacks[0]);
    }

    if (error) {
      console.log('❌ API My Feedback - Error al obtener feedback:', error);
      return NextResponse.json({ error: 'Error al obtener feedback' }, { status: 500 });
    }

    console.log('✅ API My Feedback - Feedback obtenido:', feedbacks?.length || 0, 'elementos');
    console.log('🔍 API My Feedback - Feedbacks detalle:', feedbacks);
    console.log('🔍 API My Feedback - Email buscado:', user.email);
    console.log('🔍 API My Feedback - User email:', user.email);

    return NextResponse.json({
      success: true,
      feedbacks: feedbacks || []
    });

  } catch (error) {
    console.error('❌ API My Feedback - Error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
