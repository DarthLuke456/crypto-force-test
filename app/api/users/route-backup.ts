import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getValidatedEnv } from '@/lib/env';
import { apiRateLimit } from '@/lib/rateLimiter';
import { sanitizeInput } from '@/lib/sanitizer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 🔍 TEST RÁPIDO - Verificar TODAS las variables de entorno
    console.log('🚨 TEST RÁPIDO - Variables de entorno disponibles:');
    console.log('================================================');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ NO DISPONIBLE');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '❌ NO DISPONIBLE');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY || '❌ NO DISPONIBLE');
    console.log('NODE_ENV:', process.env.NODE_ENV || '❌ NO DISPONIBLE');
    console.log('================================================');
    
    // 🔍 TEST ADICIONAL - Verificar configuración de Next.js
    console.log('🔧 TEST CONFIGURACIÓN:');
    console.log('process.env:', Object.keys(process.env).filter(key => key.includes('SUPABASE')));
    console.log('================================================');
    
    // 🔍 TEST NUEVA CONFIGURACIÓN
    console.log('🔧 TEST NUEVA CONFIGURACIÓN:');
    try {
      const config = getValidatedEnv();
      console.log('✅ Configuración validada:', config);
    } catch (error) {
      console.log('❌ Error en configuración:', error);
    }
    console.log('================================================');
    
    const body = await request.json();
    
    // Debug: Verificar variables de entorno
    console.log('🔍 Debug API - Variables de entorno:');
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Disponible' : '❌ No disponible');
    console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Disponible' : '❌ No disponible');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Disponible' : '❌ No disponible');

    // Validar campos requeridos
    const requiredFields = ['nombre', 'apellido', 'nickname', 'email', 'password'];
    const missing = requiredFields.filter(field => !body[field] || body[field].trim() === '');
    
    if (missing.length > 0) {
      return NextResponse.json({ 
        error: `Campos requeridos faltantes: ${missing.join(', ')}` 
      }, { status: 400 });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ 
        error: 'Formato de email inválido' 
      }, { status: 400 });
    }

    // Validar password (mínimo 6 caracteres)
    if (body.password.length < 6) {
      return NextResponse.json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      }, { status: 400 });
    }

    // Preparar datos para insertar (incluyendo referidos)
    const userData = {
      nombre: body.nombre.trim(),
      apellido: body.apellido.trim(),
      nickname: body.nickname.trim(),
      email: body.email.toLowerCase().trim(),
      movil: body.movil || null,
      exchange: body.exchange || null,
      uid: body.uid || null,
      referred_by: body.codigoReferido || null, // Código de quien lo refirió
      // No incluimos password aquí - se manejará por separado con Supabase Auth
    };

    console.log('📝 Datos del usuario a insertar:', userData);
    console.log('🔍 Columnas que se insertarán:', Object.keys(userData));

    // Obtener variables de entorno usando la nueva configuración
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

    // Crear cliente de Supabase con anon key (ahora funciona con RLS)
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('🚀 Intentando insertar usuario en Supabase...');

    // Insertar usuario usando la anon key (ahora funciona con RLS)
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) {
      console.error('❌ Error al insertar usuario:', error);
      console.error('🔍 Detalles del error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      // Manejar errores específicos de validación
      if (error.code === '23505') { // Unique violation
        if (error.message.includes('email')) {
          return NextResponse.json({ 
            error: 'Este email ya está registrado' 
          }, { status: 409 });
        }
        if (error.message.includes('nickname')) {
          return NextResponse.json({ 
            error: 'Este nickname ya está en uso' 
          }, { status: 409 });
        }
        if (error.message.includes('exchange_uid')) {
          return NextResponse.json({ 
            error: 'Esta combinación de Exchange y UID ya existe' 
          }, { status: 409 });
        }
      }
      
      if (error.code === '23514') { // Check violation
        return NextResponse.json({ 
          error: 'Datos inválidos: ' + error.message 
        }, { status: 400 });
      }

      // Error específico de columna no encontrada
      if (error.code === 'PGRST204' && error.message.includes('codigo_referido')) {
        return NextResponse.json({ 
          error: 'Error de configuración de base de datos: columna codigo_referido no encontrada. Contacta al administrador.' 
        }, { status: 500 });
      }

      // Error específico de RLS (Row Level Security)
      if (error.code === '42501' || error.message.includes('row-level security') || error.message.includes('policy')) {
        console.error('🚨 ERROR RLS DETECTADO - EJECUTAR SCRIPT DE DIAGNOSTICO');
        return NextResponse.json({ 
          error: 'ERROR RLS: Ejecuta el script de diagnóstico en Supabase SQL Editor para solucionar este problema.',
          details: `Código: ${error.code}, Mensaje: ${error.message}`,
          solution: 'Ve a Supabase → SQL Editor y ejecuta el script de diagnóstico completo'
        }, { status: 500 });
      }

      // Error de tabla no encontrada
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.error('🚨 TABLA NO EXISTE - CREAR TABLA');
        return NextResponse.json({ 
          error: 'TABLA NO EXISTE: La tabla users no existe en la base de datos.',
          solution: 'Ejecuta el script de diagnóstico completo en Supabase SQL Editor'
        }, { status: 500 });
      }

      // Error de permisos general
      if (error.code === '42501') {
        console.error('🚨 ERROR DE PERMISOS GENERAL');
        return NextResponse.json({ 
          error: 'ERROR DE PERMISOS: Problema de permisos en la base de datos.',
          details: `Código: ${error.code}, Mensaje: ${error.message}`,
          solution: 'Ejecuta el script de diagnóstico completo en Supabase SQL Editor'
        }, { status: 500 });
      }

      return NextResponse.json({ 
        error: 'Error al crear usuario: ' + error.message 
      }, { status: 500 });
    }

    console.log('✅ Usuario creado exitosamente:', data);

    // Procesar referido si se proporcionó código
    let referralResult = null;
    if (body.codigoReferido) {
      try {
        console.log('🔗 Procesando referido con código:', body.codigoReferido);
        
        // Usar service role para procesamiento interno
        const supabaseService = createClient(
          supabaseUrl, 
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        
        const { data: referralData, error: referralError } = await supabaseService
          .rpc('process_new_referral', {
            new_user_email: body.email.toLowerCase().trim(),
            referrer_code: body.codigoReferido
          });

        if (referralError) {
          console.error('⚠️ Error procesando referido (no crítico):', referralError);
        } else if (referralData?.success) {
          console.log('✅ Referido procesado exitosamente:', referralData);
          referralResult = {
            referrerNickname: referralData.referrer_nickname,
            commissionEarned: referralData.commission_earned
          };
        }
      } catch (referralError) {
        console.error('⚠️ Error procesando referido (no crítico):', referralError);
      }
    }

    // Retornar éxito (sin datos sensibles)
    return NextResponse.json({ 
      success: true,
      message: 'Usuario registrado exitosamente',
      userId: data.id,
      referral: referralResult
    });

  } catch (err: any) {
    console.error('💥 Error inesperado en API:', err);
    return NextResponse.json({ 
      error: 'Error interno del servidor: ' + err.message 
    }, { status: 500 });
  }
}


