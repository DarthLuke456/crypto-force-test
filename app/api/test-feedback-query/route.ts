import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Test Feedback Query - Iniciando...');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Probar consulta simple
    console.log('🔍 Test Feedback Query - Probando consulta simple...');
    const { data: simpleData, error: simpleError } = await supabase
      .from('feedback')
      .select('id, subject, created_at')
      .limit(5);
    
    console.log('🔍 Test Feedback Query - Consulta simple resultado:', { simpleData, simpleError });
    
    // Probar consulta con join
    console.log('🔍 Test Feedback Query - Probando consulta con join...');
    const { data: joinData, error: joinError } = await supabase
      .from('feedback')
      .select(`
        id,
        user_id,
        email,
        subject,
        message,
        category,
        status,
        created_at,
        users:user_id (
          id,
          email,
          user_level
        )
      `)
      .limit(5);
    
    console.log('🔍 Test Feedback Query - Consulta con join resultado:', { joinData, joinError });
    
    return NextResponse.json({
      success: true,
      data: {
        simple: {
          data: simpleData,
          error: simpleError
        },
        join: {
          data: joinData,
          error: joinError
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error en test-feedback-query:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
