import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    console.log('API CREATE-PROFILE: Create profile request received');
    
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

    console.log('API CREATE-PROFILE: Token verified, user ID:', user.id);
    console.log('API CREATE-PROFILE: User email:', user.email);

    // Verificar si ya existe un perfil
    const { data: existingProfiles, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('uid', user.id);

    if (checkError) {
      console.error('API CREATE-PROFILE: Check error:', checkError);
      return NextResponse.json({ error: 'Error al verificar perfil existente: ' + checkError.message }, { status: 500 });
    }

    if (existingProfiles && existingProfiles.length > 0) {
      console.log('API CREATE-PROFILE: Profile already exists');
      return NextResponse.json({
        success: true,
        message: 'Perfil ya existe',
        profile: existingProfiles[0]
      });
    }

    // Crear nuevo perfil
    const newProfile = {
      uid: user.id,
      email: user.email,
      nombre: '',
      apellido: '',
      nickname: user.email?.split('@')[0] || 'usuario',
      user_level: 1, // Usar entero en lugar de string 'maestro'
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('API CREATE-PROFILE: Creating new profile:', newProfile);

    const { data: createdProfile, error: createError } = await supabase
      .from('users')
      .insert([newProfile])
      .select()
      .single();

    if (createError) {
      console.error('API CREATE-PROFILE: Create error:', createError);
      return NextResponse.json({ error: 'Error al crear perfil: ' + createError.message }, { status: 500 });
    }

    console.log('API CREATE-PROFILE: Profile created successfully:', createdProfile);

    return NextResponse.json({
      success: true,
      message: 'Perfil creado correctamente',
      profile: createdProfile
    });

  } catch (error) {
    console.error('API CREATE-PROFILE: Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor: ' + (error as Error).message 
    }, { status: 500 });
  }
}
