import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - Obtener contenido del Tribunal Imperial
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const category = searchParams.get('category');
    const published = searchParams.get('published');

    let query = supabase
      .from('tribunal_content')
      .select('*')
      .order('sort_order', { ascending: true });

    if (level) {
      query = query.eq('level', parseInt(level));
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (published === 'true') {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tribunal content:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ content: data || [] });
  } catch (error) {
    console.error('Error in tribunal content API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST - Crear nuevo contenido
export async function POST(request: NextRequest) {
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
      return NextResponse.json({ error: 'Solo los maestros pueden crear contenido' }, { status: 403 });
    }

    const body = await request.json();
    const { title, subtitle, level, category, content_type, description, duration_minutes, difficulty_level, is_published, is_featured } = body;

    // Validar datos requeridos
    if (!title || !level || !category || !content_type) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    // Validar nivel
    if (level < 0 || level > 6) {
      return NextResponse.json({ error: 'Nivel inválido' }, { status: 400 });
    }

    // Validar categoría
    if (!['theoretical', 'practical'].includes(category)) {
      return NextResponse.json({ error: 'Categoría inválida' }, { status: 400 });
    }

    // Validar tipo de contenido
    if (!['module', 'checkpoint', 'resource'].includes(content_type)) {
      return NextResponse.json({ error: 'Tipo de contenido inválido' }, { status: 400 });
    }

    const { data: newContent, error: insertError } = await supabase
      .from('tribunal_content')
      .insert([{
        title,
        subtitle: subtitle || '',
        level,
        category,
        content_type,
        description: description || '',
        duration_minutes: duration_minutes || 0,
        difficulty_level: difficulty_level || 1,
        is_published: is_published || false,
        is_featured: is_featured || false,
        created_by: user.id
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating tribunal content:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ content: newContent }, { status: 201 });
  } catch (error) {
    console.error('Error in tribunal content creation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT - Actualizar contenido existente
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
      return NextResponse.json({ error: 'Solo los maestros pueden editar contenido' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID de contenido requerido' }, { status: 400 });
    }

    // Validar nivel si se proporciona
    if (updateData.level && (updateData.level < 0 || updateData.level > 6)) {
      return NextResponse.json({ error: 'Nivel inválido' }, { status: 400 });
    }

    const { data: updatedContent, error: updateError } = await supabase
      .from('tribunal_content')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating tribunal content:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ content: updatedContent });
  } catch (error) {
    console.error('Error in tribunal content update:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE - Eliminar contenido
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
      return NextResponse.json({ error: 'Solo los maestros pueden eliminar contenido' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de contenido requerido' }, { status: 400 });
    }

    const { error: deleteError } = await supabase
      .from('tribunal_content')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting tribunal content:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in tribunal content deletion:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
