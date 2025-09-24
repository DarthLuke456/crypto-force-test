import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Profile Get Offline API - Iniciando request');
    
    // Parse request body
    let requestData: any;
    try {
      const requestBody = await request.text();
      console.log('🔍 Profile Get Offline API - Request body:', requestBody);
      requestData = JSON.parse(requestBody);
    } catch (parseError) {
      console.error('❌ Profile Get Offline API - Error parsing body:', parseError);
      return NextResponse.json({ 
        error: 'Error parsing request body',
        details: parseError instanceof Error ? parseError.message : 'Error desconocido'
      }, { status: 400 });
    }

    const { email } = requestData;
    if (!email) {
      return NextResponse.json({ 
        error: 'Email es requerido' 
      }, { status: 400 });
    }

    console.log('🔍 Profile Get Offline API - Email:', email);

    // Crear cliente con service role para operaciones de base de datos
    let supabase;
    try {
      supabase = createClient(supabaseUrl, supabaseServiceKey);
    } catch (serviceError) {
      return NextResponse.json({ 
        error: 'Error creando cliente de base de datos',
        details: serviceError instanceof Error ? serviceError.message : 'Error desconocido'
      }, { status: 500 });
    }

    // Obtener datos del perfil del usuario
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    console.log('🔍 Profile Get Offline API - Profile data from DB:', profileData);

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('❌ Profile Get Offline API - Error obteniendo perfil:', profileError);
      return NextResponse.json({ 
        error: 'Error obteniendo perfil',
        details: profileError.message
      }, { status: 500 });
    }

    if (!profileData) {
      console.log('❌ Profile Get Offline API - Usuario no encontrado');
      return NextResponse.json({ 
        error: 'Usuario no encontrado',
        details: 'No se encontró el usuario con el email proporcionado'
      }, { status: 404 });
    }

    console.log('✅ Profile Get Offline API - Perfil obtenido correctamente');

    return NextResponse.json({
      success: true,
      message: 'Perfil obtenido correctamente',
      profile: profileData
    });

  } catch (error) {
    console.error('❌ Profile Get Offline API - Error interno:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
