-- =====================================================
-- SISTEMA DE INYECCIÓN DE CONTENIDO TRIBUNAL IMPERIAL
-- =====================================================
-- Este script crea las tablas necesarias para el sistema de inyección de contenido
-- que permite a los maestros crear contenido dinámico para cada nivel

-- =====================================================
-- TABLA 1: tribunal_content - Contenido creado por maestros
-- =====================================================
CREATE TABLE IF NOT EXISTS tribunal_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    level INTEGER NOT NULL CHECK (level >= 1 AND level <= 6),
    category VARCHAR(50) NOT NULL CHECK (category IN ('theoretical', 'practical')),
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('module', 'checkpoint', 'resource')),
    description TEXT,
    thumbnail_url TEXT,
    duration_minutes INTEGER DEFAULT 0,
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA 2: content_index - Índices de módulos
-- =====================================================
CREATE TABLE IF NOT EXISTS content_index (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id UUID REFERENCES tribunal_content(id) ON DELETE CASCADE,
    section_title VARCHAR(255) NOT NULL,
    section_description TEXT,
    section_order INTEGER NOT NULL,
    section_type VARCHAR(50) DEFAULT 'content' CHECK (section_type IN ('content', 'video', 'quiz', 'exercise', 'resource')),
    section_data JSONB, -- Datos específicos de la sección
    is_required BOOLEAN DEFAULT true,
    estimated_duration INTEGER DEFAULT 0, -- en minutos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA 3: content_sections - Secciones específicas de contenido
-- =====================================================
CREATE TABLE IF NOT EXISTS content_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    index_id UUID REFERENCES content_index(id) ON DELETE CASCADE,
    section_title VARCHAR(255) NOT NULL,
    section_content TEXT NOT NULL,
    section_type VARCHAR(50) DEFAULT 'text' CHECK (section_type IN ('text', 'html', 'markdown', 'code', 'image', 'video', 'link')),
    section_data JSONB, -- Metadatos adicionales
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA 4: content_injections - Inyecciones de contenido en dashboards
-- =====================================================
CREATE TABLE IF NOT EXISTS content_injections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id UUID REFERENCES tribunal_content(id) ON DELETE CASCADE,
    target_level INTEGER NOT NULL CHECK (target_level >= 1 AND target_level <= 6),
    target_dashboard VARCHAR(50) NOT NULL, -- 'iniciado', 'acolito', 'warrior', etc.
    injection_position VARCHAR(50) DEFAULT 'carousel' CHECK (injection_position IN ('carousel', 'sidebar', 'header', 'footer')),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    custom_styling JSONB, -- Estilos personalizados por nivel
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_tribunal_content_level ON tribunal_content(level);
CREATE INDEX IF NOT EXISTS idx_tribunal_content_category ON tribunal_content(category);
CREATE INDEX IF NOT EXISTS idx_tribunal_content_published ON tribunal_content(is_published);
CREATE INDEX IF NOT EXISTS idx_tribunal_content_created_by ON tribunal_content(created_by);
CREATE INDEX IF NOT EXISTS idx_content_index_content_id ON content_index(content_id);
CREATE INDEX IF NOT EXISTS idx_content_sections_index_id ON content_sections(index_id);
CREATE INDEX IF NOT EXISTS idx_content_injections_target ON content_injections(target_level, target_dashboard);

-- =====================================================
-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tribunal_content_updated_at BEFORE UPDATE ON tribunal_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_index_updated_at BEFORE UPDATE ON content_index FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_sections_updated_at BEFORE UPDATE ON content_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_injections_updated_at BEFORE UPDATE ON content_injections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS (ROW LEVEL SECURITY) - Solo maestros pueden crear/editar
-- =====================================================
ALTER TABLE tribunal_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_injections ENABLE ROW LEVEL SECURITY;

-- Política para tribunal_content: Solo maestros (nivel 6) y fundadores (nivel 0)
CREATE POLICY "Maestros pueden gestionar tribunal_content" ON tribunal_content
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND (users.user_level = 0 OR users.user_level = 6)
        )
    );

-- Política para content_index: Solo maestros
CREATE POLICY "Maestros pueden gestionar content_index" ON content_index
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND (users.user_level = 0 OR users.user_level = 6)
        )
    );

-- Política para content_sections: Solo maestros
CREATE POLICY "Maestros pueden gestionar content_sections" ON content_sections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND (users.user_level = 0 OR users.user_level = 6)
        )
    );

-- Política para content_injections: Solo maestros
CREATE POLICY "Maestros pueden gestionar content_injections" ON content_injections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND (users.user_level = 0 OR users.user_level = 6)
        )
    );

-- Política de lectura para todos los usuarios autenticados
CREATE POLICY "Usuarios pueden leer tribunal_content" ON tribunal_content
    FOR SELECT USING (auth.uid() IS NOT NULL AND is_published = true);

CREATE POLICY "Usuarios pueden leer content_index" ON content_index
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios pueden leer content_sections" ON content_sections
    FOR SELECT USING (auth.uid() IS NOT NULL AND is_published = true);

CREATE POLICY "Usuarios pueden leer content_injections" ON content_injections
    FOR SELECT USING (auth.uid() IS NOT NULL AND is_active = true);

-- =====================================================
-- DATOS INICIALES - Colores por nivel
-- =====================================================
INSERT INTO tribunal_content (title, subtitle, level, category, content_type, description, is_published, created_by) VALUES
('Sistema de Colores por Nivel', 'Configuración visual para cada rol', 0, 'theoretical', 'resource', 'Sistema de colores específicos para cada nivel de usuario', true, (SELECT id FROM auth.users WHERE email = 'coeurdeluke.js@gmail.com' LIMIT 1))
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- =====================================================
COMMENT ON TABLE tribunal_content IS 'Contenido creado por maestros para inyección en dashboards';
COMMENT ON TABLE content_index IS 'Índices de módulos que los usuarios verán al hacer click en "Comenzar"';
COMMENT ON TABLE content_sections IS 'Secciones específicas de contenido dentro de cada módulo';
COMMENT ON TABLE content_injections IS 'Configuración de inyección de contenido en dashboards específicos';

COMMENT ON COLUMN tribunal_content.level IS 'Nivel del usuario (1-6): 1=Iniciado, 2=Acólito, 3=Warrior, 4=Lord, 5=Darth, 6=Maestro';
COMMENT ON COLUMN tribunal_content.category IS 'Categoría: theoretical o practical';
COMMENT ON COLUMN tribunal_content.content_type IS 'Tipo de contenido: module, checkpoint, resource';
COMMENT ON COLUMN content_index.section_data IS 'Datos JSON específicos de la sección (enlaces, videos, etc.)';
COMMENT ON COLUMN content_sections.section_data IS 'Metadatos adicionales en formato JSON';
COMMENT ON COLUMN content_injections.custom_styling IS 'Estilos personalizados por nivel en formato JSON';
