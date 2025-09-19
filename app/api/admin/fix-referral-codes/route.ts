import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    console.log('🔧 API /api/admin/fix-referral-codes - Iniciando...');
    
    // Crear cliente Supabase con service role key para operaciones administrativas
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    console.log('✅ Cliente Supabase administrativo creado');
    
    // Ejecutar el script SQL paso a paso
    const results = [];
    
    // 1. Crear función para limpiar nickname
    console.log('🔧 Creando función clean_nickname_for_referral...');
    const { error: functionError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION clean_nickname_for_referral(nickname TEXT)
        RETURNS TEXT AS $$
        BEGIN
          RETURN UPPER(REGEXP_REPLACE(nickname, '[^A-Z0-9]', '', 'g'));
        END;
        $$ LANGUAGE plpgsql;
      `
    });
    
    if (functionError) {
      console.warn('⚠️ Error creando función (puede que ya exista):', functionError);
    } else {
      results.push('✅ Función clean_nickname_for_referral creada');
    }
    
    // 2. Eliminar usuarios test
    console.log('🔧 Eliminando usuarios test...');
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('email', 'test@cryptoforce.com');
    
    if (deleteError) {
      console.warn('⚠️ Error eliminando usuarios test:', deleteError);
    } else {
      results.push('✅ Usuarios test eliminados');
    }

    // 2.5. Eliminar duplicados (mantener el más reciente)
    console.log('🔧 Eliminando duplicados...');
    const { data: duplicates, error: duplicatesError } = await supabase
      .from('users')
      .select('id, email, referral_code, created_at')
      .like('referral_code', 'CRYPTOFORCE-%')
      .order('referral_code')
      .order('created_at', { ascending: false });

    if (duplicatesError) {
      console.warn('⚠️ Error obteniendo duplicados:', duplicatesError);
    } else if (duplicates) {
      // Agrupar por referral_code y eliminar duplicados
      const seenCodes = new Set();
      const toDelete = [];
      
      for (const user of duplicates) {
        if (seenCodes.has(user.referral_code)) {
          toDelete.push(user.id);
        } else {
          seenCodes.add(user.referral_code);
        }
      }

      if (toDelete.length > 0) {
        const { error: deleteDuplicatesError } = await supabase
          .from('users')
          .delete()
          .in('id', toDelete);
        
        if (deleteDuplicatesError) {
          console.warn('⚠️ Error eliminando duplicados:', deleteDuplicatesError);
        } else {
          results.push(`✅ ${toDelete.length} duplicados eliminados`);
        }
      } else {
        results.push('✅ No se encontraron duplicados');
      }
    }
    
    // 3. Actualizar usuario Darth Luke específicamente
    console.log('🔧 Actualizando usuario Darth Luke...');
    const { error: darthLukeError } = await supabase
      .from('users')
      .update({ referral_code: 'CRYPTOFORCE-DARTHLUKE' })
      .eq('email', 'coeurdeluke.js@gmail.com')
      .eq('nickname', 'Darth Luke');
    
    if (darthLukeError) {
      console.warn('⚠️ Error actualizando Darth Luke:', darthLukeError);
    } else {
      results.push('✅ Usuario Darth Luke actualizado');
    }
    
    // 4. Actualizar otros usuarios con códigos incorrectos
    console.log('🔧 Actualizando otros usuarios...');
    const { data: usersToUpdate, error: fetchError } = await supabase
      .from('users')
      .select('id, nickname, email')
      .not('nickname', 'is', null)
      .neq('nickname', '')
      .neq('email', 'coeurdeluke.js@gmail.com');
    
    if (fetchError) {
      console.error('❌ Error obteniendo usuarios:', fetchError);
    } else {
      for (const user of usersToUpdate || []) {
        const cleanNickname = user.nickname.replace(/[^A-Z0-9]/g, '').toUpperCase();
        const newReferralCode = `CRYPTOFORCE-${cleanNickname}`;
        
        const { error: updateError } = await supabase
          .from('users')
          .update({ referral_code: newReferralCode })
          .eq('id', user.id);
        
        if (updateError) {
          console.warn(`⚠️ Error actualizando ${user.email}:`, updateError);
        } else {
          results.push(`✅ ${user.email} actualizado a ${newReferralCode}`);
        }
      }
    }
    
    // 5. Corregir códigos específicos
    console.log('🔧 Corrigiendo códigos específicos...');
    
    // Darth Nihilus
    const { error: darthNihilusError } = await supabase
      .from('users')
      .update({ referral_code: 'CRYPTOFORCE-DARTHNIHILUS' })
      .eq('email', 'infocryptoforce@gmail.com')
      .eq('nickname', 'Darth Nihilus');
    
    if (darthNihilusError) {
      console.warn('⚠️ Error actualizando Darth Nihilus:', darthNihilusError);
    } else {
      results.push('✅ Darth Nihilus actualizado');
    }
    
    // Pepe Pardo
    const { error: pepePardoError } = await supabase
      .from('users')
      .update({ referral_code: 'CRYPTOFORCE-PEPEPARDO' })
      .eq('email', 'keepcalmandgoahead.58@gmail.com')
      .eq('nickname', 'PepePardo');
    
    if (pepePardoError) {
      console.warn('⚠️ Error actualizando Pepe Pardo:', pepePardoError);
    } else {
      results.push('✅ Pepe Pardo actualizado');
    }
    
    // DCB
    const { error: dcbError } = await supabase
      .from('users')
      .update({ referral_code: 'CRYPTOFORCE-DCB' })
      .eq('email', 'doctorcobolblue@gmail.com')
      .eq('nickname', 'DCB');
    
    if (dcbError) {
      console.warn('⚠️ Error actualizando DCB:', dcbError);
    } else {
      results.push('✅ DCB actualizado');
    }
    
    // 6. Crear usuario de prueba
    console.log('🔧 Creando usuario de prueba...');
    const { data: testUser, error: testUserError } = await supabase
      .from('users')
      .upsert([{
        email: 'test@cryptoforce.com',
        nickname: 'DARTH LUKE',
        nombre: 'Darth',
        apellido: 'Luke',
        user_level: 5,
        referral_code: 'CRYPTOFORCE-DARTHLUKE',
        total_referrals: 0,
        uid: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }], { onConflict: 'email' })
      .select()
      .single();
    
    if (testUserError) {
      console.warn('⚠️ Error creando usuario de prueba:', testUserError);
    } else {
      results.push('✅ Usuario de prueba creado');
    }
    
    // 7. Verificar resultados finales
    console.log('🔧 Verificando resultados...');
    const { data: finalUsers, error: finalError } = await supabase
      .from('users')
      .select('email, nickname, referral_code, user_level')
      .like('referral_code', 'CRYPTOFORCE-%')
      .order('created_at', { ascending: false });
    
    if (finalError) {
      console.error('❌ Error obteniendo usuarios finales:', finalError);
    }
    
    console.log('✅ Script completado');
    
    return NextResponse.json({
      success: true,
      message: 'Códigos de referido actualizados exitosamente',
      results,
      finalUsers: finalUsers || []
    });

  } catch (error) {
    console.error('❌ Error en API de corrección de códigos:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
