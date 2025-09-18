import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email y contraseña requeridos'
      }, { status: 400 });
    }
    
    const cleanEmail = email.trim().toLowerCase();
    console.log('🔧 Recreando usuario en Auth:', cleanEmail);
    
    // Usar el service role key para operaciones administrativas
    const supabaseServiceRole = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Service role key no configurada. Necesitas agregar SUPABASE_SERVICE_ROLE_KEY a tu .env.local'
      }, { status: 500 });
    }
    
    // Verificar que el usuario existe en la tabla users
    const { data: userData, error: userError } = await supabaseServiceRole
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .single();
    
    if (userError || !userData) {
      return NextResponse.json({
        success: false,
        error: 'Usuario no encontrado en la tabla users'
      }, { status: 404 });
    }
    
    // Intentar crear el usuario en Auth
    const { data: authData, error: authError } = await supabaseServiceRole.auth.admin.createUser({
      email: cleanEmail,
      password: password,
      email_confirm: true, // Confirmar email automáticamente
      user_metadata: {
        nickname: userData.nickname,
        nombre: userData.nombre,
        apellido: userData.apellido
      }
    });
    
    if (authError) {
      console.error('❌ Error creando usuario en Auth:', authError);
      
      // Si el usuario ya existe, intentar actualizar la contraseña
      if (authError.message.includes('already registered')) {
        // Buscar el usuario por email para obtener su ID
        const { data: existingUser, error: getUserError } = await supabaseServiceRole.auth.admin.listUsers();
        const userToUpdate = existingUser?.users?.find(u => u.email === email);
        
        if (!userToUpdate) {
          return NextResponse.json({
            success: false,
            error: 'Usuario no encontrado para actualizar'
          });
        }

        const { data: updateData, error: updateError } = await supabaseServiceRole.auth.admin.updateUserById(
          userToUpdate.id, 
          { password: password }
        );
        
        if (updateError) {
          return NextResponse.json({
            success: false,
            error: 'Usuario ya existe pero no se pudo actualizar la contraseña',
            details: updateError.message
          }, { status: 400 });
        }
        
        return NextResponse.json({
          success: true,
          message: 'Contraseña actualizada para usuario existente en Auth',
          instructions: 'Ahora puedes intentar hacer login nuevamente'
        });
      }
      
      return NextResponse.json({
        success: false,
        error: 'Error creando usuario en Auth',
        details: authError.message
      }, { status: 400 });
    }
    
    console.log('✅ Usuario creado/actualizado en Auth:', authData.user?.email);
    
    return NextResponse.json({
      success: true,
      message: 'Usuario recreado exitosamente en Supabase Auth',
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
        confirmed: authData.user?.email_confirmed_at ? true : false
      },
      instructions: 'Ahora puedes intentar hacer login con tu contraseña'
    });
    
  } catch (error) {
    console.error('💥 Error recreando usuario:', error);
    return NextResponse.json({
      success: false,
      error: 'Error recreando usuario en Auth',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
