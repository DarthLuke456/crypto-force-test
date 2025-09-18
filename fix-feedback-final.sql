-- Script FINAL para arreglar feedback con datos REALES
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar datos reales en users
SELECT 
  'Datos en users' as fuente,
  id,
  email,
  nickname,
  movil,
  created_at
FROM users 
WHERE email = 'coeurdeluke.js@gmail.com';

-- 2. Actualizar feedback con datos reales
UPDATE feedback 
SET 
  nickname = u.nickname,
  whatsapp = u.movil
FROM users u
WHERE feedback.email = u.email;

-- 3. Verificar resultado
SELECT 
  'Feedback actualizado' as fuente,
  id,
  email,
  nickname,
  whatsapp,
  created_at
FROM feedback 
WHERE email = 'coeurdeluke.js@gmail.com';
