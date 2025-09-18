import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Crear cliente con el token del usuario para verificar autenticación
    let userSupabase;
    try {
      userSupabase = createClient(
        supabaseUrl,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        }
      );
    } catch (clientError) {
      return NextResponse.json({ 
        error: 'Error creando cliente de autenticación',
        details: clientError instanceof Error ? clientError.message : 'Error desconocido'
      }, { status: 500 });
    }
    
    const { data: { user }, error: authError } = await userSupabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido', details: authError?.message || 'Usuario no autenticado' }, { status: 401 });
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

    // Parse request body
    let updates: any;
    try {
      const requestBody = await request.text();
      updates = JSON.parse(requestBody);
    } catch (parseError) {
      return NextResponse.json({ 
        error: 'Error parsing request body',
        details: parseError instanceof Error ? parseError.message : 'Unknown parse error'
      }, { status: 400 });
    }

    // Campos permitidos para actualización
    const allowedFields = [
      'nombre', 'apellido', 'nickname', 'email', 'movil', 'exchange',
      'avatar', 'user_level'
    ];

    const validUpdates: any = {};
    const invalidFields: string[] = [];
    const emptyFields: string[] = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        const value = updates[key];
        if (value !== null && value !== undefined) {
          // For optional fields, allow empty strings
          if (['movil', 'exchange'].includes(key)) {
            validUpdates[key] = value;
          } else if (key === 'user_level') {
            // user_level is special - it should be a number
            const levelValue = parseInt(value);
            if (!isNaN(levelValue) && levelValue >= 1 && levelValue <= 6) {
              validUpdates[key] = levelValue;
            }
          } else if (value !== '') {
            // For required fields, only include non-empty values
            validUpdates[key] = value;
          } else {
            emptyFields.push(key);
          }
        }
      } else {
        invalidFields.push(key);
      }
    });

    // Si se está actualizando el email, también actualizar en auth.users
    if (updates.email && updates.email !== user.email) {
      try {
        const { error: emailUpdateError } = await supabase.auth.admin.updateUserById(
          user.id,
          { email: updates.email }
        );
        
        if (emailUpdateError) {
          return NextResponse.json({ 
            error: 'Error actualizando email',
            details: emailUpdateError.message
          }, { status: 500 });
        }
      } catch (emailError) {
        return NextResponse.json({ 
          error: 'Error actualizando email en auth',
          details: emailError instanceof Error ? emailError.message : 'Unknown error'
        }, { status: 500 });
      }
    }

    // Check if there are any updates to make
    if (Object.keys(validUpdates).length === 0) {
      return NextResponse.json({ 
        error: 'No hay campos válidos para actualizar',
        details: {
          invalidFields,
          emptyFields,
          receivedFields: Object.keys(updates)
        }
      }, { status: 400 });
    }

    // Actualizar perfil en la tabla users
    let updateResult, updateError;
    try {
      const result = await supabase
        .from('users')
        .update(validUpdates)
        .eq('id', user.id)
        .select();
      
      updateResult = result.data;
      updateError = result.error;
      
      // Si no se encontró por ID, intentar por email
      if (!updateResult || (updateResult.length ?? 0) === 0) {
        const resultByEmail = await supabase
          .from('users')
          .update(validUpdates)
          .eq('email', user.email)
          .select();
        
        if (resultByEmail.data && (resultByEmail.data.length ?? 0) > 0) {
          updateResult = resultByEmail.data;
          updateError = resultByEmail.error;
        }
      }
    } catch (dbError) {
      return NextResponse.json({ 
        error: 'Error en la consulta de base de datos',
        details: dbError instanceof Error ? dbError.message : 'Error desconocido'
      }, { status: 500 });
    }

    if (updateError) {
      return NextResponse.json({ 
        error: 'Error actualizando perfil',
        details: updateError.message,
        code: updateError.code,
        hint: updateError.hint
      }, { status: 500 });
    }

    // Verificar si se actualizó al menos un registro
    if (!updateResult || (updateResult.length ?? 0) === 0) {
      return NextResponse.json({ 
        error: 'Usuario no encontrado',
        details: 'No se pudo encontrar el usuario con el ID proporcionado'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado correctamente',
      profile: updateResult[0] // Devolver el primer (y único) registro actualizado
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}