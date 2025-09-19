import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Función para generar código de referido único
function generateReferralCode(nickname?: string): string {
  if (nickname) {
    // Formato: CRYPTOFORCE-NICKNAME (sin espacios, solo mayúsculas, con guión medio)
    const cleanNickname = nickname.replace(/[^A-Z0-9]/g, '').toUpperCase();
    return `CRYPTOFORCE-${cleanNickname}`;
  } else {
    // Si no hay nickname, usar formato genérico
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CRYPTOFORCE-${timestamp}${random}`;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Profile API - Iniciando request GET');
    
    const authHeader = request.headers.get('authorization');
    console.log('🔍 Profile API - Auth header:', authHeader ? 'Presente' : 'Ausente');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Profile API - No autorizado: header inválido');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log('🔍 Profile API - Token extraído:', token ? 'Presente' : 'Ausente');
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    console.log('🔍 Profile API - Usuario:', user ? 'Encontrado' : 'No encontrado', authError ? `Error: ${authError.message}` : '');
    
    if (authError || !user) {
      console.log('❌ Profile API - Token inválido');
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Obtener datos del perfil del usuario
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    console.log('🔍 Profile API - Profile data from DB:', profileData);

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('❌ Profile API - Error obteniendo perfil:', profileError);
      return NextResponse.json({ error: 'Error obteniendo perfil' }, { status: 500 });
    }

    if (!profileData) {
      console.log('⚠️ Profile API - Perfil no encontrado en tabla users, creando perfil básico');
      
      // Crear un perfil básico usando datos de Auth
      const nickname = user.user_metadata?.nickname || 
                      user.user_metadata?.display_name || 
                      user.user_metadata?.full_name ||
                      user.user_metadata?.name ||
                      null;
      
      const basicProfile = {
        id: user.id,
        email: user.email,
        nombre: user.user_metadata?.nombre || '',
        apellido: user.user_metadata?.apellido || '',
        nickname: nickname,
        movil: user.user_metadata?.movil || '',
        exchange: user.user_metadata?.exchange || '',
        whatsapp: user.user_metadata?.whatsapp || null,
        user_level: 1, // Nivel básico
        referral_code: generateReferralCode(nickname),
        total_referrals: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('✅ Profile API - Perfil básico creado');
      console.log('🔍 Profile API - Basic profile data:', basicProfile);
      return NextResponse.json({
        success: true,
        data: basicProfile
      });
    }

    console.log('✅ Profile API - Perfil obtenido exitosamente');
    return NextResponse.json({
      success: true,
      data: profileData
    });

  } catch (error) {
    console.error('❌ Profile API - Error interno:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}