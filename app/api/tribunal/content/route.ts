import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// POST - Crear nuevo contenido del Tribunal Imperial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, content, level, category, is_published, created_by } = body;

    console.log('📝 Creando contenido del Tribunal Imperial:', {
      title,
      subtitle,
      level,
      category,
      is_published,
      created_by,
      bodyKeys: Object.keys(body)
    });

    // Validar datos requeridos
    if (!title || !level || !category || !created_by) {
      console.error('❌ Datos faltantes:', {
        hasTitle: !!title,
        hasLevel: !!level,
        hasCategory: !!category,
        hasCreatedBy: !!created_by,
        receivedData: body
      });
      return NextResponse.json({ 
        error: 'Faltan datos requeridos: title, level, category, created_by',
        received: body
      }, { status: 400 });
    }

    // Crear contenido en la base de datos
    const insertData = {
      title: String(title),
      subtitle: String(subtitle || ''),
      content: Array.isArray(content) ? content : [],
      level: parseInt(String(level)),
      category: String(category),
      is_published: Boolean(is_published),
      is_featured: false,
      sort_order: 0,
      created_by: String(created_by),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('📝 Datos a insertar:', insertData);

    const { data: tribunalContent, error: contentError } = await supabase
      .from('tribunal_content')
      .insert(insertData)
      .select()
      .single();

    if (contentError) {
      console.error('❌ Error creando contenido:', contentError);
      return NextResponse.json({ 
        error: `Error creando contenido: ${contentError.message}` 
      }, { status: 500 });
    }

    console.log('✅ Contenido creado exitosamente:', tribunalContent);

    return NextResponse.json({
      success: true,
      id: tribunalContent.id,
      message: 'Contenido creado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error en API de contenido:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}

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
      .order('created_at', { ascending: false });

    if (level) {
      query = query.eq('level', parseInt(level));
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (published === 'true') {
      query = query.eq('is_published', true);
    }

    const { data: content, error } = await query;

    if (error) {
      console.error('❌ Error obteniendo contenido:', error);
      return NextResponse.json({ 
        error: `Error obteniendo contenido: ${error.message}` 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      content: content || []
    });

  } catch (error) {
    console.error('❌ Error en API de contenido:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}