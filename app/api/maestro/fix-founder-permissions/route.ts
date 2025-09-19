import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    console.log('API: fix-founder-permissions POST request received');
    
    // Verificar que sea un usuario autorizado (solo para debugging)
    const authHeader = request.headers.get('authorization');
    console.log('API: Auth header present:', !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('API: No valid auth header');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log('API: Token extracted, length:', token.length);
    
    // Verificar el token con Supabase
    console.log('API: Verifying token with Supabase...');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('API: Auth error:', authError);
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }
    
    console.log('API: Token verified, user ID:', user.id);
    console.log('API: User email:', user.email);

    // Solo permitir que se ejecute desde una cuenta autorizada
    const authorizedEmails = ['coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com'];
    if (!authorizedEmails.includes(user.email!)) {
      console.error('API: Unauthorized email:', user.email);
      return NextResponse.json({ error: 'No autorizado para ejecutar esta operación' }, { status: 403 });
    }

    console.log('API: User authorized to fix founder permissions');

    // PASO 1: DIAGNÓSTICO ACTUAL
    console.log('API: Step 1 - Current diagnosis');
    
    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'coeurdeluke.js@gmail.com')
      .single();

    if (currentUserError) {
      console.error('API: Error getting current user:', currentUserError);
      return NextResponse.json({ error: 'Error obteniendo usuario actual: ' + currentUserError.message }, { status: 500 });
    }

    console.log('API: Current user state:', currentUser);

    // Verificar usuarios con nivel 0
    const { data: founders, error: foundersError } = await supabase
      .from('users')
      .select('id, email, nickname, user_level, referral_code')
      .eq('user_level', 0);

    if (foundersError) {
      console.error('API: Error getting founders:', foundersError);
      return NextResponse.json({ error: 'Error obteniendo fundadores: ' + foundersError.message }, { status: 500 });
    }

    console.log('API: Current founders:', founders);

    // PASO 2: CORRECCIÓN
    console.log('API: Step 2 - Applying corrections');

    // Resetear todos los usuarios a nivel 1 por seguridad
    const { error: resetError } = await supabase
      .from('users')
      .update({ user_level: 1 })
      .eq('user_level', 0);

    if (resetError) {
      console.error('API: Error resetting user levels:', resetError);
      return NextResponse.json({ error: 'Error reseteando niveles: ' + resetError.message }, { status: 500 });
    }

    console.log('API: All users reset to level 1');

    // Configurar coeurdeluke.js@gmail.com como fundador
    const { error: updateLukeError } = await supabase
      .from('users')
      .update({
        user_level: 0,
        referral_code: 'CRYPTOFORCE-LUKE',
        nickname: 'Luke',
        updated_at: new Date().toISOString()
      })
      .eq('email', 'coeurdeluke.js@gmail.com');

    if (updateLukeError) {
      console.error('API: Error updating Luke:', updateLukeError);
      return NextResponse.json({ error: 'Error actualizando Luke: ' + updateLukeError.message }, { status: 500 });
    }

    console.log('API: Luke updated to founder level');

    // Configurar infocryptoforce@gmail.com como fundador
    const { error: updateInfoError } = await supabase
      .from('users')
      .update({
        user_level: 0,
        referral_code: 'CRYPTOFORCE-INFOCRYPTOFORCE',
        nickname: 'INFOCRYPTOFORCE',
        updated_at: new Date().toISOString()
      })
      .eq('email', 'infocryptoforce@gmail.com');

    if (updateInfoError) {
      console.error('API: Error updating Info:', updateInfoError);
      return NextResponse.json({ error: 'Error actualizando Info: ' + updateInfoError.message }, { status: 500 });
    }

    console.log('API: Info updated to founder level');

    // PASO 3: VERIFICACIÓN
    console.log('API: Step 3 - Verification');

    // Verificar estado final
    const { data: finalUser, error: finalUserError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'coeurdeluke.js@gmail.com')
      .single();

    if (finalUserError) {
      console.error('API: Error getting final user state:', finalUserError);
      return NextResponse.json({ error: 'Error obteniendo estado final: ' + finalUserError.message }, { status: 500 });
    }

    // Verificar fundadores finales
    const { data: finalFounders, error: finalFoundersError } = await supabase
      .from('users')
      .select('id, email, nickname, user_level, referral_code')
      .eq('user_level', 0);

    if (finalFoundersError) {
      console.error('API: Error getting final founders:', finalFoundersError);
      return NextResponse.json({ error: 'Error obteniendo fundadores finales: ' + finalFoundersError.message }, { status: 500 });
    }

    // Verificar que solo hay 2 fundadores
    if (finalFounders.length !== 2) {
      console.error('API: Security violation - wrong number of founders:', finalFounders.length);
      return NextResponse.json({ 
        error: `Violación de seguridad: deben existir exactamente 2 fundadores, actualmente hay ${finalFounders.length}` 
      }, { status: 500 });
    }

    console.log('API: Founder permissions fixed successfully');

    return NextResponse.json({
      success: true,
      message: 'Permisos de usuario fundador corregidos correctamente',
      data: {
        currentUser: finalUser,
        founders: finalFounders,
        totalFounders: finalFounders.length
      }
    });

  } catch (error) {
    console.error('API: Unexpected error in fix-founder-permissions:', error);
    return NextResponse.json({ error: 'Error interno del servidor: ' + (error as Error).message }, { status: 500 });
  }
}
