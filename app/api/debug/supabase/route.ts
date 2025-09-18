import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    console.log('🔍 DEBUG: Verificando configuración de Supabase');
    
    // Verificar variables de entorno
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('🔗 Supabase URL:', supabaseUrl ? '✅ Configurada' : '❌ Faltante');
    console.log('🔑 Supabase Anon Key:', supabaseAnonKey ? '✅ Configurada' : '❌ Faltante');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: 'Variables de entorno de Supabase no configuradas',
        details: {
          url: !!supabaseUrl,
          anonKey: !!supabaseAnonKey
        }
      }, { status: 500 });
    }

    // Crear cliente de Supabase
    const supabase = await createClient();
    
    // Hacer una consulta simple para probar la conexión
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    console.log('📊 Test query result:', { data, error });
    
    return NextResponse.json({
      success: true,
      message: 'Supabase configurado correctamente',
      connection: error ? 'Error' : 'OK',
      details: {
        url: !!supabaseUrl,
        anonKey: !!supabaseAnonKey,
        queryError: error?.message || null
      }
    });

  } catch (error) {
    console.error('💥 Error en debug:', error);
    return NextResponse.json({
      success: false,
      error: 'Error en debug de Supabase',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
