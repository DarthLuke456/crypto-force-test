-- Verificar estructura de la tabla feedback
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'feedback' 
ORDER BY ordinal_position;

-- Verificar si existen las columnas necesarias para responder
SELECT 
  'response' as column_name,
  EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback' AND column_name = 'response') as exists
UNION ALL
SELECT 
  'response_by' as column_name,
  EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback' AND column_name = 'response_by') as exists
UNION ALL
SELECT 
  'response_at' as column_name,
  EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback' AND column_name = 'response_at') as exists
UNION ALL
SELECT 
  'status' as column_name,
  EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback' AND column_name = 'status') as exists;
