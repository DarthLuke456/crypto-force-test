-- Script simplificado para crear solo las tablas faltantes
-- Ejecutar este script en Supabase SQL Editor

-- 1. Crear tabla content_injections (si no existe)
CREATE TABLE IF NOT EXISTS content_injections (
    id SERIAL PRIMARY KEY,
    content_id INTEGER NOT NULL,
    target_level INTEGER NOT NULL CHECK (target_level >= 0 AND target_level <= 6),
    target_dashboard VARCHAR(100) NOT NULL,
    injection_position VARCHAR(50) DEFAULT 'carousel',
    display_order INTEGER DEFAULT 0,
    custom_styling JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear tabla content_index (si no existe)
CREATE TABLE IF NOT EXISTS content_index (
    id SERIAL PRIMARY KEY,
    content_id INTEGER NOT NULL,
    section_title VARCHAR(255) NOT NULL,
    section_description TEXT,
    section_order INTEGER NOT NULL,
    section_type VARCHAR(50) NOT NULL DEFAULT 'content',
    section_data JSONB,
    is_required BOOLEAN DEFAULT TRUE,
    estimated_duration INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear tabla content_sections (si no existe)
CREATE TABLE IF NOT EXISTS content_sections (
    id SERIAL PRIMARY KEY,
    index_id INTEGER NOT NULL,
    section_title VARCHAR(255) NOT NULL,
    section_content TEXT NOT NULL,
    section_type VARCHAR(50) NOT NULL DEFAULT 'text',
    section_data JSONB,
    sort_order INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Crear índices
CREATE INDEX IF NOT EXISTS idx_content_injections_target ON content_injections(target_level, target_dashboard);
CREATE INDEX IF NOT EXISTS idx_content_injections_active ON content_injections(is_active);
CREATE INDEX IF NOT EXISTS idx_content_injections_content ON content_injections(content_id);

CREATE INDEX IF NOT EXISTS idx_content_index_content ON content_index(content_id);
CREATE INDEX IF NOT EXISTS idx_content_index_order ON content_index(section_order);

CREATE INDEX IF NOT EXISTS idx_content_sections_index ON content_sections(index_id);
CREATE INDEX IF NOT EXISTS idx_content_sections_published ON content_sections(is_published);
CREATE INDEX IF NOT EXISTS idx_content_sections_order ON content_sections(sort_order);

-- 5. Insertar datos de prueba usando IDs existentes
-- Primero verificar qué IDs existen
SELECT 'IDs disponibles en tribunal_content:' as info;
SELECT id, title, category FROM tribunal_content ORDER BY id;

-- Insertar inyecciones usando IDs existentes
INSERT INTO content_injections (content_id, target_level, target_dashboard, injection_position, display_order, is_active) 
SELECT 
    id as content_id,
    1 as target_level,
    'iniciado' as target_dashboard,
    'carousel' as injection_position,
    ROW_NUMBER() OVER (ORDER BY id) as display_order,
    true as is_active
FROM tribunal_content 
WHERE level = 1 AND is_published = true
ON CONFLICT DO NOTHING;

-- 6. Verificar que todo se creó correctamente
SELECT 'Tablas creadas:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('tribunal_content', 'content_injections', 'content_index', 'content_sections')
ORDER BY table_name;

SELECT 'Inyecciones creadas:' as info;
SELECT 
    ci.id,
    ci.content_id,
    ci.target_level,
    ci.target_dashboard,
    tc.title as content_title,
    tc.category
FROM content_injections ci
LEFT JOIN tribunal_content tc ON ci.content_id = tc.id
ORDER BY ci.display_order;
