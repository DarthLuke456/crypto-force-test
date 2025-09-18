import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    console.log('API DEBUG-AUTH: Debug auth request received');
    
    // Verificar autorización
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'No autorizado - Header de autorización faltante',
        authHeader: authHeader ? 'Presente pero inválido' : 'Faltante'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log('API DEBUG-AUTH: Token extracted, length:', token.length);
    
    // Verificar el token con Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError) {
      console.error('API DEBUG-AUTH: Auth error:', authError);
      return NextResponse.json({ 
        error: 'Token inválido o expirado',
        authError: authError.message,
        code: authError.status
      }, { status: 401 });
    }

    if (!user) {
      console.error('API DEBUG-AUTH: No user found');
      return NextResponse.json({ 
        error: 'Usuario no encontrado en el token',
        tokenLength: token.length
      }, { status: 401 });
    }

    console.log('API DEBUG-AUTH: Token verified, user ID:', user.id);
    console.log('API DEBUG-AUTH: User email:', user.email);

    // Verificar si existe un perfil en la tabla users
    const { data: userProfiles, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('uid', user.id);

    if (profileError) {
      console.error('API DEBUG-AUTH: Profile error:', profileError);
      return NextResponse.json({ 
        error: 'Error al verificar perfil de usuario',
        profileError: profileError.message
      }, { status: 500 });
    }

    console.log('API DEBUG-AUTH: User profiles data:', userProfiles);
    console.log('API DEBUG-AUTH: Profile error:', profileError);

    // Verificar la sesión completa
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    const debugInfo = {
      success: true,
      message: 'Información de debug de autenticación obtenida',
      user: {
        id: user.id,
        email: user.email,
        emailConfirmed: user.email_confirmed_at ? true : false,
        lastSignIn: user.last_sign_in_at,
        createdAt: user.created_at
      },
      session: session ? {
        accessToken: session.access_token ? `${session.access_token.substring(0, 20)}...` : 'No disponible',
        refreshToken: session.refresh_token ? `${session.refresh_token.substring(0, 20)}...` : 'No disponible',
        expiresAt: session.expires_at,
        tokenType: session.token_type
      } : null,
      profile: userProfiles && userProfiles.length > 0 ? userProfiles[0] : null,
      profileCount: userProfiles ? userProfiles.length : 0,
      errors: {
        session: sessionError ? 'Error de sesión' : null,
        profile: profileError ? (profileError as any).message || 'Error de perfil' : null
      },
      tokenInfo: {
        length: token.length,
        startsWith: token.substring(0, 10),
        endsWith: token.substring(token.length - 10)
      }
    };

    console.log('API DEBUG-AUTH: Debug info prepared:', debugInfo);

    return NextResponse.json(debugInfo);

  } catch (error) {
    console.error('API DEBUG-AUTH: Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
