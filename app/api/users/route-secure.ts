import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getValidatedEnv } from '@/lib/env';
import { apiRateLimit } from '@/lib/rateLimiter';
import { sanitizeInput } from '@/lib/sanitizer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = apiRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.',
          retryAfter: rateLimitResult.retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
            'X-RateLimit-Limit': '60',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      );
    }
    
    const body = await request.json();
    
    // Validar y sanitizar campos requeridos
    const requiredFields = ['nombre', 'apellido', 'nickname', 'email', 'password'];
    const missing = requiredFields.filter(field => !body[field] || body[field].trim() === '');
    
    if (missing.length > 0) {
      return NextResponse.json({ 
        error: `Campos requeridos faltantes: ${missing.join(', ')}` 
      }, { status: 400 });
    }

    // Sanitizar y validar cada campo
    const nombreResult = sanitizeInput(body.nombre, 'name');
    if (!nombreResult.isValid) {
      return NextResponse.json({ error: `Nombre: ${nombreResult.error}` }, { status: 400 });
    }

    const apellidoResult = sanitizeInput(body.apellido, 'name');
    if (!apellidoResult.isValid) {
      return NextResponse.json({ error: `Apellido: ${apellidoResult.error}` }, { status: 400 });
    }

    const nicknameResult = sanitizeInput(body.nickname, 'nickname');
    if (!nicknameResult.isValid) {
      return NextResponse.json({ error: `Nickname: ${nicknameResult.error}` }, { status: 400 });
    }

    const emailResult = sanitizeInput(body.email, 'email');
    if (!emailResult.isValid) {
      return NextResponse.json({ error: `Email: ${emailResult.error}` }, { status: 400 });
    }

    const passwordResult = sanitizeInput(body.password, 'password');
    if (!passwordResult.isValid) {
      return NextResponse.json({ error: `Contraseña: ${passwordResult.error}` }, { status: 400 });
    }

    const movilResult = body.movil ? sanitizeInput(body.movil, 'phone') : { isValid: true, sanitized: '' };
    if (!movilResult.isValid) {
      return NextResponse.json({ error: `Móvil: ${movilResult.error}` }, { status: 400 });
    }

    const exchangeResult = sanitizeInput(body.exchange, 'exchange');
    if (!exchangeResult.isValid) {
      return NextResponse.json({ error: `Exchange: ${exchangeResult.error}` }, { status: 400 });
    }

    const codigoReferidoResult = body.codigoReferido ? sanitizeInput(body.codigoReferido, 'referral') : { isValid: true, sanitized: '' };
    if (!codigoReferidoResult.isValid) {
      return NextResponse.json({ error: `Código de referido: ${codigoReferidoResult.error}` }, { status: 400 });
    }

    // Obtener configuración de Supabase
    let supabaseUrl: string;
    let supabaseAnonKey: string;
    
    try {
      const config = getValidatedEnv();
      supabaseUrl = config.NEXT_PUBLIC_SUPABASE_URL!;
      supabaseAnonKey = config.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    } catch (error) {
      console.error('❌ Error al obtener configuración:', error);
      return NextResponse.json({ 
        error: 'Configuración de Supabase incompleta: ' + (error as Error).message
      }, { status: 500 });
    }

    // Crear cliente de Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Preparar datos sanitizados para insertar
    const userData = {
      nombre: nombreResult.sanitized!,
      apellido: apellidoResult.sanitized!,
      nickname: nicknameResult.sanitized!,
      email: emailResult.sanitized!,
      movil: movilResult.sanitized || null,
      exchange: exchangeResult.sanitized!,
      uid: body.uid || null,
      referred_by: codigoReferidoResult.sanitized || null,
    };

    console.log('📝 Datos del usuario sanitizados:', userData);

    // Verificar si el usuario ya existe
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email, nickname')
      .or(`email.eq.${userData.email},nickname.eq.${userData.nickname}`);

    if (checkError) {
      console.error('❌ Error verificando usuario existente:', checkError);
      return NextResponse.json({ 
        error: 'Error verificando usuario existente' 
      }, { status: 500 });
    }

    if (existingUser && existingUser.length > 0) {
      const existing = existingUser[0];
      if (existing.email === userData.email) {
        return NextResponse.json({ 
          error: 'Ya existe un usuario con este email' 
        }, { status: 400 });
      }
      if (existing.nickname === userData.nickname) {
        return NextResponse.json({ 
          error: 'Ya existe un usuario con este nickname' 
        }, { status: 400 });
      }
    }

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: passwordResult.sanitized!,
      options: {
        data: {
          nombre: userData.nombre,
          apellido: userData.apellido,
          nickname: userData.nickname,
        }
      }
    });

    if (authError) {
      console.error('❌ Error creando usuario en auth:', authError);
      return NextResponse.json({ 
        error: `Error creando usuario: ${authError.message}` 
      }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ 
        error: 'No se pudo crear el usuario' 
      }, { status: 400 });
    }

    // Insertar datos adicionales en la tabla users
    const { data: userRecord, error: insertError } = await supabase
      .from('users')
      .insert({
        ...userData,
        uid: authData.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();

    if (insertError) {
      console.error('❌ Error insertando datos del usuario:', insertError);
      return NextResponse.json({ 
        error: `Error guardando datos del usuario: ${insertError.message}` 
      }, { status: 500 });
    }

    console.log('✅ Usuario creado exitosamente:', userRecord);

    return NextResponse.json({
      success: true,
      user: {
        id: userRecord[0].id,
        email: userRecord[0].email,
        nombre: userRecord[0].nombre,
        apellido: userRecord[0].apellido,
        nickname: userRecord[0].nickname,
        movil: userRecord[0].movil,
        exchange: userRecord[0].exchange,
        created_at: userRecord[0].created_at
      },
      message: 'Usuario creado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error en POST /api/users:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}
