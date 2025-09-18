import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Avatar API - Iniciando request POST');
    console.log('🔍 Avatar API - URL:', request.url);
    console.log('🔍 Avatar API - Headers:', Object.fromEntries(request.headers.entries()));
    
    const authHeader = request.headers.get('authorization');
    console.log('🔍 Avatar API - Auth header:', authHeader ? 'Presente' : 'Ausente');
    console.log('🔍 Avatar API - Auth header value:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Avatar API - No autorizado: header inválido');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log('🔍 Avatar API - Token extraído:', token ? 'Presente' : 'Ausente');
    console.log('🔍 Avatar API - Token length:', token?.length);
    
    console.log('🔍 Avatar API - Verificando usuario con Supabase...');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    console.log('🔍 Avatar API - Usuario:', user ? 'Encontrado' : 'No encontrado');
    console.log('🔍 Avatar API - User email:', user?.email);
    console.log('🔍 Avatar API - User ID:', user?.id);
    console.log('🔍 Avatar API - Auth error:', authError);
    
    if (authError || !user) {
      console.log('❌ Avatar API - Token inválido o usuario no encontrado');
      console.log('❌ Avatar API - Auth error details:', authError);
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    console.log('🔍 Avatar API - Parseando body...');
    const body = await request.json();
    console.log('🔍 Avatar API - Body recibido:', body ? 'Presente' : 'Ausente');
    console.log('🔍 Avatar API - Body keys:', Object.keys(body || {}));
    console.log('🔍 Avatar API - Avatar length:', body?.avatar?.length);
    
    const { avatar } = body;

    if (!avatar) {
      console.log('❌ Avatar API - Avatar requerido');
      return NextResponse.json({ 
        error: 'Se requiere un avatar' 
      }, { status: 400 });
    }

    // Validar que el avatar sea una URL válida o base64
    const isValidAvatar = avatar.startsWith('data:image/') || 
                         avatar.startsWith('http://') || 
                         avatar.startsWith('https://') ||
                         avatar.startsWith('/images/');

    console.log('🔍 Avatar API - Validando avatar...');
    console.log('🔍 Avatar API - Avatar starts with data:image/:', avatar.startsWith('data:image/'));
    console.log('🔍 Avatar API - Avatar starts with http://:', avatar.startsWith('http://'));
    console.log('🔍 Avatar API - Avatar starts with https://:', avatar.startsWith('https://'));
    console.log('🔍 Avatar API - Avatar starts with /images/:', avatar.startsWith('/images/'));
    console.log('🔍 Avatar API - Is valid avatar:', isValidAvatar);

    if (!isValidAvatar) {
      console.log('❌ Avatar API - Formato de avatar inválido');
      return NextResponse.json({ 
        error: 'Formato de avatar inválido' 
      }, { status: 400 });
    }

    // Actualizar avatar directamente en la tabla
    console.log('🔍 Avatar API - Actualizando avatar para usuario:', user.email);
    console.log('🔍 Avatar API - Supabase URL:', supabaseUrl);
    console.log('🔍 Avatar API - Service key present:', !!supabaseServiceKey);
    
    const { data: updateResult, error: updateError } = await supabase
      .from('users')
      .update({ 
        avatar: avatar,
        updated_at: new Date().toISOString()
      })
      .eq('email', user.email)
      .select();

    console.log('🔍 Avatar API - Resultado de actualización:');
    console.log('🔍 Avatar API - Update result:', updateResult);
    console.log('🔍 Avatar API - Update error:', updateError);
    console.log('🔍 Avatar API - Update error message:', updateError?.message);
    console.log('🔍 Avatar API - Update error details:', updateError?.details);
    console.log('🔍 Avatar API - Update error hint:', updateError?.hint);

    if (updateError) {
      console.error('❌ Avatar API - Error actualizando avatar:', updateError);
      return NextResponse.json({ 
        error: `Error actualizando avatar: ${updateError.message}`,
        details: updateError.details,
        hint: updateError.hint
      }, { status: 500 });
    }

    if (!updateResult || updateResult.length === 0) {
      console.log('❌ Avatar API - No se pudo actualizar el avatar - sin resultado');
      return NextResponse.json({ 
        error: 'No se pudo actualizar el avatar' 
      }, { status: 400 });
    }

    console.log('✅ Avatar API - Avatar actualizado correctamente');
    return NextResponse.json({
      success: true,
      message: 'Avatar actualizado correctamente',
      avatar: avatar
    });

  } catch (error) {
    console.error('❌ Avatar API - Error interno:', error);
    console.error('❌ Avatar API - Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json({ 
      error: `Error interno del servidor: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
