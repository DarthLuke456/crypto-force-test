-- Script para verificar si el feedback se está guardando correctamente
-- Ejecutar en Supabase SQL Editor

-- 1. Ver todos los feedbacks en la tabla
SELECT 
  id,
  user_id,
  message,
  response,
  response_by,
  response_at,
  status,
  created_at,
  updated_at
FROM feedback 
ORDER BY created_at DESC
LIMIT 10;

-- 2. Verificar si hay feedbacks para el usuario específico
SELECT 
  id,
  user_id,
  message,
  response,
  response_by,
  response_at,
  status,
  created_at,
  updated_at
FROM feedback 
WHERE user_id = '319b9f12-8019-4128-91fb-bbddc638cd38'
ORDER BY created_at DESC;

-- 3. Verificar la estructura de la tabla feedback
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'feedback' 
ORDER BY ordinal_position;

-- 4. Verificar si hay algún feedback reciente (últimas 24 horas)
SELECT 
  id,
  user_id,
  message,
  response,
  response_by,
  response_at,
  status,
  created_at,
  updated_at
FROM feedback 
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- 5. Contar total de feedbacks
SELECT COUNT(*) as total_feedbacks FROM feedback;
