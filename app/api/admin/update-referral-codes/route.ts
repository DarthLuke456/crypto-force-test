import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Función para limpiar nickname
function cleanNickname(nickname: string): string {
return nickname.replace(/[^A-Z0-9]/g, '').toUpperCase();
}

// Función para generar código de referido
function generateReferralCode(nickname?: string): string {
  if (nickname) {
    return `CRYPTOFORCE-${cleanNickname(nickname)}`;
  } else {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CRYPTOFORCE-${timestamp}${random}`;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Iniciando actualización de códigos de referido...');
    
    // 1. Obtener todos los usuarios
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('id, nickname, referral_code, email');
    
    if (fetchError) {
      console.error('❌ Error obteniendo usuarios:', fetchError);
      return NextResponse.json({ error: 'Error obteniendo usuarios' }, { status: 500 });
    }
    
    console.log(`📊 Encontrados ${users.length} usuarios`);
    
    const updates = [];
    
    // 2. Preparar actualizaciones
    for (const user of users) {
      const newReferralCode = generateReferralCode(user.nickname);
      
      if (user.referral_code !== newReferralCode) {
        console.log(`🔄 Actualizando ${user.email}: ${user.referral_code} → ${newReferralCode}`);
        updates.push({
          id: user.id,
          referral_code: newReferralCode,
          updated_at: new Date().toISOString()
        });
      }
    }
    
    // 3. Ejecutar actualizaciones en lote
    if (updates.length > 0) {
      const { error: updateError } = await supabase
        .from('users')
        .upsert(updates);
      
      if (updateError) {
        console.error('❌ Error actualizando usuarios:', updateError);
        return NextResponse.json({ error: 'Error actualizando usuarios' }, { status: 500 });
      }
      
      console.log(`✅ Actualizados ${updates.length} usuarios`);
    }
    
    // 4. Crear usuario de prueba Darth Luke
    console.log('🔧 Creando usuario de prueba Darth Luke...');
    
    const testUser = {
      email: 'test@cryptoforce.com',
      nickname: 'DARTH LUKE',
      nombre: 'Darth',
      apellido: 'Luke',
      user_level: 5,
      referral_code: 'CRYPTOFORCE-DARTHLUKE',
      total_referrals: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: insertedUser, error: insertError } = await supabase
      .from('users')
      .upsert([testUser], { onConflict: 'email' })
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Error creando usuario de prueba:', insertError);
    } else {
      console.log('✅ Usuario de prueba creado/actualizado:', insertedUser);
    }
    
    // 5. Verificar resultados
    const { data: updatedUsers, error: verifyError } = await supabase
      .from('users')
      .select('id, email, nickname, referral_code, user_level')
      .like('referral_code', 'CRYPTOFORCE-%')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (verifyError) {
      console.error('❌ Error verificando resultados:', verifyError);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Códigos de referido actualizados correctamente',
      updatedCount: updates.length,
      users: updatedUsers || []
    });
    
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}
