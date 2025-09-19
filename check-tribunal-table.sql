-- Script para verificar la estructura de la tabla tribunal_content
-- y crear la tabla si no existe

-- Verificar si la tabla existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'tribunal_content'
) as table_exists;

-- Si la tabla no existe, crearla
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

-- Verificar la estructura de la tabla
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'tribunal_content'
ORDER BY ordinal_position;

-- Verificar si hay datos en la tabla
SELECT COUNT(*) as total_records FROM tribunal_content;
