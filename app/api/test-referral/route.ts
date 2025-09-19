import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('🔍 API /api/test-referral - Testing referral codes...');
    
    // Crear cliente Supabase sin autenticación
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Obtener todos los códigos de referido
    const { data: users, error } = await supabase
      .from('users')
      .select('email, nickname, referral_code')
      .like('referral_code', 'CRYPTOFORCE-%')
      .order('referral_code');

    if (error) {
      console.error('❌ Error obteniendo usuarios:', error);
      return NextResponse.json({ 
        success: false,
        error: 'Error obteniendo usuarios',
        details: error.message
      }, { status: 500 });
    }

    // Probar validación del código CRYPTOFORCE-DARTHLUKE
    const testCode = 'CRYPTOFORCE-DARTHLUKE';
    const { data: referrer, error: searchError } = await supabase
      .from('users')
      .select('id, nickname, email, user_level')
      .eq('referral_code', testCode)
      .single();

    console.log('🔍 Resultado de búsqueda para', testCode, ':', { referrer, searchError });

    return NextResponse.json({
      success: true,
      allUsers: users || [],
      testCode,
      testResult: {
        found: !!referrer,
        referrer: referrer || null,
        error: searchError || null
      }
    });

  } catch (error) {
    console.error('❌ Error en API de test:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
