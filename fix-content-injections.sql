-- Script para corregir la tabla content_injections
-- Ejecutar este script en Supabase SQL Editor

-- 1. Verificar la estructura actual de content_injections
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'content_injections'
ORDER BY ordinal_position;

-- 2. Si content_id es UUID, necesitamos obtener los IDs reales de tribunal_content
-- Primero, verificar qué IDs existen en tribunal_content
SELECT id, title FROM tribunal_content ORDER BY id;

-- 3. Eliminar la tabla content_injections si existe y recrearla con el tipo correcto
DROP TABLE IF EXISTS content_injections CASCADE;

-- 4. Crear tabla content_injections con el tipo correcto
CREATE TABLE content_injections (
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

-- 5. Crear índices
CREATE INDEX idx_content_injections_target ON content_injections(target_level, target_dashboard);
CREATE INDEX idx_content_injections_active ON content_injections(is_active);
CREATE INDEX idx_content_injections_content ON content_injections(content_id);

-- 6. Insertar inyecciones de contenido usando los IDs reales de tribunal_content
-- Primero obtener los IDs reales
DO $$
DECLARE
    theoretical_id INTEGER;
    practical_id INTEGER;
BEGIN
    -- Obtener el ID del contenido teórico
    SELECT id INTO theoretical_id 
    FROM tribunal_content 
    WHERE title = 'Módulo Teórico 1' AND category = 'theoretical' 
    LIMIT 1;
    
    -- Obtener el ID del contenido práctico
    SELECT id INTO practical_id 
    FROM tribunal_content 
    WHERE title = 'Módulo Práctico 1' AND category = 'practical' 
    LIMIT 1;
    
    -- Insertar inyecciones si los contenidos existen
    IF theoretical_id IS NOT NULL THEN
        INSERT INTO content_injections (content_id, target_level, target_dashboard, injection_position, display_order, is_active) 
        VALUES (theoretical_id, 1, 'iniciado', 'carousel', 1, true)
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF practical_id IS NOT NULL THEN
        INSERT INTO content_injections (content_id, target_level, target_dashboard, injection_position, display_order, is_active) 
        VALUES (practical_id, 1, 'iniciado', 'carousel', 2, true)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 7. Verificar que las inyecciones se crearon correctamente
SELECT 
    ci.id,
    ci.content_id,
    ci.target_level,
    ci.target_dashboard,
    tc.title as content_title,
    tc.category
FROM content_injections ci
JOIN tribunal_content tc ON ci.content_id = tc.id
ORDER BY ci.display_order;
