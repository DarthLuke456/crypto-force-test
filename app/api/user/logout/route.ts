import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Marcar usuario como offline en la tabla users
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        is_online: false,
        last_activity: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error marcando usuario como offline:', updateError);
    }

    // Cerrar sesión de Supabase
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error('Error cerrando sesión:', signOutError);
      return NextResponse.json(
        { error: 'Error cerrando sesión' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
