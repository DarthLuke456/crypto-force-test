-- Script para verificar feedbacks en la base de datos
-- Ejecutar en Supabase SQL Editor

-- 1. Ver todos los feedbacks existentes
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
ORDER BY created_at DESC;

-- 2. Ver usuarios en auth.users
SELECT 
  id,
  email,
  created_at,
  user_metadata
FROM auth.users 
ORDER BY created_at DESC;

-- 3. Ver usuarios en tabla users
SELECT 
  id,
  email,
  nickname,
  movil,
  user_level,
  created_at
FROM users 
ORDER BY created_at DESC;

-- 4. Verificar si hay feedbacks para usuarios específicos
SELECT 
  f.id,
  f.user_id,
  f.message,
  f.status,
  f.created_at,
  u.email as user_email,
  u.nickname as user_nickname
FROM feedback f
LEFT JOIN auth.users u ON f.user_id = u.id
ORDER BY f.created_at DESC;

-- 5. Contar feedbacks por usuario
SELECT 
  f.user_id,
  u.email,
  COUNT(f.id) as feedback_count
FROM feedback f
LEFT JOIN auth.users u ON f.user_id = u.id
GROUP BY f.user_id, u.email
ORDER BY feedback_count DESC;
