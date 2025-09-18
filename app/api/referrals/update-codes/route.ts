import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email, newNickname } = await request.json();

    if (!email || !newNickname) {
      return NextResponse.json(
        { error: 'Email y nuevo nickname son requeridos' },
        { status: 400 }
      );
    }

    // Crear cliente con service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verificar que el usuario existe y no es fundador
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, user_level, referral_code')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que no es fundador (nivel 0)
    if (userData.user_level === 0) {
      return NextResponse.json(
        { error: 'Los usuarios fundadores no pueden cambiar su código de referido' },
        { status: 403 }
      );
    }

    // Generar nuevo código de referido
    const { data: newCodeData, error: codeError } = await supabase
      .rpc('generate_referral_code', { user_nickname: newNickname });

    if (codeError) {
      console.error('Error generando código:', codeError);
      return NextResponse.json(
        { error: 'Error generando nuevo código de referido' },
        { status: 500 }
      );
    }

    // Actualizar usuario con nuevo nickname y código
    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({
        nickname: newNickname,
        referral_code: newCodeData,
        updated_at: new Date().toISOString()
      })
      .eq('email', email)
      .select('nickname, referral_code');

    if (updateError) {
      console.error('Error actualizando usuario:', updateError);
      return NextResponse.json(
        { error: 'Error actualizando usuario' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: {
        nickname: updateData[0].nickname,
        referralCode: updateData[0].referral_code
      }
    });

  } catch (error) {
    console.error('Error en actualización de código de referido:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
