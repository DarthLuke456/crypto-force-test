import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    console.log('🔐 Enviando reset de contraseña a:', cleanEmail);
    
    // Crear cliente con service role key para poder enviar emails
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Verificar que el usuario existe en nuestra tabla users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, nickname')
      .eq('email', cleanEmail)
      .single();
    
    if (userError || !userData) {
      // Por seguridad, no revelamos si el usuario existe o no
      console.log('⚠️ Usuario no encontrado en tabla users:', cleanEmail);
      return NextResponse.json({
        success: true,
        message: 'Si el email existe, recibirás un enlace de recuperación'
      });
    }
    
    // Enviar email de reset usando Supabase Auth
    const { data, error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm`,
    });
    
    if (error) {
      console.error('❌ Error enviando reset email:', error);
      
      // No exponer detalles del error por seguridad
      return NextResponse.json({
        success: true,
        message: 'Si el email existe, recibirás un enlace de recuperación'
      });
    }
    
    console.log('✅ Reset email enviado exitosamente a:', cleanEmail);
    
    return NextResponse.json({
      success: true,
      message: 'Email de recuperación enviado exitosamente',
      email: cleanEmail
    });
    
  } catch (error) {
    console.error('💥 Error en reset de contraseña:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}
