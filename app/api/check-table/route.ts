import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Check Table - GET request iniciado');
    
    const supabase = createRouteHandlerClient({ cookies });
    console.log('🔍 Check Table - Client creado');
    
    // Verificar estructura de la tabla
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .limit(0);

    console.log('🔍 Check Table - Resultado:', { data, error });

    if (error) {
      console.error('❌ Check Table - Error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      });
    }

    // Verificar columnas de la tabla
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'feedback' });

    console.log('🔍 Check Table - Columnas:', { columns, columnsError });

    return NextResponse.json({
      success: true,
      message: 'Tabla verificada',
      data: data,
      columns: columns
    });

  } catch (error) {
    console.error('❌ Check Table - Error general:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
