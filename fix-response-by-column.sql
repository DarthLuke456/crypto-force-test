-- Arreglar la columna response_by para usar email en lugar de UUID
-- Ejecutar en Supabase SQL Editor

-- 1. Eliminar la foreign key constraint si existe
ALTER TABLE feedback DROP CONSTRAINT IF EXISTS feedback_response_by_fkey;

-- 2. Cambiar el tipo de la columna response_by de UUID a TEXT
ALTER TABLE feedback ALTER COLUMN response_by TYPE TEXT;

-- 3. Verificar el cambio
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'feedback' AND column_name = 'response_by';
