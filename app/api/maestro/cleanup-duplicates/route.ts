import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    console.log('API CLEANUP: Cleanup duplicates request received');
    
    // Verificar autorización
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verificar el token con Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Verificar que sea Maestro
    const { data: userProfiles, error: profileError } = await supabase
      .from('users')
      .select('user_level, email, nickname')
      .eq('uid', user.id);

    if (profileError || !userProfiles || userProfiles.length === 0) {
      return NextResponse.json({ error: 'Perfil de usuario no encontrado' }, { status: 404 });
    }

    const userProfile = userProfiles[0];
    const userLevel = userProfile.user_level;
    const isMaestro = userLevel === 'maestro' || userLevel === 3 || userLevel === '3';

    if (!isMaestro) {
      return NextResponse.json({ 
        error: `Acceso denegado. Nivel de usuario: ${userLevel}. Solo Maestros pueden ejecutar esta operación.` 
      }, { status: 403 });
    }

    // Obtener todos los usuarios con sus UIDs
    const { data: allUsers, error: fetchError } = await supabase
      .from('users')
      .select('id, uid, email, created_at')
      .order('created_at', { ascending: true });

    if (fetchError) {
      return NextResponse.json({ error: 'Error al obtener usuarios: ' + fetchError.message }, { status: 500 });
    }

    // Agrupar por UID
    const uidGroups = new Map<string, any[]>();
    allUsers?.forEach(user => {
      if (user.uid) {
        if (!uidGroups.has(user.uid)) {
          uidGroups.set(user.uid, []);
        }
        uidGroups.get(user.uid)!.push(user);
      }
    });

    // Encontrar duplicados
    const duplicates = [];
    const toDelete = [];
    
    for (const [uid, users] of uidGroups) {
      if (users.length > 1) {
        duplicates.push({
          uid,
          count: users.length,
          users: users.map(u => ({ id: u.id, email: u.email, created_at: u.created_at }))
        });
        
        // Mantener el más reciente, eliminar los demás
        const sortedUsers = users.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        // Agregar todos menos el primero (más reciente) a la lista de eliminación
        toDelete.push(...sortedUsers.slice(1).map(u => u.id));
      }
    }

    if (toDelete.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No se encontraron registros duplicados',
        duplicates: []
      });
    }

    // Eliminar registros duplicados
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .in('id', toDelete);

    if (deleteError) {
      return NextResponse.json({ error: 'Error al eliminar duplicados: ' + deleteError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Se eliminaron ${toDelete.length} registros duplicados`,
      duplicates,
      deletedCount: toDelete.length
    });

  } catch (error) {
    console.error('API CLEANUP: Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor: ' + (error as Error).message 
    }, { status: 500 });
  }
}
