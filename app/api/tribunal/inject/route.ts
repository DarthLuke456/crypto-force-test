import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - Obtener contenido inyectado para un dashboard específico
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetLevel = searchParams.get('targetLevel');
    const targetDashboard = searchParams.get('targetDashboard');
    const category = searchParams.get('category');

    if (!targetLevel || !targetDashboard) {
      return NextResponse.json({ error: 'targetLevel y targetDashboard son requeridos' }, { status: 400 });
    }

    // Obtener inyecciones activas para el dashboard objetivo
    const { data: injections, error: injectionError } = await supabase
      .from('content_injections')
      .select(`
        *,
        tribunal_content (*)
      `)
      .eq('target_level', parseInt(targetLevel))
      .eq('target_dashboard', targetDashboard)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (injectionError) {
      console.error('Error fetching content injections:', injectionError);
      return NextResponse.json({ error: injectionError.message }, { status: 500 });
    }

    // Filtrar contenido por categoría si se especifica
    let content = injections?.map(injection => injection.tribunal_content).filter(Boolean) || [];
    
    if (category) {
      content = content.filter(item => item.category === category);
    }

    // Filtrar solo contenido publicado
    content = content.filter(item => item.is_published);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error in tribunal injection API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST - Crear nueva inyección de contenido
export async function POST(request: NextRequest) {
  try {
    // Para auto-aprobación, no requerir autenticación
    const authHeader = request.headers.get('authorization');
    let isAuthorized = false;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (!authError && user) {
        // Verificar que es maestro
        const { data: userProfile } = await supabase
          .from('users')
          .select('user_level, email')
          .eq('id', user.id)
          .single();

        if (userProfile && (userProfile.user_level === 0 || userProfile.user_level === 6)) {
          isAuthorized = true;
        }
      }
    }

    // Si no está autorizado, verificar si es una auto-aprobación
    if (!isAuthorized) {
      console.log('⚠️ Sin autenticación - asumiendo auto-aprobación');
    }

    const body = await request.json();
    const { 
      contentId, 
      targetLevel, 
      targetDashboard, 
      injectionPosition, 
      displayOrder, 
      customStyling,
      isActive 
    } = body;

    // Mapear a nombres de base de datos
    const content_id = contentId;
    const target_level = targetLevel;
    const target_dashboard = targetDashboard;
    const injection_position = injectionPosition || 'carousel';
    const display_order = displayOrder || 0;
    const custom_styling = customStyling;
    const is_active = isActive !== undefined ? isActive : true;

    // Validar datos requeridos
    if (!content_id || !target_level || !target_dashboard) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    // Validar nivel
    if (target_level < 0 || target_level > 6) {
      return NextResponse.json({ error: 'Nivel objetivo inválido' }, { status: 400 });
    }

    // Validar posición de inyección
    const validPositions = ['carousel', 'sidebar', 'header', 'footer'];
    if (injection_position && !validPositions.includes(injection_position)) {
      return NextResponse.json({ error: 'Posición de inyección inválida' }, { status: 400 });
    }

    // Verificar que el contenido existe
    const { data: content, error: contentError } = await supabase
      .from('tribunal_content')
      .select('id, level')
      .eq('id', content_id)
      .single();

    if (contentError || !content) {
      return NextResponse.json({ error: 'Contenido no encontrado' }, { status: 404 });
    }

    const { data: newInjection, error: insertError } = await supabase
      .from('content_injections')
      .insert([{
        content_id,
        target_level: parseInt(target_level),
        target_dashboard,
        injection_position,
        display_order,
        custom_styling: custom_styling || null,
        is_active
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating content injection:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ injection: newInjection }, { status: 201 });
  } catch (error) {
    console.error('Error in tribunal injection creation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT - Actualizar inyección existente
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Verificar que es maestro
    const { data: userProfile } = await supabase
      .from('users')
      .select('user_level, email')
      .eq('id', user.id)
      .single();

    if (!userProfile || (userProfile.user_level !== 0 && userProfile.user_level !== 6)) {
      return NextResponse.json({ error: 'Solo los maestros pueden editar inyecciones' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID de inyección requerido' }, { status: 400 });
    }

    const { data: updatedInjection, error: updateError } = await supabase
      .from('content_injections')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating content injection:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ injection: updatedInjection });
  } catch (error) {
    console.error('Error in tribunal injection update:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE - Eliminar inyección
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Verificar que es maestro
    const { data: userProfile } = await supabase
      .from('users')
      .select('user_level, email')
      .eq('id', user.id)
      .single();

    if (!userProfile || (userProfile.user_level !== 0 && userProfile.user_level !== 6)) {
      return NextResponse.json({ error: 'Solo los maestros pueden eliminar inyecciones' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de inyección requerido' }, { status: 400 });
    }

    const { error: deleteError } = await supabase
      .from('content_injections')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting content injection:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in tribunal injection deletion:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
