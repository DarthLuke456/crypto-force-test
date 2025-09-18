import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    console.log('🔍 API /api/referrals/validate-public - Iniciando...');
    
    // Crear cliente Supabase sin autenticación (para validación pública)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    console.log('✅ Cliente Supabase público creado');
    
    // Obtener datos del request
    const { code } = await request.json();
    
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ 
        success: false, 
        error: 'Código de referido requerido' 
      }, { status: 400 });
    }

    console.log('🔍 Validando código público:', code);

    // Buscar usuario con ese código de referido
    const { data: referrer, error: searchError } = await supabase
      .from('users')
      .select('id, nickname, email, user_level')
      .eq('referral_code', code.trim())
      .single();

    if (searchError) {
      if (searchError.code === 'PGRST116') {
        // No se encontró ningún usuario con ese código
        console.log('❌ Código no válido:', code);
        return NextResponse.json({
          success: true,
          valid: false,
          error: 'Código de referido no válido'
        });
      }
      
      console.error('❌ Error buscando referido:', searchError);
      return NextResponse.json({
        success: false,
        error: 'Error validando código de referido'
      }, { status: 500 });
    }

    if (!referrer) {
      console.log('❌ Código no válido:', code);
      return NextResponse.json({
        success: true,
        valid: false,
        error: 'Código de referido no válido'
      });
    }

    console.log('✅ Código válido para:', referrer.nickname);

    return NextResponse.json({
      success: true,
      valid: true,
      referrer: {
        nickname: referrer.nickname,
        email: referrer.email,
        user_level: referrer.user_level
      }
    });

  } catch (error) {
    console.error('❌ Error en API de validación pública de referidos:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
