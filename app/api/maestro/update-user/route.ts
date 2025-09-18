import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function PUT(request: NextRequest) {
  try {
    console.log('API: update-user PUT request received');
    
    // Verificar que sea un usuario Maestro
    const authHeader = request.headers.get('authorization');
    console.log('API: Auth header present:', !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('API: No valid auth header');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log('API: Token extracted, length:', token.length);
    
    // Verificar el token con Supabase
    console.log('API: Verifying token with Supabase...');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('API: Auth error:', authError);
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }
    
    console.log('API: Token verified, user ID:', user.id);

    // Verificar que el usuario sea Maestro
    console.log('API: Checking if user is Maestro...');
    console.log('API: User email from token:', user.email);
    
    let { data: userProfiles, error: profileError } = await supabase
      .from('users')
      .select('user_level, email, nickname, id')
      .eq('email', user.email);

    console.log('API: User profiles data:', userProfiles);
    console.log('API: Profile error:', profileError);

    if (profileError) {
      console.error('API: Profile fetch error:', profileError);
      return NextResponse.json({ error: 'Error al obtener perfil del usuario: ' + profileError.message }, { status: 500 });
    }

    if (!userProfiles || userProfiles.length === 0) {
      console.error('API: No user profile found for email:', user.email);
      
      // Intentar buscar por uid como fallback
      console.log('API: Trying fallback search by uid...');
      const { data: fallbackProfiles, error: fallbackError } = await supabase
        .from('users')
        .select('user_level, email, nickname, id')
        .eq('uid', user.id);
      
      console.log('API: Fallback profiles data:', fallbackProfiles);
      console.log('API: Fallback error:', fallbackError);
      
      if (fallbackError || !fallbackProfiles || fallbackProfiles.length === 0) {
        return NextResponse.json({ 
          error: 'Perfil de usuario no encontrado. Email: ' + user.email + ', UID: ' + user.id 
        }, { status: 404 });
      }
      
      // Usar el perfil encontrado por uid
      userProfiles = fallbackProfiles;
    }

    // Si hay múltiples registros, usar el primero o el más reciente
    const userProfile = userProfiles.length > 1 ? userProfiles[0] : userProfiles[0];
    console.log('API: Selected user profile:', userProfile);
    console.log('API: Total profiles found:', userProfiles.length);

    // Verificar el nivel de usuario de forma más flexible
    const userLevel = userProfile.user_level;
    console.log('API: User level from database:', userLevel);
    console.log('API: User level type:', typeof userLevel);
    
    // Verificar si es maestro (puede ser string 'maestro' o número 3, o nivel 0 para fundadores)
    const isMaestro = userLevel === 'maestro' || userLevel === 3 || userLevel === '3' || userLevel === 0;
    console.log('API: Is user Maestro?', isMaestro);

    if (!isMaestro) {
      console.error('API: Access denied - User level:', userLevel, 'User email:', userProfile.email);
      return NextResponse.json({ 
        error: `Acceso denegado. Nivel de usuario: ${userLevel}. Solo Maestros pueden editar usuarios.` 
      }, { status: 403 });
    }
    
    console.log('API: User confirmed as Maestro');

    // Obtener datos del usuario a actualizar
    const body = await request.json();
    console.log('API: Request body received:', body);
    
    const { userId, updates } = body;

    if (!userId || !updates) {
      console.error('API: Missing userId or updates:', { userId, updates });
      return NextResponse.json({ error: 'ID de usuario y datos de actualización son requeridos' }, { status: 400 });
    }
    
    console.log('API: Updating user ID:', userId);
    console.log('API: Updates to apply:', updates);

    // Validar campos permitidos para actualización
    const allowedFields = [
      'nombre', 'apellido', 'nickname', 'email', 'movil', 'exchange',
      'user_level', 'referral_code', 'referred_by', 'total_referrals', 'total_earnings'
    ];

    const validUpdates: any = {};
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        validUpdates[key] = updates[key];
      }
    });
    
    console.log('API: Validated updates:', validUpdates);

    // Actualizar usuario en la base de datos
    console.log('API: Executing database update...');
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(validUpdates)
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('API: Database update error:', updateError);
      return NextResponse.json({ error: 'Error al actualizar usuario: ' + updateError.message }, { status: 500 });
    }
    
    console.log('API: Database update successful:', updatedUser);

    // Si se cambió el email, también actualizar en Supabase Auth
    if (updates.email && updates.email !== updatedUser.email) {
      console.log('API: Email changed, updating Auth...');
      try {
        const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
          updatedUser.uid!,
          { email: updates.email }
        );
        
        if (authUpdateError) {
          console.warn('API: Warning: Could not update email in Auth:', authUpdateError);
        } else {
          console.log('API: Email updated in Auth successfully');
        }
      } catch (error) {
        console.warn('API: Warning: Could not update email in Auth:', error);
      }
    }

    // Si se cambió el nivel de usuario, verificar permisos especiales
    if (updates.user_level && updates.user_level === 'maestro') {
      console.log(`API: User ${user.id} promoted ${updatedUser.nickname} to Maestro level`);
    }

    console.log('API: Update process completed successfully');
    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado correctamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('API: Unexpected error in update-user:', error);
    return NextResponse.json({ error: 'Error interno del servidor: ' + (error as Error).message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autorización
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Verificar que sea Maestro
    const { data: userProfiles, error: profileError } = await supabase
      .from('users')
      .select('user_level, email, nickname, id')
      .eq('email', user.email);

    console.log('API GET: User profiles data:', userProfiles);
    console.log('API GET: Profile error:', profileError);

    if (profileError) {
      console.error('API GET: Profile fetch error:', profileError);
      return NextResponse.json({ error: 'Error al obtener perfil del usuario: ' + profileError.message }, { status: 500 });
    }

    if (!userProfiles || userProfiles.length === 0) {
      console.error('API GET: No user profile found');
      return NextResponse.json({ error: 'Perfil de usuario no encontrado' }, { status: 404 });
    }

    // Si hay múltiples registros, usar el primero
    const userProfile = userProfiles[0];
    console.log('API GET: Selected user profile:', userProfile);
    console.log('API GET: Total profiles found:', userProfiles.length);

    // Verificar el nivel de usuario de forma más flexible
    const userLevel = userProfile.user_level;
    console.log('API GET: User level from database:', userLevel);
    console.log('API GET: User level type:', typeof userLevel);
    
    // Verificar si es maestro (puede ser string 'maestro' o número 3, o nivel 0 para fundadores)
    const isMaestro = userLevel === 'maestro' || userLevel === 3 || userLevel === '3' || userLevel === 0;
    console.log('API GET: Is user Maestro?', isMaestro);

    if (!isMaestro) {
      console.error('API GET: Access denied - User level:', userLevel, 'User email:', userProfile.email);
      return NextResponse.json({ 
        error: `Acceso denegado. Nivel de usuario: ${userLevel}. Solo Maestros pueden editar usuarios.` 
      }, { status: 403 });
    }

    // Obtener ID del usuario a consultar
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    // Obtener datos completos del usuario
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ user: userData });

  } catch (error) {
    console.error('Error in get-user API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
