import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { apiRateLimit } from '@/lib/rateLimiter';
import { sanitizeInput } from '@/lib/sanitizer';

export async function GET(request: Request) {
  try {
    console.log('🔍 [MAESTRO API] ===== INICIO REQUEST GET =====');
    console.log('🔍 [MAESTRO API] URL:', request.url);
    console.log('🔍 [MAESTRO API] Method:', request.method);
    console.log('🔍 [MAESTRO API] Headers:', Object.fromEntries(request.headers.entries()));
    
    // Rate limiting
    console.log('🔍 [MAESTRO API] Aplicando rate limiting...');
    const rateLimitResult = apiRateLimit(request as any);
    console.log('🔍 [MAESTRO API] Rate limit result:', rateLimitResult);
    
    if (!rateLimitResult.success) {
      console.log('❌ [MAESTRO API] Rate limit excedido');
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

    // Obtener el token de autorización del header
    console.log('🔍 [MAESTRO API] Verificando autorización...');
    const authHeader = request.headers.get('authorization');
    console.log('🔍 [MAESTRO API] Auth header presente:', !!authHeader);
    console.log('🔍 [MAESTRO API] Auth header value:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ [MAESTRO API] No autorizado - header inválido');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    console.log('🔍 [MAESTRO API] Token extraído:', token ? 'Presente' : 'Ausente');
    console.log('🔍 [MAESTRO API] Token length:', token?.length);
    
    console.log('🔍 [MAESTRO API] Creando cliente Supabase...');
    console.log('🔍 [MAESTRO API] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Presente' : 'Ausente');
    console.log('🔍 [MAESTRO API] Service key presente:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Verificar autenticación
    console.log('🔍 [MAESTRO API] Verificando usuario con token...');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    console.log('🔍 [MAESTRO API] Usuario encontrado:', !!user);
    console.log('🔍 [MAESTRO API] User email:', user?.email);
    console.log('🔍 [MAESTRO API] User ID:', user?.id);
    console.log('🔍 [MAESTRO API] Auth error:', authError);
    
    if (authError || !user) {
      console.log('❌ [MAESTRO API] Error de autenticación:', authError);
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    
    // Verificar que sea un maestro (nivel 0)
    console.log('🔍 [MAESTRO API] Verificando perfil de usuario...');
    console.log('🔍 [MAESTRO API] Buscando usuario con email:', user.email);
    
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('user_level, nickname, email')
      .eq('email', user.email);

    console.log('🔍 [MAESTRO API] Profile query result:', userProfile);
    console.log('🔍 [MAESTRO API] Profile error:', profileError);
    console.log('🔍 [MAESTRO API] Profile data length:', userProfile?.length);

    if (profileError) {
      console.log('❌ [MAESTRO API] Error en query de perfil:', profileError);
      return NextResponse.json({ error: 'Perfil de usuario no encontrado' }, { status: 404 });
    }

    if (!userProfile || userProfile.length === 0) {
      console.log('❌ [MAESTRO API] Perfil no encontrado en base de datos');
      return NextResponse.json({ error: 'Perfil de usuario no encontrado' }, { status: 404 });
    }

    const profile = userProfile[0];
    console.log('🔍 [MAESTRO API] Usuario encontrado:', profile);
    console.log('🔍 [MAESTRO API] User level:', profile.user_level);
    console.log('🔍 [MAESTRO API] Nickname:', profile.nickname);

    // Verificar si es usuario fundador por email
    const isFundadorByEmail = user.email && ['infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com'].includes(user.email.toLowerCase().trim());
    console.log('🔍 [MAESTRO API] Es fundador por email:', isFundadorByEmail);
    console.log('🔍 [MAESTRO API] Email verificado:', user.email);

    if (profile.user_level !== 0 && profile.user_level !== 6 && !isFundadorByEmail) {
      console.log('❌ [MAESTRO API] No autorizado - nivel insuficiente');
      console.log('❌ [MAESTRO API] Nivel requerido: 0 o 6, nivel actual:', profile.user_level);
      return NextResponse.json({ error: 'Acceso denegado. Solo maestros pueden acceder a esta información.' }, { status: 403 });
    }

    // Obtener todos los usuarios del sistema
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        nombre,
        apellido,
        nickname,
        movil,
        exchange,
        user_level,
        referral_code,
        uid,
        codigo_referido,
        referred_by,
        total_referrals,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });

    if (usersError) {
      // Si hay error de permisos, intentar consulta alternativa
      if (usersError.code === '42501') {
        const { data: usersAlt, error: usersAltError } = await supabase
          .from('users')
          .select(`
            id,
            email,
            nombre,
            apellido,
            nickname,
            movil,
            exchange,
            user_level,
            referral_code,
            uid,
            codigo_referido,
            referred_by,
            total_referrals,
            created_at,
            updated_at
          `)
          .order('created_at', { ascending: false });

        if (usersAltError) {
          return NextResponse.json({ error: 'Error obteniendo usuarios' }, { status: 500 });
        }
        
        return NextResponse.json({ users: usersAlt });
      }
      
      return NextResponse.json({ error: 'Error obteniendo usuarios' }, { status: 500 });
    }

    // Procesar usuarios para incluir información de referidor
    const processedUsers = await Promise.all(
      users.map(async (user) => {
        let referrerInfo = null;
        
        if (user.referred_by) {
          const { data: referrer } = await supabase
            .from('users')
            .select('nombre, apellido, nickname, email')
            .eq('id', user.referred_by)
            .single();
          
          if (referrer) {
            referrerInfo = {
              nombre: referrer.nombre,
              apellido: referrer.apellido,
              nickname: referrer.nickname,
              email: referrer.email
            };
          }
        }

        return {
          ...user,
          referrerInfo
        };
      })
    );

    return NextResponse.json({ users: processedUsers });

  } catch (error) {
    console.error('Error en GET /api/maestro/users:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { action, userId, userData } = body;
    
    console.log('🔍 [MAESTRO API POST] ===== INICIO UPDATE USER =====');
    console.log('🔍 [MAESTRO API POST] Action:', action);
    console.log('🔍 [MAESTRO API POST] UserId:', userId);
    console.log('🔍 [MAESTRO API POST] UserData recibido:', userData);
    console.log('🔍 [MAESTRO API POST] User email (quien hace la petición):', user.email);

    // Verificar que sea un maestro
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('user_level')
      .eq('email', user.email);

    if (profileError || !userProfile || userProfile.length === 0 || userProfile[0].user_level !== 0) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    switch (action) {
      case 'create_user':
        // Validar datos requeridos
        if (!userData.email || !userData.nombre || !userData.apellido) {
          return NextResponse.json({ 
            error: 'Faltan datos requeridos: email, nombre, apellido' 
          }, { status: 400 });
        }

        // Verificar que el email no exista
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', userData.email);

        if (existingUser && existingUser.length > 0) {
          return NextResponse.json({ 
            error: 'Ya existe un usuario con este email' 
          }, { status: 400 });
        }

        // Verificar que el nickname no exista
        if (userData.nickname) {
          const { data: existingNickname } = await supabase
            .from('users')
            .select('id')
            .eq('nickname', userData.nickname);

          if (existingNickname && existingNickname.length > 0) {
            return NextResponse.json({ 
              error: 'Ya existe un usuario con este nickname' 
            }, { status: 400 });
          }
        }

        // Generar código de referido único
        const generateReferralCode = () => {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          let result = '';
          for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return result;
        };

        let referralCode = generateReferralCode();
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 10) {
          const { data: existingCode } = await supabase
            .from('users')
            .select('id')
            .eq('referral_code', referralCode);

          if (!existingCode || existingCode.length === 0) {
            isUnique = true;
          } else {
            referralCode = generateReferralCode();
            attempts++;
          }
        }

        if (!isUnique) {
          return NextResponse.json({ 
            error: 'No se pudo generar un código de referido único' 
          }, { status: 500 });
        }

        const newUser = {
          email: userData.email,
          nombre: userData.nombre,
          apellido: userData.apellido,
          nickname: userData.nickname || userData.email.split('@')[0],
          movil: userData.movil || '',
          exchange: userData.exchange || '',
          user_level: userData.user_level || 1,
          referral_code: referralCode,
          uid: '', // Se llenará cuando se cree el usuario en auth
          codigo_referido: userData.codigo_referido || null,
          referred_by: userData.referred_by || null,
          total_referrals: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdUser, error: createError } = await supabase
          .from('users')
          .insert([newUser])
          .select();

        if (createError) {
          return NextResponse.json({ 
            error: 'Error creando usuario',
            details: createError.message 
          }, { status: 500 });
        }

        return NextResponse.json({ 
          success: true,
          message: 'Usuario creado exitosamente',
          user: createdUser && createdUser.length > 0 ? createdUser[0] : null
        });

      case 'update_user':
        if (!userId) {
          return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
        }

        const updateData = {
          nombre: userData.nombre,
          apellido: userData.apellido,
          nickname: userData.nickname,
          movil: userData.movil,
          exchange: userData.exchange,
          user_level: userData.user_level,
          updated_at: new Date().toISOString()
        };
        
        console.log('🔍 [MAESTRO API POST] Datos a actualizar:', updateData);
        console.log('🔍 [MAESTRO API POST] ID del usuario a actualizar:', userId);

        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', userId)
          .select();
          
        console.log('🔍 [MAESTRO API POST] Resultado de la actualización:');
        console.log('🔍 [MAESTRO API POST] - UpdatedUser:', updatedUser);
        console.log('🔍 [MAESTRO API POST] - UpdateError:', updateError);

        if (updateError) {
          return NextResponse.json({ 
            error: 'Error actualizando usuario',
            details: updateError.message 
          }, { status: 500 });
        }

        return NextResponse.json({ 
          success: true,
          message: 'Usuario actualizado exitosamente',
          user: updatedUser && updatedUser.length > 0 ? updatedUser[0] : null
        });

      case 'delete_user':
        if (!userId) {
          return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
        }

        // 1. Obtener información del usuario a eliminar
        const { data: userToDelete, error: getUserError } = await supabase
          .from('users')
          .select('id, email, uid, referred_by')
          .eq('id', userId);

        if (getUserError || !userToDelete || userToDelete.length === 0) {
          return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        const userToDeleteData = userToDelete[0];

        // 2. Actualizar contador de referidos del referidor
        if (userToDeleteData.referred_by) {
          const { data: referrer, error: getReferrerError } = await supabase
            .from('users')
            .select('total_referrals')
            .eq('id', userToDeleteData.referred_by);

          if (!getReferrerError && referrer && referrer.length > 0) {
            const newReferralCount = Math.max(0, (referrer[0].total_referrals || 0) - 1);
            
            const { error: updateReferrerError } = await supabase
              .from('users')
              .update({ total_referrals: newReferralCount })
              .eq('id', userToDeleteData.referred_by);

            if (updateReferrerError) {
              console.error('Error actualizando contador de referidos:', updateReferrerError);
            }
          }
        }

        // 3. Eliminar feedbacks relacionados
        const { error: feedbackError } = await supabase
          .from('feedback')
          .delete()
          .or(`user_id.eq.${userId},email.eq.${userToDeleteData.email}`);

        if (feedbackError) {
          console.error('Error eliminando feedbacks:', feedbackError);
        }

        // 4. Actualizar referidos para que no apunten a este usuario
        const { error: updateReferralsError } = await supabase
          .from('users')
          .update({ referred_by: null })
          .eq('referred_by', userId);

        if (updateReferralsError) {
          console.error('Error actualizando referidos:', updateReferralsError);
        }

        // 5. Eliminar el usuario de la tabla users
        const { error: deleteError } = await supabase
          .from('users')
          .delete()
          .eq('id', userId);

        if (deleteError) {
          return NextResponse.json({ 
            error: 'Error eliminando usuario',
            details: deleteError.message 
          }, { status: 500 });
        }

        // 6. Intentar eliminar de auth.users (puede fallar si no es admin)
        try {
          const { error: authDeleteError } = await supabase.auth.admin.deleteUser(userToDeleteData.uid || userId);
          if (authDeleteError) {
            console.warn('No se pudo eliminar de auth.users:', authDeleteError.message);
          }
        } catch (error) {
          console.warn('Error eliminando de auth.users:', error);
        }

        return NextResponse.json({ 
          success: true,
          message: 'Usuario eliminado exitosamente'
        });

      default:
        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error en POST /api/maestro/users:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}