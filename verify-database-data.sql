-- Script para verificar los datos reales en la base de datos
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar la estructura de la tabla users
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- 2. Verificar todos los usuarios con sus datos completos
SELECT 
  id,
  email,
  nickname,
  nombre,
  apellido,
  movil,
  exchange,
  user_level,
  referral_code,
  referred_by,
  total_referrals,
  created_at,
  updated_at
FROM users 
ORDER BY created_at DESC;

-- 3. Verificar usuarios específicos (fundadores)
SELECT 
  id,
  email,
  nickname,
  nombre,
  apellido,
  user_level,
  referral_code,
  total_referrals,
  created_at
FROM users 
WHERE email IN ('infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com')
ORDER BY created_at DESC;

-- 4. Verificar si hay campos NULL o vacíos
SELECT 
  COUNT(*) as total_users,
  COUNT(nombre) as users_with_nombre,
  COUNT(apellido) as users_with_apellido,
  COUNT(movil) as users_with_movil,
  COUNT(exchange) as users_with_exchange,
  COUNT(referral_code) as users_with_referral_code,
  COUNT(total_referrals) as users_with_total_referrals
FROM users;

-- 5. Verificar la distribución de niveles de usuario
SELECT 
  user_level,
  COUNT(*) as user_count,
  CASE user_level
    WHEN 0 THEN 'Maestro'
    WHEN 1 THEN 'Iniciado'
    WHEN 2 THEN 'Acólito'
    WHEN 3 THEN 'Warrior'
    WHEN 4 THEN 'Lord'
    WHEN 5 THEN 'Darth'
    ELSE 'Desconocido'
  END as level_name
FROM users 
GROUP BY user_level 
ORDER BY user_level;

-- 6. Verificar la distribución de referidos
SELECT 
  total_referrals,
  COUNT(*) as user_count
FROM users 
GROUP BY total_referrals 
ORDER BY total_referrals DESC;
