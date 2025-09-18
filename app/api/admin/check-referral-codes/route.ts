import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('🔍 API /api/admin/check-referral-codes - Iniciando...');
    
    // Crear cliente Supabase con service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Obtener todos los usuarios con códigos CRYPTOFORCE_
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('email, nickname, referral_code, user_level, created_at')
      .like('referral_code', 'CRYPTOFORCE_%')
      .order('referral_code')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('❌ Error obteniendo usuarios:', usersError);
      return NextResponse.json({ 
        success: false,
        error: 'Error obteniendo usuarios',
        details: usersError.message
      }, { status: 500 });
    }

    // Verificar duplicados
    const referralCodes = users?.map(user => user.referral_code) || [];
    const duplicates = referralCodes.filter((code, index) => 
      referralCodes.indexOf(code) !== index
    );
    const uniqueDuplicates = [...new Set(duplicates)];

    // Agrupar por código de referido
    const groupedByCode = users?.reduce((acc, user) => {
      if (!acc[user.referral_code]) {
        acc[user.referral_code] = [];
      }
      acc[user.referral_code].push(user);
      return acc;
    }, {} as Record<string, any[]>) || {};

    console.log('✅ Estado de códigos de referido obtenido');

    return NextResponse.json({
      success: true,
      totalUsers: users?.length || 0,
      uniqueCodes: Object.keys(groupedByCode).length,
      duplicates: uniqueDuplicates,
      duplicateCount: uniqueDuplicates.length,
      users: users || [],
      groupedByCode
    });

  } catch (error) {
    console.error('❌ Error en API de verificación:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
