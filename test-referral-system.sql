-- Script para probar el sistema de referidos
-- Ejecutar en Supabase SQL Editor después de aplicar los scripts anteriores

-- 1. Verificar que la columna total_referrals existe
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'total_referrals';

-- 2. Verificar que el trigger existe
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_update_total_referrals';

-- 3. Verificar el estado actual de los usuarios
SELECT 
  id,
  nickname,
  email,
  user_level,
  referral_code,
  total_referrals,
  created_at
FROM users 
ORDER BY total_referrals DESC, created_at DESC;

-- 4. Verificar si existe la tabla referral_history
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_name = 'referral_history';

-- 5. Verificar la estructura de referral_history
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'referral_history' 
ORDER BY ordinal_position;

-- 6. Verificar si hay datos en referral_history
SELECT 
  COUNT(*) as total_referrals,
  COUNT(DISTINCT referrer_email) as unique_referrers,
  COUNT(DISTINCT referred_email) as unique_referred
FROM referral_history;

-- 7. Mostrar el historial de referidos si existe
SELECT 
  rh.id,
  rh.referrer_email,
  rh.referred_email,
  rh.referrer_code,
  rh.referral_date,
  rh.created_at
FROM referral_history rh
ORDER BY rh.created_at DESC;

-- 8. Verificar la relación entre users y referral_history
SELECT 
  u.nickname,
  u.email,
  u.referral_code,
  u.total_referrals,
  COUNT(rh.id) as actual_referrals
FROM users u
LEFT JOIN referral_history rh ON u.email = rh.referrer_email
GROUP BY u.id, u.nickname, u.email, u.referral_code, u.total_referrals
ORDER BY u.total_referrals DESC;
