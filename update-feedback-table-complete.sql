-- Script para actualizar la tabla feedback con todas las columnas necesarias
-- Ejecutar en Supabase SQL Editor

-- Agregar columnas si no existen
ALTER TABLE feedback 
ADD COLUMN IF NOT EXISTS nickname TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS response TEXT,
ADD COLUMN IF NOT EXISTS response_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS response_at TIMESTAMP WITH TIME ZONE;

-- Verificar que las columnas se agregaron correctamente
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'feedback' 
ORDER BY ordinal_position;
