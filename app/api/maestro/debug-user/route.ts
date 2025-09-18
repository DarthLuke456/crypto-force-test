import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    console.log('API DEBUG: Debug user request received');
    
    // Verificar autorización
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log('API DEBUG: Token extracted, length:', token.length);
    
    // Verificar el token con Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('API DEBUG: Auth error:', authError);
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    console.log('API DEBUG: Token verified, user ID:', user.id);
    console.log('API DEBUG: User email:', user.email);

    // Obtener perfil completo del usuario
    const { data: userProfiles, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('uid', user.id);

    console.log('API DEBUG: User profiles data:', userProfiles);
    console.log('API DEBUG: Profile error:', profileError);

    if (profileError) {
      console.error('API DEBUG: Profile fetch error:', profileError);
      return NextResponse.json({ 
        error: 'Error al obtener perfil del usuario: ' + profileError.message,
        authUser: {
          id: user.id,
          email: user.email
        }
      }, { status: 500 });
    }

    if (!userProfiles || userProfiles.length === 0) {
      console.error('API DEBUG: No user profile found');
      return NextResponse.json({ 
        error: 'Perfil de usuario no encontrado',
        authUser: {
          id: user.id,
          email: user.email
        }
      }, { status: 404 });
    }

    // Si hay múltiples registros, usar el primero
    const userProfile = userProfiles[0];
    console.log('API DEBUG: Selected user profile:', userProfile);
    console.log('API DEBUG: Total profiles found:', userProfiles.length);

    // Verificar el nivel de usuario
    const userLevel = userProfile.user_level;
    console.log('API DEBUG: User level from database:', userLevel);
    console.log('API DEBUG: User level type:', typeof userLevel);
    
    // Verificar si es maestro
    const isMaestro = userLevel === 'maestro' || userLevel === 3 || userLevel === '3';
    console.log('API DEBUG: Is user Maestro?', isMaestro);

    return NextResponse.json({
      success: true,
      debug: {
        authUser: {
          id: user.id,
          email: user.email
        },
        databaseProfile: userProfile,
        userLevel: {
          value: userLevel,
          type: typeof userLevel,
          isMaestro: isMaestro
        },
        permissions: {
          canEditUsers: isMaestro,
          canAccessMaestroDashboard: isMaestro
        }
      }
    });

  } catch (error) {
    console.error('API DEBUG: Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor: ' + (error as Error).message 
    }, { status: 500 });
  }
}
