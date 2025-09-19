-- Script completo para crear todas las tablas del sistema Tribunal Imperial
-- Ejecutar este script en Supabase SQL Editor

-- 1. Crear tabla tribunal_content (si no existe)
CREATE TABLE IF NOT EXISTS tribunal_content (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    content JSONB DEFAULT '[]'::jsonb,
    level INTEGER NOT NULL CHECK (level >= 0 AND level <= 6),
    category VARCHAR(50) NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear tabla content_injections
CREATE TABLE IF NOT EXISTS content_injections (
    id SERIAL PRIMARY KEY,
    content_id INTEGER NOT NULL REFERENCES tribunal_content(id) ON DELETE CASCADE,
    target_level INTEGER NOT NULL CHECK (target_level >= 0 AND target_level <= 6),
    target_dashboard VARCHAR(100) NOT NULL,
    injection_position VARCHAR(50) DEFAULT 'carousel',
    display_order INTEGER DEFAULT 0,
    custom_styling JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear tabla content_index
CREATE TABLE IF NOT EXISTS content_index (
    id SERIAL PRIMARY KEY,
    content_id INTEGER NOT NULL REFERENCES tribunal_content(id) ON DELETE CASCADE,
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

-- 4. Crear tabla content_sections
CREATE TABLE IF NOT EXISTS content_sections (
    id SERIAL PRIMARY KEY,
    index_id INTEGER NOT NULL REFERENCES content_index(id) ON DELETE CASCADE,
    section_title VARCHAR(255) NOT NULL,
    section_content TEXT NOT NULL,
    section_type VARCHAR(50) NOT NULL DEFAULT 'text',
    section_data JSONB,
    sort_order INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_tribunal_content_level ON tribunal_content(level);
CREATE INDEX IF NOT EXISTS idx_tribunal_content_category ON tribunal_content(category);
CREATE INDEX IF NOT EXISTS idx_tribunal_content_published ON tribunal_content(is_published);
CREATE INDEX IF NOT EXISTS idx_tribunal_content_created_by ON tribunal_content(created_by);

CREATE INDEX IF NOT EXISTS idx_content_injections_target ON content_injections(target_level, target_dashboard);
CREATE INDEX IF NOT EXISTS idx_content_injections_active ON content_injections(is_active);
CREATE INDEX IF NOT EXISTS idx_content_injections_content ON content_injections(content_id);

CREATE INDEX IF NOT EXISTS idx_content_index_content ON content_index(content_id);
CREATE INDEX IF NOT EXISTS idx_content_index_order ON content_index(section_order);

CREATE INDEX IF NOT EXISTS idx_content_sections_index ON content_sections(index_id);
CREATE INDEX IF NOT EXISTS idx_content_sections_published ON content_sections(is_published);
CREATE INDEX IF NOT EXISTS idx_content_sections_order ON content_sections(sort_order);

-- 6. Insertar datos de prueba
INSERT INTO tribunal_content (title, subtitle, content, level, category, is_published, created_by) VALUES
('Módulo Teórico 1', 'Fundamentos del Trading', '[{"id":"block-1","type":"title","content":"Fundamentos del Trading","order":0},{"id":"block-2","type":"text","content":"En este módulo aprenderás los conceptos básicos del trading.","order":1}]', 1, 'theoretical', true, 'coeurdeluke.js@gmail.com'),
('Módulo Práctico 1', 'Primeras Operaciones', '[{"id":"block-1","type":"title","content":"Primeras Operaciones","order":0},{"id":"block-2","type":"text","content":"Aprende a realizar tus primeras operaciones de trading.","order":1}]', 1, 'practical', true, 'coeurdeluke.js@gmail.com')
ON CONFLICT DO NOTHING;

-- 7. Crear inyecciones de contenido para el dashboard iniciado
INSERT INTO content_injections (content_id, target_level, target_dashboard, injection_position, display_order, is_active) VALUES
(1, 1, 'iniciado', 'carousel', 1, true),
(2, 1, 'iniciado', 'carousel', 2, true)
ON CONFLICT DO NOTHING;

-- 8. Verificar que las tablas se crearon correctamente
SELECT 
    'tribunal_content' as table_name, 
    COUNT(*) as record_count 
FROM tribunal_content
UNION ALL
SELECT 
    'content_injections' as table_name, 
    COUNT(*) as record_count 
FROM content_injections
UNION ALL
SELECT 
    'content_index' as table_name, 
    COUNT(*) as record_count 
FROM content_index
UNION ALL
SELECT 
    'content_sections' as table_name, 
    COUNT(*) as record_count 
FROM content_sections;
