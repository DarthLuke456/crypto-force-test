import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Profile Test Update API - Iniciando test');
    
    // Parse request body
    let testData: any;
    try {
      const requestBody = await request.text();
      console.log('🔍 Profile Test Update API - Request body:', requestBody);
      testData = JSON.parse(requestBody);
    } catch (parseError) {
      console.error('❌ Profile Test Update API - Error parsing body:', parseError);
      return NextResponse.json({ 
        error: 'Error parsing request body',
        details: parseError instanceof Error ? parseError.message : 'Error desconocido'
      }, { status: 400 });
    }

    const { email, testField = 'test_nickname' } = testData;
    if (!email) {
      return NextResponse.json({ 
        error: 'Email es requerido para el test' 
      }, { status: 400 });
    }

    console.log('🔍 Profile Test Update API - Testing with email:', email);

    // Crear cliente con service role para operaciones de base de datos
    let supabase;
    try {
      supabase = createClient(supabaseUrl, supabaseServiceKey);
      console.log('✅ Profile Test Update API - Cliente Supabase creado');
    } catch (serviceError) {
      console.error('❌ Profile Test Update API - Error creando cliente:', serviceError);
      return NextResponse.json({ 
        error: 'Error creando cliente de base de datos',
        details: serviceError instanceof Error ? serviceError.message : 'Error desconocido'
      }, { status: 500 });
    }

    // Test 1: Check if user exists
    console.log('🔍 Profile Test Update API - Test 1: Verificando si el usuario existe');
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError) {
      console.error('❌ Profile Test Update API - Error obteniendo usuario:', fetchError);
      return NextResponse.json({ 
        error: 'Error obteniendo usuario',
        details: fetchError.message
      }, { status: 500 });
    }

    if (!existingUser) {
      console.log('❌ Profile Test Update API - Usuario no encontrado');
      return NextResponse.json({ 
        error: 'Usuario no encontrado',
        details: 'No se encontró el usuario con el email proporcionado'
      }, { status: 404 });
    }

    console.log('✅ Profile Test Update API - Usuario encontrado:', existingUser.email);

    // Test 2: Try a simple update
    console.log('🔍 Profile Test Update API - Test 2: Intentando actualización simple');
    const testValue = `test_${Date.now()}`;
    const updateData = {
      [testField]: testValue,
      updated_at: new Date().toISOString()
    };

    console.log('🔍 Profile Test Update API - Datos de actualización:', updateData);

    const { data: updateResult, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('email', email)
      .select();

    if (updateError) {
      console.error('❌ Profile Test Update API - Error en actualización:', updateError);
      return NextResponse.json({ 
        error: 'Error en actualización',
        details: updateError.message,
        code: updateError.code,
        hint: updateError.hint
      }, { status: 500 });
    }

    console.log('✅ Profile Test Update API - Actualización exitosa:', updateResult);

    // Test 3: Verify the update
    console.log('🔍 Profile Test Update API - Test 3: Verificando actualización');
    const { data: verifyResult, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (verifyError) {
      console.error('❌ Profile Test Update API - Error verificando actualización:', verifyError);
      return NextResponse.json({ 
        error: 'Error verificando actualización',
        details: verifyError.message
      }, { status: 500 });
    }

    console.log('✅ Profile Test Update API - Verificación exitosa:', verifyResult);

    // Test 4: Reset the test data
    console.log('🔍 Profile Test Update API - Test 4: Reseteando datos de test');
    const resetData = {
      [testField]: existingUser[testField] || '',
      updated_at: new Date().toISOString()
    };

    const { data: resetResult, error: resetError } = await supabase
      .from('users')
      .update(resetData)
      .eq('email', email)
      .select();

    if (resetError) {
      console.error('❌ Profile Test Update API - Error reseteando datos:', resetError);
      // Don't return error here, just log it
    } else {
      console.log('✅ Profile Test Update API - Reset exitoso:', resetResult);
    }

    return NextResponse.json({
      success: true,
      message: 'Test de actualización completado exitosamente',
      tests: {
        userExists: !!existingUser,
        updateSuccessful: !!updateResult,
        verificationSuccessful: !!verifyResult,
        resetSuccessful: !resetError
      },
      originalData: existingUser,
      updatedData: verifyResult,
      testField: testField,
      testValue: testValue
    });

  } catch (error) {
    console.error('❌ Profile Test Update API - Error interno:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
