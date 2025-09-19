-- Script para crear la tabla tribunal_content con la estructura correcta
-- Ejecutar este script en Supabase SQL Editor

-- Eliminar tabla si existe (CUIDADO: esto borrará todos los datos)
DROP TABLE IF EXISTS tribunal_content CASCADE;

-- Crear tabla tribunal_content
CREATE TABLE tribunal_content (
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

-- Crear índices para mejor performance
CREATE INDEX idx_tribunal_content_level ON tribunal_content(level);
CREATE INDEX idx_tribunal_content_category ON tribunal_content(category);
CREATE INDEX idx_tribunal_content_published ON tribunal_content(is_published);
CREATE INDEX idx_tribunal_content_created_by ON tribunal_content(created_by);

-- Insertar datos de prueba
INSERT INTO tribunal_content (title, subtitle, content, level, category, is_published, created_by) VALUES
('Test Content 1', 'Test subtitle 1', '[{"id":"test-1","type":"text","content":"Test content 1","order":0}]', 1, 'theoretical', true, 'test@example.com'),
('Test Content 2', 'Test subtitle 2', '[{"id":"test-2","type":"text","content":"Test content 2","order":0}]', 2, 'practical', false, 'test@example.com');

-- Verificar la estructura
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'tribunal_content'
ORDER BY ordinal_position;

-- Verificar datos
SELECT COUNT(*) as total_records FROM tribunal_content;
