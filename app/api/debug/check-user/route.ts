import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email requerido'
      }, { status: 400 });
    }
    
    const cleanEmail = email.trim().toLowerCase();
    console.log('🔍 Verificando usuario:', { originalEmail: email, cleanEmail });
    
    const supabase = await createClient();
    
    // Verificar si el usuario existe en la tabla users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, nickname, created_at')
      .eq('email', cleanEmail)
      .single();
    
    console.log('👤 Usuario en tabla users:', { userData, userError });
    
    // También verificar en auth.users usando la admin API
    // Nota: esto requiere el service role key para funcionar completamente
    const result = {
      success: true,
      email: cleanEmail,
      existsInUsersTable: !!userData && !userError,
      userTableData: userData || null,
      userTableError: userError?.message || null,
      suggestion: ''
    };
    
    if (!userData && userError) {
      result.suggestion = 'El usuario no existe en la tabla users. Necesitas registrarte primero.';
    } else if (userData) {
      result.suggestion = 'El usuario existe en la tabla users. Verifica que la contraseña sea correcta.';
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('💥 Error verificando usuario:', error);
    return NextResponse.json({
      success: false,
      error: 'Error verificando usuario',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
