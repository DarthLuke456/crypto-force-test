import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    // Validar que se proporcionen ambas contraseñas
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ 
        error: 'Se requieren la contraseña actual y la nueva contraseña' 
      }, { status: 400 });
    }

    // Validar longitud de la nueva contraseña
    if (newPassword.length < 6) {
      return NextResponse.json({ 
        error: 'La nueva contraseña debe tener al menos 6 caracteres' 
      }, { status: 400 });
    }

    // Verificar la contraseña actual
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    });

    if (signInError) {
      return NextResponse.json({ 
        error: 'Contraseña actual incorrecta' 
      }, { status: 400 });
    }

    // Actualizar la contraseña
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      console.error('Error actualizando contraseña:', updateError);
      return NextResponse.json({ 
        error: 'Error actualizando contraseña' 
      }, { status: 500 });
    }

    // Log del cambio de contraseña
    console.log(`Usuario ${user.email} cambió su contraseña`);

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });

  } catch (error) {
    console.error('Error en API de cambio de contraseña:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}
