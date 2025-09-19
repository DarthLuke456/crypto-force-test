const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDatabase() {
  console.log('🔍 Verificando base de datos...');
  
  try {
    // Verificar tabla tribunal_content
    console.log('\n📋 Verificando tabla tribunal_content...');
    const { data: tribunalContent, error: tribunalError } = await supabase
      .from('tribunal_content')
      .select('*')
      .limit(1);
    
    if (tribunalError) {
      console.error('❌ Error en tribunal_content:', tribunalError.message);
    } else {
      console.log('✅ tabla tribunal_content existe');
      console.log('📊 Registros encontrados:', tribunalContent?.length || 0);
    }

    // Verificar tabla content_injections
    console.log('\n📋 Verificando tabla content_injections...');
    const { data: injections, error: injectionError } = await supabase
      .from('content_injections')
      .select('*')
      .limit(1);
    
    if (injectionError) {
      console.error('❌ Error en content_injections:', injectionError.message);
    } else {
      console.log('✅ tabla content_injections existe');
      console.log('📊 Registros encontrados:', injections?.length || 0);
    }

    // Verificar contenido publicado
    console.log('\n📋 Verificando contenido publicado...');
    const { data: publishedContent, error: publishedError } = await supabase
      .from('tribunal_content')
      .select('*')
      .eq('is_published', true);
    
    if (publishedError) {
      console.error('❌ Error obteniendo contenido publicado:', publishedError.message);
    } else {
      console.log('✅ Contenido publicado encontrado:', publishedContent?.length || 0);
      if (publishedContent && publishedContent.length > 0) {
        console.log('📝 Contenido:', publishedContent.map(c => ({
          id: c.id,
          title: c.title,
          level: c.level,
          category: c.category,
          is_published: c.is_published
        })));
      }
    }

    // Verificar inyecciones activas
    console.log('\n📋 Verificando inyecciones activas...');
    const { data: activeInjections, error: activeError } = await supabase
      .from('content_injections')
      .select('*')
      .eq('is_active', true);
    
    if (activeError) {
      console.error('❌ Error obteniendo inyecciones activas:', activeError.message);
    } else {
      console.log('✅ Inyecciones activas encontradas:', activeInjections?.length || 0);
      if (activeInjections && activeInjections.length > 0) {
        console.log('📝 Inyecciones:', activeInjections.map(i => ({
          id: i.id,
          target_level: i.target_level,
          target_dashboard: i.target_dashboard,
          is_active: i.is_active
        })));
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkDatabase();
