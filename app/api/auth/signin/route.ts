import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validar que se proporcionen email y contraseña
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Crear cliente de Supabase (await es necesario)
    const supabase = await createClient();

    const cleanEmail = email.trim().toLowerCase();
    console.log('🔐 Intentando autenticar:', { 
      originalEmail: email,
      cleanEmail: cleanEmail,
      passwordLength: password.length 
    });

    // AUTENTICACIÓN REAL con Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password
    });

    if (authError) {
      console.error('❌ Error de autenticación:', {
        message: authError.message,
        status: authError.status,
        email: email.trim().toLowerCase()
      });
      
      // Mensajes de error específicos pero seguros
      let errorMessage = 'Credenciales inválidas';
      
      if (authError.message.includes('Invalid login credentials')) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (authError.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor verifica tu email antes de iniciar sesión';
      } else if (authError.message.includes('Too many requests')) {
        errorMessage = 'Demasiados intentos. Intenta de nuevo en unos minutos';
      }

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 401 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: 'Error en la autenticación' },
        { status: 401 }
      );
    }

    // Obtener datos del usuario desde la tabla users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (userError) {
      console.error('Error obteniendo datos del usuario:', userError);
      return NextResponse.json(
        { success: false, error: 'Error obteniendo datos del usuario' },
        { status: 500 }
      );
    }

    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado en la base de datos' },
        { status: 404 }
      );
    }

    // Formatear datos del usuario para el frontend
    const formattedUserData = {
      id: userData.id,
      nombre: userData.nombre,
      apellido: userData.apellido,
      nickname: userData.nickname,
      email: userData.email,
      movil: userData.movil || '',
      exchange: userData.exchange || '',
      uid: userData.uid || '',
      codigo_referido: userData.referral_code || userData.codigo_referido || '',
      joinDate: userData.created_at ? new Date(userData.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      referral_code: userData.referral_code,
      total_referrals: userData.total_referrals || 0,
      total_earnings: userData.total_earnings || 0
    };

    console.log('✅ Login exitoso para:', email);

    return NextResponse.json({
      success: true,
      userData: formattedUserData,
      message: 'Inicio de sesión exitoso'
    });

  } catch (error) {
    console.error('Error en el endpoint de signin:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

