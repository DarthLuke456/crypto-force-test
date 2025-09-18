import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { newUserEmail, referrerCode } = await request.json();

    if (!newUserEmail || !referrerCode) {
      return NextResponse.json(
        { error: 'Email y código de referido son requeridos' },
        { status: 400 }
      );
    }

    // Crear cliente con service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Procesar referido usando la función SQL
    const { data, error } = await supabase
      .rpc('process_new_referral', { 
        new_user_email: newUserEmail,
        referrer_code: referrerCode 
      });

    if (error) {
      console.error('Error procesando referido:', error);
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      );
    }

    if (!data.success) {
      return NextResponse.json(
        { error: data.error || 'Error procesando referido' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Referido procesado exitosamente',
      data: {
        referrerEmail: data.referrer_email,
        referrerNickname: data.referrer_nickname,
        newUserLevel: data.new_user_level,
        commissionEarned: data.commission_earned
      }
    });

  } catch (error) {
    console.error('Error en procesamiento de referido:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
