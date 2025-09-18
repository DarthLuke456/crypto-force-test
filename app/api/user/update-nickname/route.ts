import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PUT(request: Request) {
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

    const { nickname } = await request.json();

    if (!nickname || nickname.trim() === '') {
      return NextResponse.json(
        { error: 'Nickname es requerido' },
        { status: 400 }
      );
    }

    // Actualizar nickname y código de referido
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        nickname: nickname.trim(),
        // El trigger automáticamente actualizará el referral_code
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error actualizando nickname:', updateError);
      return NextResponse.json(
        { error: 'Error actualizando nickname' },
        { status: 500 }
      );
    }

    // Obtener el usuario actualizado
    const { data: updatedUser, error: fetchError } = await supabase
      .from('users')
      .select('nickname, referral_code')
      .eq('id', user.id)
      .single();

    if (fetchError) {
      console.error('Error obteniendo usuario actualizado:', fetchError);
    }

    return NextResponse.json({
      success: true,
      message: 'Nickname actualizado exitosamente',
      nickname: updatedUser?.nickname,
      referral_code: updatedUser?.referral_code,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en actualización de nickname:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
