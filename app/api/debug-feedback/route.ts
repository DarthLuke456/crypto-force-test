import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug Feedback - Iniciando verificación...');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verificar si la tabla feedback existe
    console.log('🔍 Debug Feedback - Verificando tabla feedback...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('feedback')
      .select('*')
      .limit(1);
    
    console.log('🔍 Debug Feedback - Tabla feedback existe:', !tableError);
    console.log('🔍 Debug Feedback - Error de tabla:', tableError);
    
    if (tableError) {
      return NextResponse.json({
        success: false,
        error: 'Tabla feedback no existe o no es accesible',
        details: tableError.message
      });
    }
    
    // Contar total de feedbacks
    console.log('🔍 Debug Feedback - Contando total de feedbacks...');
    const { count, error: countError } = await supabase
      .from('feedback')
      .select('*', { count: 'exact', head: true });
    
    console.log('🔍 Debug Feedback - Total de feedbacks:', count);
    console.log('🔍 Debug Feedback - Error de conteo:', countError);
    
    // Obtener todos los feedbacks
    console.log('🔍 Debug Feedback - Obteniendo todos los feedbacks...');
    const { data: allFeedbacks, error: allError } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('🔍 Debug Feedback - Feedbacks obtenidos:', allFeedbacks?.length || 0);
    console.log('🔍 Debug Feedback - Error al obtener:', allError);
    
    return NextResponse.json({
      success: true,
      data: {
        tableExists: !tableError,
        totalCount: count,
        feedbacks: allFeedbacks || [],
        errors: {
          table: tableError ? String((tableError as any).message || 'Unknown error') : null,
          count: countError ? String((countError as any).message || 'Unknown error') : null,
          all: allError ? String((allError as any).message || 'Unknown error') : null
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error en debug feedback:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
