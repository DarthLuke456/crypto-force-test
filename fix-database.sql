-- Script para verificar y corregir la estructura de la tabla users
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar la estructura actual de la tabla users
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- 2. Agregar la columna codigo_referido si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'codigo_referido'
    ) THEN
        ALTER TABLE users ADD COLUMN codigo_referido VARCHAR(50);
        RAISE NOTICE 'Columna codigo_referido agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna codigo_referido ya existe';
    END IF;
END $$;

-- 3. Verificar la estructura final
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
