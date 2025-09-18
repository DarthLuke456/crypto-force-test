-- Script para actualizar feedback con datos REALES de la tabla users
-- Ejecutar en Supabase SQL Editor

-- 1. Actualizar feedbacks con datos reales de la tabla users
UPDATE feedback 
SET 
  nickname = u.nickname,
  whatsapp = u.movil
FROM users u
WHERE feedback.email = u.email;

-- 2. Verificar que se actualizó correctamente
SELECT 
  'Feedback actualizado' as tipo,
  f.id,
  f.email, 
  f.nickname,
  f.whatsapp,
  f.created_at
FROM feedback f
WHERE f.email = 'coeurdeluke.js@gmail.com'

UNION ALL

SELECT 
  'Datos originales en users' as tipo,
  u.id::text,
  u.email, 
  u.nickname,
  u.movil,
  u.created_at
FROM users u
WHERE u.email = 'coeurdeluke.js@gmail.com';
