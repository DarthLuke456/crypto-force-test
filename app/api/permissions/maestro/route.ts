import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Lista de emails autorizados para acceder a la dashboard de Maestro
const MAESTRO_AUTHORIZED_EMAILS = [
  'infocryptoforce@gmail.com',
  'coeurdeluke.js@gmail.com'
];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado', authorized: false },
        { status: 401 }
      );
    }

    // Verificar si el email del usuario está en la lista de autorizados
    const userEmail = user.email?.toLowerCase().trim();
    const isAuthorized = userEmail && MAESTRO_AUTHORIZED_EMAILS.includes(userEmail);

    // Log de seguridad (sin mostrar emails completos en producción)
    console.log(`🔐 Verificación de permisos Maestro: ${userEmail ? userEmail.substring(0, 3) + '***' : 'email_no_encontrado'} - ${isAuthorized ? 'AUTORIZADO' : 'DENEGADO'}`);

    return NextResponse.json({
      authorized: isAuthorized,
      userEmail: userEmail?.substring(0, 3) + '***', // Solo mostrar primeros 3 caracteres por seguridad
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error verificando permisos de Maestro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', authorized: false },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado', authorized: false },
        { status: 401 }
      );
    }

    // Verificar si el email del usuario está en la lista de autorizados
    const userEmail = user.email?.toLowerCase().trim();
    const isAuthorized = userEmail && MAESTRO_AUTHORIZED_EMAILS.includes(userEmail);

    return NextResponse.json({
      authorized: isAuthorized,
      role: isAuthorized ? 'maestro' : 'darth',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error verificando permisos de Maestro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', authorized: false },
      { status: 500 }
    );
  }
}
