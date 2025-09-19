import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: Verificando conexión a Supabase...');
    
    // Verificar conexión básica
    const { data: testData, error: testError } = await supabase
      .from('tribunal_content')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Error de conexión:', testError);
      return NextResponse.json({
        success: false,
        error: 'Error de conexión a Supabase',
        details: testError
      }, { status: 500 });
    }

    // Verificar estructura de la tabla
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { table_name: 'tribunal_content' });

    console.log('✅ Conexión exitosa a Supabase');
    
    return NextResponse.json({
      success: true,
      message: 'Conexión a Supabase exitosa',
      testData,
      tableInfo: tableInfo || 'No se pudo obtener info de tabla'
    });

  } catch (error) {
    console.error('❌ Error en debug:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔍 Debug: Probando inserción con datos:', body);

    // Probar inserción con datos de prueba
    const testData = {
      title: 'Test Debug',
      subtitle: 'Test subtitle',
      content: [],
      level: 1,
      category: 'theoretical',
      is_published: false,
      is_featured: false,
      sort_order: 0,
      created_by: 'debug@test.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('tribunal_content')
      .insert(testData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error en inserción de prueba:', error);
      return NextResponse.json({
        success: false,
        error: 'Error en inserción de prueba',
        details: error
      }, { status: 500 });
    }

    console.log('✅ Inserción de prueba exitosa:', data);
    
    return NextResponse.json({
      success: true,
      message: 'Inserción de prueba exitosa',
      data
    });

  } catch (error) {
    console.error('❌ Error en debug POST:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error
    }, { status: 500 });
  }
}
