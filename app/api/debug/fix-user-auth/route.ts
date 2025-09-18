import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email requerido'
      }, { status: 400 });
    }
    
    const cleanEmail = email.trim().toLowerCase();
    console.log('🔧 Intentando arreglar usuario:', cleanEmail);
    
    const supabase = await createClient();
    
    // Verificar si el usuario existe en la tabla users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .single();
    
    if (userError || !userData) {
      return NextResponse.json({
        success: false,
        error: 'Usuario no encontrado en la tabla users',
        details: userError?.message
      }, { status: 404 });
    }
    
    console.log('👤 Usuario encontrado en tabla:', userData.email, userData.nickname);
    
    // Intentar reenviar email de confirmación
    // Nota: Esto funciona mejor con el service role key
    const { data: resendData, error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: cleanEmail
    });
    
    if (resendError) {
      console.log('⚠️ No se pudo reenviar email de confirmación:', resendError.message);
    } else {
      console.log('✅ Email de confirmación reenviado');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Usuario encontrado en la tabla users',
      user: {
        email: userData.email,
        nickname: userData.nickname,
        created_at: userData.created_at
      },
      emailResent: !resendError,
      resendError: resendError?.message || null,
      instructions: [
        '1. Revisa tu bandeja de entrada y spam para un email de confirmación',
        '2. Si no hay email, puedes registrarte de nuevo con el mismo email',
        '3. O usa el botón "Recrear Usuario en Auth" más abajo'
      ]
    });
    
  } catch (error) {
    console.error('💥 Error arreglando usuario:', error);
    return NextResponse.json({
      success: false,
      error: 'Error arreglando usuario',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
