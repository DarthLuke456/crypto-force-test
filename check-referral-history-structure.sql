-- Script para verificar la estructura real de la tabla referral_history
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar si la tabla referral_history existe
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_name = 'referral_history';

-- 2. Si existe, mostrar su estructura
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'referral_history' 
ORDER BY ordinal_position;

-- 3. Verificar si hay datos en la tabla
SELECT COUNT(*) as total_rows FROM referral_history;

-- 4. Mostrar algunos datos de ejemplo (si existen)
SELECT * FROM referral_history LIMIT 5;

-- 5. Verificar la estructura de la tabla users para entender las relaciones
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('referral_code', 'referred_by', 'id')
ORDER BY ordinal_position;
