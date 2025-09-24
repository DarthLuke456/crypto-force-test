import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 Profile Update Offline API - Iniciando request');
    
    // Parse request body
    let updates: any;
    try {
      const requestBody = await request.text();
      console.log('🔍 Profile Update Offline API - Request body:', requestBody);
      updates = JSON.parse(requestBody);
    } catch (parseError) {
      console.error('❌ Profile Update Offline API - Error parsing body:', parseError);
      return NextResponse.json({ 
        error: 'Error parsing request body',
        details: parseError instanceof Error ? parseError.message : 'Error desconocido'
      }, { status: 400 });
    }

    console.log('🔍 Profile Update Offline API - Updates recibidos:', updates);

    // Validar que tenemos al menos un campo para actualizar
    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json({ 
        error: 'No hay datos para actualizar' 
      }, { status: 400 });
    }

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

    // Validar campos permitidos
    const allowedFields = [
      'nombre', 'apellido', 'nickname', 'email', 'movil', 'exchange', 
      'avatar', 'birthdate', 'country', 'bio', 'user_level'
    ];
    
    const validUpdates: any = {};
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined && value !== null) {
        validUpdates[key] = value;
      }
    }

    console.log('🔍 Profile Update Offline API - Valid updates:', validUpdates);

    if (Object.keys(validUpdates).length === 0) {
      return NextResponse.json({ 
        error: 'No hay campos válidos para actualizar' 
      }, { status: 400 });
    }

    // Agregar timestamp de actualización
    validUpdates.updated_at = new Date().toISOString();

    // Buscar usuario por email (ya que estamos en contexto offline)
    const { email } = updates;
    if (!email) {
      return NextResponse.json({ 
        error: 'Email es requerido para identificar al usuario' 
      }, { status: 400 });
    }

    // Actualizar perfil en la tabla users
    let updateResult, updateError;
    try {
      const result = await supabase
        .from('users')
        .update(validUpdates)
        .eq('email', email)
        .select();
      
      updateResult = result.data;
      updateError = result.error;
      
      console.log('🔍 Profile Update Offline API - Update result:', updateResult);
      console.log('🔍 Profile Update Offline API - Update error:', updateError);
      
    } catch (dbError) {
      console.error('❌ Profile Update Offline API - Database error:', dbError);
      return NextResponse.json({ 
        error: 'Error en la consulta de base de datos',
        details: dbError instanceof Error ? dbError.message : 'Error desconocido'
      }, { status: 500 });
    }

    if (updateError) {
      console.error('❌ Profile Update Offline API - Update error:', updateError);
      return NextResponse.json({ 
        error: 'Error actualizando perfil',
        details: updateError.message,
        code: updateError.code,
        hint: updateError.hint
      }, { status: 500 });
    }

    // Verificar si se actualizó al menos un registro
    if (!updateResult || (updateResult.length ?? 0) === 0) {
      console.log('❌ Profile Update Offline API - Usuario no encontrado');
      return NextResponse.json({ 
        error: 'Usuario no encontrado',
        details: 'No se pudo encontrar el usuario con el email proporcionado'
      }, { status: 404 });
    }

    console.log('✅ Profile Update Offline API - Perfil actualizado correctamente');

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado correctamente',
      profile: updateResult[0] // Devolver el primer (y único) registro actualizado
    });

  } catch (error) {
    console.error('❌ Profile Update Offline API - Error interno:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
