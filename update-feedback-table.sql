-- Script para actualizar la tabla feedback con nickname y whatsapp
-- Ejecutar en Supabase SQL Editor

-- Agregar columnas si no existen
ALTER TABLE feedback 
ADD COLUMN IF NOT EXISTS nickname TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- Verificar que las columnas se agregaron correctamente
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'feedback' 
AND column_name IN ('nickname', 'whatsapp')
ORDER BY column_name;
